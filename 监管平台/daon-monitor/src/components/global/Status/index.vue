<template>
  <span class="mod-status">
    <span :class="`mod-status__dot bg-${type}`"></span>
    <span class="mod-status__text">
      <slot></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'Status',
  props: {
    type: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.mod-status {
  $dot-size: 8px;

  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  color: unset;
  line-height: inherit;
  vertical-align: baseline;
  > .mod-status__dot {
    position: relative;
    top: -1px;
    display: inline-block;
    width: $dot-size;
    height: $dot-size;
    vertical-align: middle;
    border-radius: 50%;
  }
  > .mod-status__text {
    margin-left: 8px;
    font-size: 14px;
  }
}
</style>
