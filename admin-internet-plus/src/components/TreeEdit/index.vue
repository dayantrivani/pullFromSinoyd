<template>
  <el-tree
    ref="tree"
    default-expand-all
    node-key="id"
    class="pad-y-xs pad-x-sm"
    :expand-on-click-node="false"
    :data="data"
    :render-content="renderContent"
    v-bind="$attrs"
    v-on="$listeners"
  ></el-tree>
</template>

<script>
export default {
  name: 'TreeEdit',
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
    // 显示状态标识
    dot: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    // 是否可检索
    filterable: {
      type: Boolean,
      default: false,
    },
    // 操作项 add edit/view copy remove
    operation: {
      type: String,
      default: 'add edit remove',
    },
  },
  methods: {
    // 获取控件实例对象，方便调用组件方法
    getInstance() {
      return this.$refs.tree;
    },
    setCurrentKey(key) {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(key || '0');
      });
    },
    onBtnClick(operation, params) {
      const e = params.$event;
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      this.$emit('btn-click', { operation, ...params });
    },
    remove(id) {
      this.$refs.tree.remove(id);
    },
    renderContent(h, { node, data }) {
      const showBtn = (opt) => this.operation.indexOf(opt) > -1;
      const hideAdd = !showBtn('add');
      const row = data.detail || data || {};
      return (
        <span class="custom-tree-node">
          <span class="label i-overflow" title={node.label}>
            <span v-show={this.icon} class="icon">
              <icon name={row.icon} />
            </span>
            <status v-show={this.dot} type={row.enabled === '启用' ? 'success' : 'danger'} />
            <span>{node.label}</span>
          </span>
          <span class="btns" v-show={this.operation}>
            <el-button
              v-show={showBtn('add') && !hideAdd}
              simple
              title="新增"
              type="primary"
              icon="el-icon-plus"
              on-click={ ($event) => this.onBtnClick('add', { $event, node, data }) }
            />
            <el-button
              v-show={(showBtn('edit') || showBtn('view')) && (hideAdd || node.level > 1)}
              simple
              title={showBtn('view') ? '查看' : '编辑'}
              type="primary"
              icon={`el-icon-${showBtn('view') ? 'view' : 'edit'}`}
              on-click={ ($event) => this.onBtnClick('edit', { $event, node, data }) }
            />
            <el-button
              v-show={showBtn('auth') && (hideAdd || node.level > 1)}
              simple
              title="权限"
              type="warning"
              icon="el-icon-key"
              on-click={ ($event) => this.onBtnClick('auth', { $event, node, data }) }
            />
            <el-button
              v-show={showBtn('copy') && (hideAdd || node.level > 1)}
              simple
              title="复制"
              type="warning"
              icon="el-icon-copy"
              on-click={ ($event) => this.onBtnClick('copy', { $event, node, data }) }
            />
            <el-button
              v-show={showBtn('remove') && (hideAdd || node.level > 1) && !row.admin}
              simple
              title="删除"
              type="danger"
              icon="el-icon-delete"
              on-click={ ($event) => this.onBtnClick('remove', { $event, node, data }) }
            />
          </span>
        </span>
      );
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .custom-tree-node {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
  &:hover > .btns {
    display: inline-block;
  }
  > .label {
    flex: 1;
    > .icon {
      padding-right: 5px;
      min-width: 16px;
    }
  }
  > .btns {
    display: none;
    flex: 1;
    text-align: right;
  }
}
</style>
