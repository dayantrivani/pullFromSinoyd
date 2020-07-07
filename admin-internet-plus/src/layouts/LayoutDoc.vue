<template>
  <div :class="`layout-doc is-${direction}`">
    <template v-if="direction === 'left'">
      <div class="layout-doc__doc" :style="{ 'width': docWidth }">
        <div class="layout-doc__affix">
          <!-- 目录区 -->
          <slot name="doc"></slot>
        </div>
      </div>
      <div v-loading="loading" class="layout-doc__content">
        <!-- 内容区 -->
        <slot></slot>
      </div>
    </template>
    <template v-else>
      <div v-loading="loading" class="layout-doc__content">
        <!-- 内容区 -->
        <slot></slot>
      </div>
      <div class="layout-doc__doc" :style="{ 'width': docWidth }">
        <div class="layout-doc__affix">
          <!-- 目录区 -->
          <slot name="doc"></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'LayoutDoc',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    docWidth: {
      type: String,
      default: '250px',
    },
    direction: {
      type: String,
      default: 'left',
      validator: val => ['left', 'right'].indexOf(val) > -1,
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-doc {
  display: flex;
  &.is-left > .layout-doc__doc {
    margin-right: $-scope;
  }
  &.is-right > .layout-doc__doc {
    margin-left: $-scope;
  }
  > .layout-doc__doc > .layout-doc__affix {
    position: fixed;
    width: inherit;
  }
  > .layout-doc__content {
    flex: 1;
    min-height: 100%;
  }
}
</style>
