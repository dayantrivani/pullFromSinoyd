<!-- 用户信息 -->
<template>
  <span class="setting-menu">
    <el-dropdown>
      <button class="el-dropdown-link">
        <i class="fas fa-ellipsis-v"></i>
      </button>
      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item @click.native="onClickSetting()">
          <el-button type="primary" icon="fas fa-user-cog">修改密码</el-button>
        </el-dropdown-item> -->
        <el-dropdown-item @click.native="onClickLogout()">
          <el-button type="danger" icon="fas fa-sign-out-alt">注 销</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <dialog-user-setting ref="dialog" />
  </span>
</template>

<script>
import { mapActions } from 'vuex';
import DialogUserSetting from './DialogUserSetting';

export default {
  components: {
    DialogUserSetting,
  },
  methods: {
    ...mapActions('auth', ['Logout']),
    onClickSetting() {
      this.$refs.dialog.openDialog();
    },
    onClickLogout() {
      this.Logout(this);
      this.$store.dispatch('tagsView/removeAllViews');
      // if (process.env.NODE_ENV === 'production') {
      //   window.location.href = `${window.location.origin}/fxhgfrontend/#/login`;
      // } else {
      //   this.$router.replace({ name: 'login' });
      // }
    },
  },
};
</script>
