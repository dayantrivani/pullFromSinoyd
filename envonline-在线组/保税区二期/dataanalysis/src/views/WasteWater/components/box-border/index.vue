<template>
<!-- 素方框背景图 -->
  <div class="mod-box-border">
    <div class="top"></div>

    <div class="center"></div>

    <div class="bottom"></div>

    <div class="main pad-x-xs">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoxBorder',
  data() {
    return {};
  },
  computed: {
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
