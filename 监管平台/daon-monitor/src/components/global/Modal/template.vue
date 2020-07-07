<template>
  <a-modal
    ref="dialog"
    centered
    class="mod-modal"
    v-if="dialogVisible && dialogReload"
    v-bind="$attrs"
    v-on="$listeners"
    v-drag="drag"
    :visible.sync="dialogVisible"
    @closed="close">
    <!-- 标题 -->
    <template v-slot:title>
      <icon name="form" />
      <slot name="title">{{ title }}</slot>
      <!-- <button
        class="el-dialog__headerbtn"
        :title="fullScreen ? '还原' : '最大化'"
        @click="fullScreen = !fullScreen">
        <icon :name="`icon-screen-${fullScreen ? 'restore' : 'full'}`"/>
      </button> -->
    </template>
    <template v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </a-modal>
</template>

<script>

export default {
  name: 'Modal',
  props: {
    // 继承原 UI 组件的 props
    // ...Dialog.props,
    // 是否可拖拽对话框
    drag: {
      type: Boolean,
      default: true,
    },
    // 内容区样式
    bodyStyle: {
      default: () => ({}),
    },
    // 内容区样式
    bodyClassName: {
      default: '',
    },
  },
  data() {
    return {
      // 打开时是否重载对话框
      dialogReload: true,
      // 显示对话框
      dialogVisible: false,
      // 是否全屏
      fullScreen: false,
    };
  },
  watch: {
    fullScreen(isFull) {
      this._verticalCenter(isFull);
    },
  },
  methods: {
    /**
     * @deprecated 打开对话框
     * @param {Boolean} reload 重载组件(默认不重载)
     */
    open(reload) {
      if (reload) {
        this.dialogReload = false;
        window.setTimeout(() => {
          this.dialogReload = true;
          this.dialogVisible = true;
        }, 0);
      } else {
        this.dialogVisible = true;
      }
      // 设置对话框垂直居中
      this._verticalCenter();
      // 绑定双击全屏事件
      this._dblclickFullScreen();
    },
    /**
     * @deprecated 关闭对话框
     */
    close() {
      // 解绑双击全屏事件
      // this._dblclickFullScreen(false);
      this.dialogVisible = false;
      this.$emit('closed');
    },
    /**
     * @deprecated 绑定/解绑双击全屏事件
     * @params isBind 绑定 or 解绑
     */
    _dblclickFullScreen(isBind = true) {
      const handler = () => { this.fullScreen = !this.fullScreen; };
      if (isBind) {
        this.$nextTick(() => {
          const [elHead] = this.$refs.dialog.$refs.dialog.children;
          elHead.addEventListener('dblclick', handler);
        });
      } else {
        const [elHead] = this.$refs.dialog.$refs.dialog.children;
        elHead.removeEventListener('dblclick', handler, false);
      }
    },
  },
};
</script>
