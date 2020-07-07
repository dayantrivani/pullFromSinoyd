<template>
  <aside class="app-side">
    <brand />
    <nav-menu />
  </aside>
</template>

<script>
import Brand from '../app-brand';
import NavMenu from './components/nav-menu';

export default {
  name: 'AppSide',
  components: {
    Brand,
    NavMenu,
  },
  inject: ['app'],
  provide() {
    return { side: this };
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    // 获取用户导航
    getUserMenu() {
      this.loading = true;
      // this.$store.dispatch('auth/GetUserMenu').finally(() => {
      this.$store.dispatch('auth/GetNewMenu').finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
