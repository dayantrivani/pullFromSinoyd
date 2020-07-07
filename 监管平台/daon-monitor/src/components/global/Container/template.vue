<template>
  <div
    :class="{
      'mod-container': 1,
      'is-fill': fillH,
      'layout-fixed': layout === 'fixed',
      'layout-search': layout === 'search',
      'layout-empty': layout === 'empty',
    }">
    <slot name="header"></slot>
    <template v-if="!layout || layout === 'empty'">
      <slot></slot>
    </template>
    <template v-else-if="layout === 'search'">
      <slot name="left"></slot>
      <slot name="right"></slot>
    </template>
    <template v-else-if="layout === 'fixed'">
      <div class="container">
        <div class="left">
          <slot></slot>
        </div>
        <div class="right">
          <a-affix class="fixed" :offsetTop="100">
            <slot name="rigth"></slot>
          </a-affix>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Container',
  props: {
    // 布局类型
    layout: {
      type: String,
      default: '',
    },
    // 是否填充高度
    fillH: Boolean,
  },
};
</script>
