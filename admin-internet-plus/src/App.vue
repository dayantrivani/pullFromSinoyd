<template>
  <router-view id="app" :class="`page-${$route.name}`" />
</template>

<script>
import { mapActions } from 'vuex';
import { resetRouter } from '@/routes';

export default {
  watch: {
    $route: {
      handler(to) {
        // 根据当前跳转的路由设置显示在浏览器标签的title
        const title = `${to.meta.title || ''} | ${this.$config.app.title}`;
        window.document.title = title;
        // this.GetBreadcrumbList(to.name);
      },
      immediate: true,
    },
  },
  created() {
    // 移除载入动画
    document.body.removeChild(document.getElementById('loader'));
    // 初始化路由
    resetRouter();
  },
  methods: {
    ...mapActions('auth', ['GetBreadcrumbList']),
  },
};
</script>
