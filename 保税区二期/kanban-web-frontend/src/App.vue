<template>
  <router-view id="app"></router-view>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  watch: {
    // 根据当前跳转的路由设置显示在浏览器标签的title
    $route: {
      handler() {
        this.setTitle();
      },
      immediate: true,
    },
  },
  created() {
    // if (process.env.NODE_ENV !== 'production') {
    //   this.$store.dispatch('auth/Login', { uid: 'superadmin', pid: 'system' });
    // }
  },
  methods: {
    setTitle() {
      // 浏览器标题显示的内容
      const { meta } = this.$route;
      window.document.title = `${meta.title || meta.subtitle} | ${this.$config.app.title}`;
    },
  },
};
</script>
