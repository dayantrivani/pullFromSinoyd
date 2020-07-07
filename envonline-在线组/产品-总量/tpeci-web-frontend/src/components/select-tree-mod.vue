<template>
  <!-- 最后传值必须为一个数组Array [[1, [1, 2]], [2, [1, 2]]] -->
  <el-popover
    ref="popover"
    placement="bottom-start"
    :trigger="trigger"
    @show="onShowPopover"
    @hide="onHidePopover">
    <!--
      highlight-current 高亮当前选中节点
      props: {
        label:    指定节点标签(文本内容)为节点对象的某个属性值 string, function(data, node)
        children  指定子树为节点对象的某个属性值  string
        disabled  指定节点选择框是否禁用为节点对象的某个属性值 boolean, function(data, node)
        isLeaf    指定节点是否为叶子节点，仅在指定了lazy属性的情况下生效boolean, function(data, node)
      }
      expand-on-click-node 点击箭头还是节点触发展开与收缩事件  bollean  false
      filter-node-method   树节点进行筛选操作  Function(value, data, node)
      default-expand-all  是否默认展开所有节点
      node-click 节点被点击时的回调
      node-expand 节点被展开时触发的回调
     -->
    <el-tree
      ref="tree"
      class="mod-select-tree"
      show-checkbox
      highlight-current
      :style="`min-width: ${treeWidth}`"
      :data="treeOptions"
      :props="props"
      node-key="rowGuid"
      :expand-on-click-node="false"
      :default-expand-all="defaultExpandAll"
      @check="onClickNode">
    </el-tree>
    <template slot="reference">
      <!-- 文字提示
        effect 提示背景是亮色还是暗色
        placement 提示方向
        content   展示内容
      -->
      <el-tooltip effect="dark" placement="top-start" :disabled="labelModel.length < 9" :content="labelModel">
        <el-input
          ref="input"
          v-model="labelModel"
          clearable
          readonly
          suffix-icon="el-icon-arrow-down"
          :size="size"
          :style="`width: ${width}px`"
          :class="{ 'rotate': showStatus, 'z-pointer': 1 }"
          :placeholder="placeholder"
          @clear="onCollapseNode">
        </el-input>
      </el-tooltip>
    </template>
  </el-popover>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'SelectTreeMod',
  props: {
    size: {
      type: String,
      required: false,
      default: 'mini',
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    // 是否默认展开所有 默认否
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    // 树的配置选项
    props: {
      type: Object,
      default: () => ({
        label: 'dictName',       // 节点标签字段名
        value: 'dictValue',      // 实际需要的值字段名
        children: 'children',    // 子节点字段名
      }),
    },
    options: {
      type: Array,
      required: true,
    },
    // 输入框宽度
    width: String,
  },
  data() {
    return {
      trigger: 'click',  //  点击触发消息提示
      labelModel: '',    //  input框的绑定值
      valueModel: [],    //  实际传值 Array
      showStatus: false, //  添加样式
      treeWidth: 'auto', //  树控件宽度
      treeOptions: [],   //  树结构数据
      treeSelect: [],    //  树组件选中的数据
    };
  },
  created() {
  },
  /*
    watch: {
      options: {
        handler(val) {
          this.treeOptions = this.generateTreeData(val);
        },
        deep: true,
      },
    },
  */
  watch: {
    options: {
      handler() {
        this.generateTreeData(this.options);
      },
      deep: true,
    },
  },
  methods: {
    // 弹出组件显示时触发方法
    onShowPopover() {
      // this.$refs.tree.setCheckedKeys([]);
    },
    // 弹出组件隐藏时触发方法
    onHidePopover() {
    },
    // 点击树节点复选框触发方法
    onClickNode() {
      // 1. 获取树节点的选中数据
      const val = _.cloneDeep(this.$refs.tree.getCheckedNodes());
      this.labelModel = val.map(item => item.dictName).join(',');
      // 2. 获取选中节点中的第一级对象
      const treeNodeData = [];
      val.forEach((item) => { if (item.parentId === '0') treeNodeData.push(item); });
      // 3.
      const options = _.cloneDeep(this.treeOptions);
      options.forEach((item) => {
        treeNodeData.forEach((node) => {
          if (node.rowGuid === item.rowGuid) this.$set(item, 'isSelect', true);
        });
        this.$set(item, 'children', []);
        val.forEach((value) => {
          if (value.parentId === item.rowGuid) item.children.push(value);
        });
      });
      // 4. 到此处数据已经变成我想要的结构 isSelect 判断是否
      const formatData = options.filter(item => (item.children.length > 0) || item.isSelect);
      // 5. 最后去掉冗余,彻底转化为我们想要的参数值
      this.valueModel = this.getPortTypesValue(formatData);
      this.$emit('getTreeData', this.valueModel);
    },
    onCollapseNode() {},
    // 处理数据结构,使杂乱的数据变为树结构数据
    generateTreeData(value) {
      const options = _.cloneDeep(value);
      const treeLevelOne = [];
      // 筛选出第一层级的对象数据,并为没个对象添加children字段
      options.forEach((item) => {
        this.$set(item, 'children', []);
        if (item.parentId === '0') treeLevelOne.push(item);
      });
      treeLevelOne.forEach((val) => {
        options.forEach((item) => {
          if (item.parentId === val.rowGuid) {
            val.children.push(item);
          }
        });
      });
      this.treeOptions = treeLevelOne;
    },
    // 去掉冗余,彻底转化为我们想要的参数值
    getPortTypesValue(val) {
      const value = [];
      val.forEach((item, key) => {
        if (item.parentId === '0') {
          value.push([+(item[this.props.value])]);
          value[key].push(this.getPortTypesValue(item.children));
        } else {
          value.push(+(item[this.props.value]));
        }
      });
      return value;
    },
    /*
      // 点击节点触发事件
      onClickNode() {
        const selection = this.$refs.tree.getCheckedNodes();
        this.labelModel = selection.map(item => item.dictName).join(',');
        // 数据格式化
        const formatValue = this.generateSelectData(selection);
        // this.valueModel = this.generateSelectData(selection);
        this.valueModel = this.generateParamsData(formatValue);
        this.$emit('getTreeData', this.valueModel);
      },
      // 展开节点触发事件
      onExpandNode() {
        this.$emit('node-expand');
      },
      onCollapseNode() {
      },
      generateTreeData(val) {
        const options = _.cloneDeep(val);
        const treeValue = [];
        options.forEach((val) => {
          if (val.parentId === '0') treeValue[val.dictValue - 1] = val;
          this.$set(val, 'children', []);
          options.forEach((item) => {
            if (val.rowGuid === item.parentId) {
              const _children = val.children;
              _children[item.dictValue - 1] = item;
            }
          });
        });
        return treeValue;
      },
      generateSelectData(value) {
        const val = _.cloneDeep(value);
        // 获取第一级数据
        const treeLevelOne = this.treeOptions.filter(item => item.parentId === '0');
        const treeValueAdd = [];
        treeLevelOne.forEach((item) => {
          let isAllow = false;
          let isNeedAdd = true;
          val.forEach((value) => { if (value.parentId === item.rowGuid) isAllow = true; });
          if (isAllow) {
            val.forEach((value, key) => {
              if (value.rowGuid === item.rowGuid) {
                isNeedAdd = false;
              }
            });
            if (isNeedAdd) treeValueAdd.push(item);
          }
        });
        val.push(...treeValueAdd);
        return this.generateTreeData(val);
      },
      // 处理为传参需要的数据结构
      generateParamsData(val) {
        const recValue = [];
        val.forEach((item, key) => {
          if (item.children.length === 0) {
            if (item.parentId === '0') {
              recValue.push([+item.dictValue]);
            } else {
              recValue.push(+item.dictValue);
            }
          } else if (item.children.length > 0) {
            recValue.push([+item.dictValue]);
            recValue[key].push(this.generateParamsData(item.children));
          }
        });
        console.log(recValue);
        return recValue;
      },
    */
  },
};
</script>
