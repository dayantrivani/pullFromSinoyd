<template>
  <main class="g-main">
    <router-view />
  </main>
</template>

<script>
export default {
  beforeCreate() {
    // 确保刷新的时候有用户数据
    // before的时候 computed 尚不可用
    if (!this.$store.state.auth.user.userGuid) {
      this.$store.dispatch('auth/GetUser');
    }
    if (!this.$store.state.auth.userMenu.length) {
      this.$store.dispatch('auth/GetMenu', this.$store.state.auth.user.loginID).then(() => {
        this.$store.dispatch('auth/CreateRoutes');
      });
    }
  },
};
</script>
