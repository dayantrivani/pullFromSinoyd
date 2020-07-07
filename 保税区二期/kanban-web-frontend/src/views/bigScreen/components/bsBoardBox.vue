<template>
  <div class="board-box">
    <header class="title">
      {{title || ''}}
      <slot name="sub-title"></slot>
    </header>
    <div style="height: calc( 100% - 0.3rem)">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'boardBox',
  props: {
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: Array,
      default: () => [''],
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.board-box {
  width: 100%;
  height: 100%;
  padding: 0.1rem 0.1rem;
  .title {
    font-size: 0.3rem;
  }
}
</style>
