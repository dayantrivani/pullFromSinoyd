<template>
  <div class="mod-container" :fill="fill" :style="{ 'padding': padding, 'background-color': bg }">

    <!-- 头部内容 -->
    <slot name="header"></slot>

    <!-- 默认布局 -->
    <slot></slot>
  </div>
</template>

<script>
import { scope } from '@/styles/common/variables.scss';

export default {
  name: 'Container',
  inheritAttrs: false,
  props: {
    // 内边距
    padding: {
      type: String,
      default: scope,
    },
    // 高度撑满
    fill: {
      type: Boolean,
      default: false,
    },
    // 背景
    bg: {
      type: String,
      default: 'transparent',
    },
  },
};
</script>
