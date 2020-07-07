<template>
  <div class="progress">
    <div class="label" :style="`color:${color}`" :title="label">{{ label }}</div>
    <div class="progress-outer">
      <div
        class="progress-inner"
        :style="`height: ${percentage / max * 100}%;background-color: ${color};`"
      ></div>
    </div>
    <div class="text" :title="text || percentage">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'progressBox',
  props: {
    label: { // 标签文字
      type: [String, Number],
      required: false,
      default: '文本',
    },
    percentage: { // 当前数据
      type: [String, Number],
      required: false,
      default: 500,
    },
    max: { // 数据最大值
      type: Number,
      required: false,
      default: 10000,
    },
    text: { // 显示文字（后方）
      type: String,
      required: false,
      default: '默认文字',
    },
    color: {
      type: String,
      default: 'rgb(252,114,147)',
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
