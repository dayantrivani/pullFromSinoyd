<template>
  <el-dialog
    ref="dialog"
    v-move="move"
    v-bind="$attrs"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    v-on="$listeners"
  >
    <!-- 标题 -->
    <template v-if="icon" slot="title">
      <span class="el-dialog__title">
        <icon scale="1.2" :name="icon" />
        <slot name="title">{{ $attrs.title || '' }}</slot>
      </span>
    </template>
    <slot></slot>
    <!-- 底部 -->
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'Modal',
  inheritAttrs: false,
  props: {
    icon: {
      type: String,
      default: '',
    },
    // 支持最大化
    maximize: {
      type: Boolean,
      default: true,
    },
    // 支持拖拽
    move: {
      type: Boolean,
      default: true,
    },
    // body 样式
    bodyClass: {
      type: Object,
      default: () => ({}),
    },
    // 垂直居中
    verticalCenter: {
      type: Boolean,
      default: false,
    },
    // 最小宽度
    minWidth: {
      type: String,
      default: '460px',
    },
    // 高度
    height: {
      type: String,
      default: 'auto',
    },
    // 最小高度
    minHeight: {
      type: String,
      default: '40px',
    },
  },
  data() {
    return {
      // 对话框显示
      visible: false,
    };
  },
  mounted() {
    const el = this.$refs.dialog.$refs.dialog;
    el.style.minWidth = this.minWidth;
  },
  methods: {
    // 打开对话框
    open() {
      this.visible = true;
      this.setRespStyle();
    },
    // 关闭对话框
    close() {
      this.visible = false;
    },
    setRespStyle() {
      if (!this.verticalCenter || (this.$attrs.fullscreen || typeof this.$attrs.fullscreen === 'string')) return;
      this.$nextTick(() => {
        const el = this.$refs.dialog.$refs.dialog;
        const docHeight = document.body.getBoundingClientRect().height;
        const elHeight = el.getBoundingClientRect().height;
        if (docHeight > elHeight) {
          el.style.marginTop = `${(docHeight - elHeight) / 2}px`;
        }
      });
    },
  },
};
</script>
