<template>
  <div class="mod-decor-border">
    <div class="top">
      <div class="top-left" :width="width"></div>
      <div class="top-middle"></div>
      <div class="top-right"></div>
    </div>

    <div class="center">
      <div class="center-left"></div>
      <div class="center-middle"></div>
      <div class="center-right"></div>
    </div>

    <div class="bottom">
      <div class="bottom-left">  </div>
      <div class="bottom-middle">

      </div>
      <div class="bottom-right"></div>
    </div>

    <div class="main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DecorBorder',
  props: {
    width: {
      type: String,
      default: '50%',
    },
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import 'index.scss';
</style>
