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
          <el-button type="danger" icon="fas fa-sign-out-alt">注 销</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: mapState('auth', ['userRoles']),
  methods: {
    ...mapActions('auth', ['Logout']),
    onClickLogout() {
      this.Logout(this);
      // const userRoles = [...this.userRoles];
      window.sessionStorage.removeItem('userRoles');
      this.$store.dispatch('tagsView/removeAllViews');
      // if (userRoles.includes('地表水运维') || process.env.NODE_ENV !== 'production') {
      //   this.$router.replace({ name: 'login' });
      // } else {
      //   window.location.href = `${window.location.origin}/fxhgfrontend/#/login`;
      // }
    },
  },
};
</script>
