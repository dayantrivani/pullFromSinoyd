<!-- 用户信息 -->
<template>
  <span class="setting-menu">
    <el-dropdown>
      <button class="el-dropdown-link">
        <i class="fas fa-ellipsis-v"></i>
      </button>
      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item>
          <el-button type="primary" icon="fas fa-chalkboard">系统切换</el-button>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button type="primary" icon="fas fa-user-cog">个人设置</el-button>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button type="primary" icon="fas fa-tshirt">皮肤切换</el-button>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button type="info" icon="fas fa-question-circle">帮 助</el-button>
        </el-dropdown-item> -->
        <el-dropdown-item @click.native="onClickLogout()">
          <el-button type="danger"
                     icon="fas fa-sign-out-alt">注 销</el-button>
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
      if (process.env.NODE_ENV === 'production') {
        window.location.href = `${window.location.origin}/fxhgfrontend/#/login`;
      } else {
        this.$router.replace({ name: 'login' });
      }
    },
  },
};
</script>
