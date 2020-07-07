<template>
  <button
    v-show="app.custom.sideBtnShow"
    :class="{ 'toggle-side': 1, 'is-opened': app.custom.sideCollapse }"
    @click="app.setCustomParam('sideCollapse', !app.custom.sideCollapse)">
    <div class="toggle-side-line-wrap">
      <span class="toggle-side-line toggle-side-line-first"></span>
      <span class="toggle-side-line toggle-side-line-middle"></span>
      <span class="toggle-side-line toggle-side-line-last"></span>
    </div>
  </button>
</template>

<script>
export default {
  name: 'ToggleSide',
  inject: ['app'],
};
</script>
