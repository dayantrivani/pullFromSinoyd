
<!-- 树状选择器
<select-tree :options=[选项数据]
v-model=[绑定变量]
field=[{ name: '', key: '' }]/>
defaultValue=[默认显示值]
-->

<template>
  <!--
    labelModel         下拉框显示值         string
    filterable         是否开启过滤         boolean
    disabled           是否禁用组件         boolean
    filterMethod       过滤方法             function
    clearable          禁止清除             boolean
    clearHandler       点击清空按钮触发      function
    visible-change     下拉框出现/隐藏时触发  funciton
  -->
  <el-tooltip effect="dark" placement="top-start" :disabled="labelModel.length < 12" :content="labelModel">
    <el-select
      ref="select"
      popper-class="mod-select-tree"
      :style="{ width }"
      :value="labelModel"
      :filterable="filterable"
      :disabled="disabled"
      :filter-method="filterMethod"
      :clearable="filterable"
      @clear="clearHandler"
      @blur="blurHandler"
      @visible-change="visibleChange">
      <!-- value--选中值  label--显示值 -->
      <el-option :value="valueModel" :label="labelModel">
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
          show-checkbox
          :style="{ minWidth: treeWidth }"
          :expand-on-click-node="false"
          :accordion="accordion"
          :data="options"
          :props="propsMerge"
          :highlight-current="highlightCurrent"
          :default-expand-all="defaultExpandAll"
          :node-key="propsMerge.value"
          :filter-node-method="filterNode"
          :render-content="renderContent"
          @check="onClickNode">
        </el-tree>
      </el-option>
    </el-select>
  </el-tooltip>
</template>

<script>
export default {
  name: 'SelectTierTree',
  model: {                  // v-model进行拆分 value 是值
    prop: 'value',
    event: 'selected',
  },
  props: {
    value: Array,            // 接收绑定参数 v-model 的值部分,对应this.$model.prop
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
      default: 'auto',
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
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes(true);
    },
  },
  watch: {
    value: {
      handler(val) {
        /** 1. 勾选全部站点选择框时,value为空,此时为使该组件动态响应
         *  因此出现val.length === 0 代码块内代码
         *  2. 穿梭框改变数据后,同上 val.length !== 0 代码块内代码
         */
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(val);
          if (val.length === 0) {
            this.labelModel = '';
          } else {
            const labelArr = this.$refs.tree.getCheckedNodes(true).map(item => item[this.propsMerge.label]);
            this.labelModel = labelArr.join();
          }
        });
      },
      deep: true,
    },
    options: {
      handler() {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.value, true, false);
          const selectIds = this.$refs.tree.getCheckedNodes();
          this.labelModel = Array.from(new Set(this.getLowestLevelIds(selectIds, this.propsMerge.label))).join();
        });
      },
      immediate: true,
    },
  },
  methods: {
    // getCheckedNodes() {
    //   return this.$refs.tree.getCheckedNodes(true);
    // },
    clearHandler() {               // 清除数据
      this.labelModel = '';
      this.$emit('selected', []);
      this.$refs.tree.setCheckedKeys([]);
      this.setTreeNodeExpanded(this.$refs.tree);
    },
    filterMethod(query) {          // 过滤方法
      // 调用树形控件的过滤
      this.$refs.tree.filter(query);
      // 忽略选择器本身的过滤
      return true;
    },
    blurHandler() {                // 失去焦点时触发方法
    },
    visibleChange(val) {           // 下拉框出现/隐藏时触发
      if (!val) {
        this.$refs.tree.filter('');
      }
    },
    filterNode(query, data) {      // 树节点过滤
      if (!query) return true;
      return data[this.propsMerge.label].includes(query);
    },
    onClickNode() {                // 点击复选框触发
      const selectIds = this.$refs.tree.getCheckedNodes();
      this.$emit('selected', Array.from(new Set(this.getLowestLevelIds(selectIds, this.propsMerge.value))));
      this.labelModel = Array.from(new Set(this.getLowestLevelIds(selectIds, this.propsMerge.label))).join();
    },
    renderContent(h, { node }) {   // 节点渲染函数
      return (
        <span class={`el-tree-node__label ${node.disabled ? 'is-disabled' : ''}`}>{node.label}</span>
      );
    },
    /** 递归方法 */
    getLowestLevelIds(val, str) {  // 获取所有选中节点最底层节点的value值集合
      const arr = [];
      val.forEach((item) => {
        if (item[this.propsMerge.children]) {
          arr.push(...(this.getLowestLevelIds(item[this.propsMerge.children], str)));
        } else {
          arr.push(item[str]);
        }
      });
      return arr;
    },
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
