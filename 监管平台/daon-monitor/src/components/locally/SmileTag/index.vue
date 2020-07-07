<template>
  <span class="mod-smile-tag">
    <icon class="smile" name="icon-smile" />
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'SmileTag',
};
</script>

<style lang="scss" scoped>
  .mod-smile-tag {
    position: relative;
    padding: 0 10px 0 25px;
    background-color: #d2f9bf;
    border-radius: 20px;
    > .smile {
      position: absolute;
      top: -4px;
      left: 0;
      font-size: 20px;
    }
  }
</style>
