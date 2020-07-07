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
    <div class="box">
      <el-tree
        ref="tree"
        show-checkbox
        class="mod-select-tree"
        highlight-current
        :style="`min-width: ${treeWidth};`"
        :data="options"
        :props="props"
        :node-key="props.value"
        :expand-on-click-node="false"
        :default-expand-all="defaultExpandAll"
        @check="onClickNode">
      </el-tree>
    </div>
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
// import _ from 'lodash';

export default {
  name: 'SelectTreeMod',
  props: {
    value: {
      type: Array,
      event: 'input',
    },
    size: {
      type: String,
      required: false,
      default: 'mini',
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择',
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
      selectedLabel: [],
      valueModel: [],    //  实际传值 Array
      showStatus: false, //  添加样式
      treeWidth: 'auto', //  树控件宽度
      treeOptions: [],   //  树结构数据
      treeSelect: [],    //  树组件选中的数据
    };
  },
  created() {},
  mounted() {
    this.$refs.input.$el.children[0].setAttribute('readonly', true);
  },
  watch: {
    value: {
      handler(val) {
        if (!val) return;
        this.valueModel = val;
        this.$nextTick(() => {
          // 设置默认选中
          this.$refs.tree.setCheckedKeys(this.value);
          // 初始化显示
          const temp = this.$refs.tree.getCheckedNodes(this.value);
          this.labelModel = temp ? temp.map(e => e[this.props.label]).join(',') : '';
          this.selectedLabel = temp ? temp.map(e => e[this.props.label]) : [];
        });
      },
      immediate: true,
    },
  },
  methods: {
    // 弹出组件显示时触发方法
    onShowPopover() {
      // this.$refs.tree.setCheckedKeys([]);
    },
    // 弹出组件隐藏时触发方法
    onHidePopover() {},
    // 点击树节点复选框触发方法
    onClickNode(data) {
      if (data.children && data.children.length > 0) {
        const labels = data.children.map(child => child[this.props.label]);
        const values = data.children.map(child => child[this.props.value]);
        values.forEach((value) => {
          const index = this.valueModel.findIndex(e => e === value);
          if (index !== -1) {
            this.valueModel.splice(index, 1);
          } else {
            this.valueModel.push(value);
          }
        });
        labels.forEach((label) => {
          const index = this.selectedLabel.findIndex(e => e === label);
          if (index !== -1) {
            this.selectedLabel.splice(index, 1);
          } else {
            this.selectedLabel.push(label);
          }
        });
      } else {
        // 1. 获取树节点的选中数据
        const labelIndex = this.selectedLabel.findIndex(label => label === data[this.props.label]);
        const valueIndex = this.valueModel.findIndex(value => value === data[this.props.value]);
        if (labelIndex !== -1) {
          this.selectedLabel.splice(labelIndex, 1);
        } else {
          this.selectedLabel.push(data[this.props.label]);
        }
        if (valueIndex !== -1) {
          this.valueModel.splice(valueIndex, 1);
        } else {
          this.valueModel.push(data[this.props.value]);
        }
      }
      this.labelModel = this.selectedLabel.join(',');
      this.$emit('getTreeData', this.valueModel);
    },
    onCollapseNode() {
      this.selectedLabel = [];
      this.labelModel = this.selectedLabel.join(',');
      this.valueModel = [];
      this.$emit('input', this.valueModel);
      this.$refs.tree.setCheckedKeys([]);
    },
  },
};
</script>

<style lang="scss" scoped>
.box{
  margin: 0 -10px;
  // padding: 0 10px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
