<!-- 用户信息 -->
<template>
  <span class="setting-menu">
    <el-dropdown>
      <button class="el-dropdown-link">
        <i class="fas fa-ellipsis-v"></i>
      </button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="onClickLogout()">
          <el-button type="danger" icon="fas fa-sign-out-alt">注 销</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>

export default {
  methods: {
    onClickLogout() {
      this.$store.commit('auth/Logout', this.$router);
      this.$store.dispatch('tagsView/removeAllViews');
    },
  },
};
</script>
