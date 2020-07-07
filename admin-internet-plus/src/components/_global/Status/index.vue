<template>
  <span v-if="symbol" :class="`i-bold text-${type ? 'success' : 'danger'}`">
    <icon :name="`el-icon-${type ? 'check' : 'close'}`" size="1.5em" />
  </span>
  <span v-else class="mod-status">
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
    // 是否对勾
    symbol: {
      type: Boolean,
      default: false,
    },
    type: {
      type: [String, Boolean],
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
  }
}
</style>
