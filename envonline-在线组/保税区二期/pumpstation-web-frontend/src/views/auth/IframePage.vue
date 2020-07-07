<template>
  <iframe frameborder="0" scrolling="no" width="100%" height="100%" :src="$route.name"></iframe>
</template>

<script>
export default {
  name: 'IframePage',
};
</script>

<style lang="scss">
  .g-main {
    overflow: hidden !important;
  }
</style>
