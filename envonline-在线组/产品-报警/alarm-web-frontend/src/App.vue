<template>
  <div id="app" v-wechat-title="`${title}${$config.title}`">
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    title() {
      const { title } = this.$route.meta;
      return title ? `${title} | ` : '';
    },
  },
};
</script>
