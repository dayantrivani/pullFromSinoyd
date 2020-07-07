<template>
  <button v-once class="u-side-btn" :title="title" @click="$emit('click')">
    <i v-if="icon" :class="icon"></i>
    <slot name="title"></slot>
    <slot></slot>
  </button>
</template>

<script>

export default {
  name: 'SideBtn',
  props: {
    // 提示文字
    title: {
      type: String,
    },
    // 图标类名
    icon: {
      type: String,
      required: true,
    },
  },
};
</script>
