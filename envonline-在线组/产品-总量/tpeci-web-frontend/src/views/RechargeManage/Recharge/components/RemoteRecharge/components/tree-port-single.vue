<!-- 下拉框选择器 -- 树状结构选项 接口扁平化数据 + 多选
<select-tree
  :options=[选项数据]
  v-model=[绑定变量]
  field=[{ name: '', key: '' }
  defaultValue=[默认显示值]
/>
-->

<template>
  <!--
    empty-text                内容为空时展示的文本
    expand-on-click-node      是否在点击节点的时候展开或者收缩节点, 默认为true
    accordion                 是否每次只打开一个同级树节点展开
    data                      绑定数据
    props                     配置选项
    lazy                      是否懒加载子节点，需与 load 方法结合使用
    load                      加载子树数据的方法，仅当 lazy 属性为true 时生效
    default-expand-all        是否默认展开所有子节点
    node-key                  各节点唯一标识
    filter-node-method        对树节点进行筛选的方法
    render-content            树节点内容区的渲染
    node-clik                 节点被点击时的回调
  -->
  <el-tree
    ref="tree"
    empty-text="无数据"
    :style="{ width: treeWidth }"
    :expand-on-click-node="false"
    :accordion="accordion"
    :data="treeOptions"
    :props="propsMerge"
    :highlight-current="highlightCurrent"
    :default-expand-all="defaultExpandAll"
    :node-key="propsMerge.value"
    :filter-node-method="filterNode"
    :render-content="renderContent"
    @node-click="nodeClick">
  </el-tree>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'TreePortSingle',
  model: {                  // v-model进行拆分 value 是值
    prop: 'value',
    event: 'input',
  },
  props: {
    value: String,            // 接收绑定参数 v-model 的值部分,对应this.$model.prop
    clearable: Boolean,      // 是否可以清空选项
    disabled: Boolean,       // 禁用
    filterable: Boolean,     // 启用搜索功能
    accordion: Boolean,      // 是否每次只能有一个同级树节点展开
    width: {                 // 选择框宽度
      type: String,
      default: '200px',
    },
    treeWidth: {             // 树控件最小宽度
      type: String,
      default: '100%',
    },
    defaultExpandAll: {      // 是否默认展开所有子节点
      type: Boolean,
      default: false,
    },
    defaultValue: {          // 初始化值
      type: Array,
      default: () => ([]),
    },
    highlightCurrent: {      // 是否默认高亮子节点
      type: Boolean,
      default: false,
    },
    options: {               // 树形控件绑定的数据，懒加载时无需设置
      type: Array,
      default: () => ([]),
    },
    field: {                 // 用于判断树结构层级及字段
      type: Array,
      required: true,
    },
    props: {                 // 对属性控件配置项propsMerge的部分修改
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
        children: 'children',
      }),
    },
  },
  data() {
    return {
      labelModel: '',   // 输入框显示值
      valueModel: [],   // 无实际意义
      treeOptions: [],  // 树类型的数据
      once: true,
    };
  },
  computed: {
    propsMerge() {    // 树节点的 props 属性设置
      const propsTemp = Object.assign({
        value: 'value',
        label: 'label',
        children: 'children',
        disabled: 'disabled',   // 是否禁用
      }, this.props);
      return propsTemp;
    },
  },
  watch: {
    // value: {
    //   handler(val) {
    //     /** 1. 勾选全部站点选择框时,value为空,此时为使该组件动态响应
    //      *  因此出现val.length === 0 代码块内代码
    //      *  2. 穿梭框改变数据后,同上 val.length !== 0 代码块内代码
    //      */
    //     this.$nextTick(() => {
    //       this.$refs.tree.setCheckedKeys(val);
    //       if (val.length === 0) {
    //         this.labelModel = '';
    //       } else {
    //         const selectIds = this.$refs.tree.getCheckedNodes();
    //         this.labelModel = Array.from(new Set(this.getLowestLevelIds(selectIds, this.propsMerge.label))).join();
    //       }
    //     });
    //   },
    //   deep: true,
    // },
    // defaultValue: {          // v-model绑定的数据值
    //   handler(val) {
    //     this.initHandler(val);
    //   },
    //   immediate: true,
    // },
    options: {        // 树控件原始数据（扁平化）
      handler(val) {
        this.labelModel = '';
        this.treeOptions = [];
        if (val.length === 0) return;
        this.$nextTick(() => {
          this.treeOptions = this.handleParentData(_.cloneDeep(val), 0);
        });
      },
      immediate: true,
    },
  },
  methods: {
    // initHandler(val) {             // 初始化值
    //   this.$nextTick(() => {
    //     const { field } = this;
    //     const keys = val.map(item => item[field[field.length - 1].key]);
    //     const names = val.map(item => item[field[field.length - 1].name]);
    //     this.$refs.tree.setCheckedKeys(keys);
    //     this.labelModel = names.join();
    //   });
    // },
    handleParentData(val, iNum) {  // 处理数据
      const { field } = this;
      const valmap = val.map(item => item[field[iNum].key]);
      const arr = [];
      for (let i = 0; i < val.length; i += 1) {
        const arrmap = arr.map(item => item[this.propsMerge.value]);
        if (!arrmap.includes(valmap[i])) {
          const treedata = {};
          this.$set(treedata, `${this.propsMerge.label}`, val[i][field[iNum].name]);
          this.$set(treedata, `${this.propsMerge.value}`, val[i][field[iNum].key]);
          arr.push(treedata);
        }
      }
      if (iNum < this.field.length - 1) {
        arr.forEach((item) => {
          this.$set(item, 'children', []);
          val.forEach((op) => {
            if (item[this.propsMerge.value] === op[field[iNum].key]) item.children.push(op);
          });
          if (item.children.length) {
            const num = iNum + 1;
            this.$set(item, 'children', this.handleParentData(item.children, num));
          }
        });
      }
      return arr;
    },
    // clearHandler() {               // 清除数据
    //   this.labelModel = '';
    //   this.$emit('selected', []);
    //   this.$refs.tree.setCheckedKeys([]);
    //   this.setTreeNodeExpanded(this.$refs.tree);
    // },
    // filterMethod(query) {          // 过滤方法
    //   // 调用树形控件的过滤
    //   this.$refs.tree.filter(query);
    //   // 忽略选择器本身的过滤
    //   return true;
    // },
    // blurHandler() {                // 失去焦点时触发方法
    // },
    nodeClick(data, node) {           // 点击节点时触发方法
      if (node.level === 3) {
        this.$emit('input', data.value);
      }
    },
    // visibleChange(val) {           // 下拉框出现/隐藏时触发
    //   if (!val) {
    //     this.$refs.tree.filter('');
    //   }
    // },
    // filterNode(query, data) {      // 树节点过滤
    //   if (!query) return true;
    //   return data[this.propsMerge.label].includes(query);
    // },
    filterNode() {                    // 树节点过滤
    },
    // onClickNode() {                // 点击复选框触发
    //   const selectIds = this.$refs.tree.getCheckedNodes();
    //   this.$emit('selected', Array.from(new Set(this.getLowestLevelIds(selectIds, this.propsMerge.value))));
    //   this.labelModel = Array.from(new Set(this.getLowestLevelIds(selectIds, this.propsMerge.label))).join();
    // },
    renderContent(h, { node }) {   // 节点渲染函数
      return (
        <span class={`el-tree-node__label ${node.disabled ? 'is-disabled' : ''}`}>{node.label}</span>
      );
    },
    /** 递归方法 */
    // getLowestLevelIds(val, str) {  // 获取所有选中节点最底层节点的value值集合
    //   const arr = [];
    //   val.forEach((item) => {
    //     if (item[this.propsMerge.children]) {
    //       arr.push(...(this.getLowestLevelIds(item[this.propsMerge.children], str)));
    //     } else {
    //       arr.push(item[str]);
    //     }
    //   });
    //   return arr;
    // },
    setTreeNodeExpanded(option) {  // 设置所有展开的树节点折叠
      option.$children.forEach((v) => {
        if (v.$children.length && v.node) {
          this.$set(v.node, 'expanded', false);
          this.setTreeNodeExpanded(v);
        }
      });
    },
  },
};
</script>
