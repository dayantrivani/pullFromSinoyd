<template>
  <el-scrollbar
    v-bind="$attrs"
    :native="native"
    :noresize="noresize"
    :class="{ 'hide-x': hideX, 'hide-y': hideY, 'show-scroll': showScroll }"
    :style="{ 'height': height }"
    v-on="$listeners"
  >
    <slot></slot>
  </el-scrollbar>
</template>

<script>
export default {
  name: 'Scrollbar',
  props: {
    native: {
      type: Boolean,
      default: false,
    },
    noresize: {
      type: Boolean,
      default: false,
    },
    // 默认显示滚动条
    showScroll: {
      type: Boolean,
      default: true,
    },
    // 隐藏x轴
    hideX: {
      type: Boolean,
      default: true,
    },
    // 隐藏y轴
    hideY: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '100%',
    },
  },
};
</script>

<style lang="scss">
/* Scrollbar 滚动条
--------- --------- */
.el-scrollbar {
  height: 100%;
  // 隐藏水平滚动条
  &.hide-x {
    > .el-scrollbar__wrap { overflow-x: hidden; }
    > .el-scrollbar__bar.is-horizontal { display: none; }
  }
  // 隐藏垂直滚动条
  &.hide-y {
    > .el-scrollbar__wrap { overflow-y: hidden; }
    > .el-scrollbar__bar.is-vertical { display: none; }
  }
  // 显示滚动条
  &.show-scroll > .el-scrollbar__bar {
    opacity: 1 !important;
  }
}
</style>
