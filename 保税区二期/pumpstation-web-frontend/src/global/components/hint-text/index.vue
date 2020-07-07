<template>
  <div class="mod-hint-text">
    <label :style="`${labelWidth - 0}px`">
      <i v-show="!noIcon" :class="icon"></i>
      <span>{{ label }}</span>
    </label>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HintText',
  props: {
    // 标签文字
    label: {
      type: String,
      default: '说明：',
    },
    labelWidth: {
      type: [String, Number],
      default: '70px',
    },
    // 图标类名
    icon: {
      type: String,
      default: 'el-icon-warning',
    },
    // 是否带图标
    noIcon: Boolean,
  },
};
</script>

<style scoped>

</style>
