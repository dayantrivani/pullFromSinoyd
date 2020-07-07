<template>
  <div class="mod-main-case">

    <!-- 标题 -->
    <div class="title-click">
      <div class="title">{{title}}</div>
      <div class="click"><slot name="title"></slot></div>
    </div>

    <div class="main">
      <!-- 单位 -->
      <div class="unit"><slot name="unit"></slot></div>
      <!-- 内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainCase',
  props: {
    title: String,
  },
  data() {
    return {
    };
  },
  watch: {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
