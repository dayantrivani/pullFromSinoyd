<template>
  <el-dialog
    ref="dialog"
    v-if="dialogUse"
    v-drag="drag && !fullScreen"
    :width="style[size].w"
    :fullscreen="size === 'full' || fullScreen"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    :before-close="beforeClose"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="closedDialog">
    <!-- 标题 -->
    <template slot="title">
      <span class="el-dialog__title">
        <i class="icon icon-dialog mar-r-xs"></i>
        <span><slot name="title">{{ title }}</slot></span>
      </span>
      <button
        v-if="size === 'large'"
        class="el-dialog__headerbtn"
        :title="fullScreen ? '还原' : '最大化'"
        @click="onChangeSize">
        <i :class="`icon icon-screen-${fullScreen ? 'restore' : 'full'}`"></i>
      </button>
    </template>
    <template v-if="!scrollbar">
      <!-- 主体内容区 -->
      <div :class="contentClass">
        <slot></slot>
      </div>
    </template>
    <el-scrollbar v-else ref="scrollbar" class="hide-x" :native="false" :noresize="false">
      <!-- 主体内容区/内置滚动条 -->
      <div :class="contentClass">
        <slot></slot>
      </div>
    </el-scrollbar>
    <!-- 底部 -->
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogModal',
  props: {
    // new：是否内置滚动条
    scrollbar: Boolean,
    // new：弹框大小
    size: {
      type: String,
      default: 'small',
      // 验证合法尺寸字符串
      validator: val => ['mini', 'small', 'middle', 'large', 'full'].includes(val),
    },
    // new：弹框最小宽度
    minWidth: {
      type: String,
      default: 'none',
    },
    // new：弹框最小宽度
    maxWidth: {
      type: String,
      default: 'none',
    },
    // new：启用拖拽、按住标题可拖拽
    drag: {
      type: Boolean,
      default: true,
    },
    // new: 内容区样式
    contentClass: {
      type: String,
      default: 'pad-x-sm',
    },
    // el-dialog: Dialog 的标题，也可通过具名 slot 传入
    title: {
      type: String,
      default: '',
    },
    // el-dialog: 遮罩层是否插入至 body 元素上
    modalAppendToBody: {
      type: Boolean,
      default: true,
    },
    // el-dialog: Dialog 自身是否插入至 body 元素上
    appendToBody: {
      type: Boolean,
      default: false,
    },
    // el-dialog: 是否在 Dialog 出现时将 body 滚动锁定
    lockScroll: {
      type: Boolean,
      default: true,
    },
    // el-dialog: Dialog 的自定义类名
    customClass: {
      type: String,
      default: '',
    },
    // el-dialog: 关闭前的回调，会暂停 Dialog 的关闭
    beforeClose: {
      type: Function,
      default: (done) => { done(); },
    },
  },
  data() {
    return {
      // 对话框启用
      dialogUse: false,
      // 对话框显示
      dialogVisible: false,
      // 对话框全屏显示
      fullScreen: false,
      // 样式模板
      style: {
        mini: { w: '30%', mar: '15vh auto auto' },    // 迷你
        small: { w: '50%', mar: '15vh auto auto' },   // 小型
        middle: { w: '65%', mar: '7vh auto' },        // 中型
        large: { w: '80%', mar: '7vh auto' },         // 大型
        full: { w: '100%', mar: '0' },                // 全屏
      },
    };
  },
  methods: {
    // 打开对话框
    openDialog() {
      this.dialogUse = true;
      this.dialogVisible = true;
      this.fullScreen = this.size === 'full';
      this.setRespStyle();
    },
    // 关闭对话框
    closeDialog() {
      this.dialogVisible = false;
    },
    // 关闭前回调（动画结束）
    closedDialog() {
      this.$emit('closed');
      this.dialogUse = false;
    },
    // 单击全屏按钮
    onChangeSize() {
      this.fullScreen = !this.fullScreen;
      this.setRespStyle();
    },
    // 设置响应样式
    setRespStyle() {
      this.$nextTick(() => {
        // 获取对话框
        const el = this.$refs.dialog.$refs.dialog;
        // 获取对话框子元素（标题、主体、底部）
        const [elHead, elBody, elFoot] = el.children;
        // 获取对话框标题与底部所占高度
        const elHeadFoot = elHead.getBoundingClientRect().height + (elFoot ? elFoot.getBoundingClientRect().height : 0);
        // 获取对话框高度
        const width = parseInt(this.style[this.size].w, 10);
        // 设置对话框最小宽度
        el.style.minWidth = this.minWidth;
        // 设置对话框最小宽度
        el.style.maxWidth = this.maxWidth;
        // 设置对话框外边距
        el.style.margin = this.style[this.size].mar;
        // 根据不同的对话框类型设置高度
        if (width >= 80) {
          if (this.scrollbar) {
            elBody.style.height = `calc(${this.fullScreen ? '100vh' : '86vh'} - ${elHeadFoot}px)`;
          } else {
            elBody.style.maxHeight = `calc(100vh - ${elHeadFoot}px)`;
            // elBody.style.minHeight = `calc(50vh - ${elHeadFoot}px)`;
            el.style.marginButton = 'auto';
          }
        } else if (width === 65) {
          const h = `calc(86vh - ${elHeadFoot}px)`;
          elBody.style.maxHeight = h;
          if (this.scrollbar) { this.$refs.scrollbar.$el.style.height = h; }
        } else {
          const h = `calc(85vh - ${elHeadFoot}px)`;
          elBody.style.maxHeight = h;
          if (this.scrollbar) { this.$refs.scrollbar.$el.style.height = h; }
        }
        this.$emit('change', this.fullScreen, elHeadFoot);
      });
    },
  },
};
</script>
