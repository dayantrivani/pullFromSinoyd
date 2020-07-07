<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowMenu"
    @hide="onHideMenu">
    <el-tree
      ref="tree"
      class="mod-select-tree"
      highlight-current
      lazy
      :load="onLoadNodes"
      :style="`min-width: ${treeWidth}`"
      :data="data"
      :props="props"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-expand-all="false"
      @node-click="onClickNode"
      @node-expand="onExtendNode">
    </el-tree>
    <template slot="reference">
      <el-tooltip effect="dark" placement="top-start" :disabled="labelModel.length < 9" :content="labelModel">
        <el-input
          ref="input"
          v-model="labelModel"
          clearable
          suffix-icon="el-icon-arrow-down"
          :style="`width: ${width}px`"
          :class="{ 'rotate': showStatus, 'z-pointer': 1 }"
          :placeholder="placeholder || '行政区域'"
          @clear.capture="onShrinkNode">
        </el-input>
      </el-tooltip>
    </template>
  </el-popover>
</template>

<script>
export default {
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    value: [Number, String],        // 接收绑定参数
    label: String,        // 默认标签
    width: String,        // 输入框宽度
    placeholder: String,  // 输入框占位符
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        parent: 'parentId',
        value: 'rowGuid',
        label: 'areaName',
        children: 'children',
        // isLeaf: 'leaf',       // 是否为叶子节点
      }),
    },
  },
  watch: {
    label(val) {
      this.labelModel = val;
    },
    labelModel(val) {
      if (!val) this.valueModel = '';
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: 'auto',
      labelModel: '',
      valueModel: '',
      data: [],
    };
  },
  created() {
    this.labelModel = this.label || '';
    this.$nextTick(() => {
      // 获取输入框宽度同步至树状菜单宽度
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`;
    });
  },
  methods: {
    // 单击节点
    onClickNode(data) {
      this.labelModel = data[this.props.label];
      this.valueModel = data[this.props.value]; this.labelModel = data[this.props.label];
      this.valueModel = data[this.props.value];
      this.$refs.popover.showPopper = false;
      this.$nextTick(() => {
        this.$emit('setLabel', this.labelModel);
      });
    },
    // 显示时触发
    onShowMenu() {
      this.showStatus = true;
      this.$refs.tree.filter(false);
    },
    // 隐藏时触发
    onHideMenu() {
      this.showStatus = false;
      this.$emit('selected', this.valueModel);
    },
    // 展开树节点
    onExtendNode(data, node, tag) {
      this.$set(tag, 'expanded', !tag.expanded);
    },
    // 收起树节点
    onShrinkNode() {
      this.$emit('selected', '');
      // eslint-disable-next-line
      const tree = this.$refs.tree;
      this.showStatus = false;
      this.$refs.popover.showPopper = false;
      tree.$children.forEach((v) => {
        this.$set(v, 'expanded', false);
      });
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.props.label].indexOf(query) !== -1;
    },
    // 加载子节点
    onLoadNodes(node, resolve) {
      this.getNodeList(node.data[this.props.value]).then(data => resolve(data));
    },
    // 获取节点列表
    getNodeList(id = '0') {
      return new Promise((resolve) => {
        this.$http.get(`sys/area/${id}`).then((response) => {
          resolve(response.data || []);
        });
      });
    },
  },
};
</script>
