<template>
  <div class="page-lock">
    <el-form class="lock-form" @submit.native.prevent>
      <el-form-item class="text-center">
        <el-avatar size="large" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
        <p>{{ userInfo.userName }}</p>
      </el-form-item>
      <el-form-item>
        <el-input
          ref="input"
          v-model="key"
          prefix-icon="el-icon-key"
          type="password"
          placeholder="密码"
          :disabled="loading"
          @keyup.enter.native="onSubmit()"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { resetRouter } from '@/routes';

export default {
  name: 'Lock',
  data() {
    return {
      loading: false,
      key: '',
    };
  },
  mounted() {
    this.$refs.input.focus();
  },
  computed: mapState('auth', ['userInfo']),
  methods: {
    ...mapActions('auth', ['Login', 'RefreshToken']),
    // 登录提交
    onSubmit() {
      if (this.loading || !this.key) return;
      this.Login({ uid: this.userInfo.loginID, pid: this.key })
        .then(() => {
          this.onRefresh();
        });
    },
    // 刷新token提交
    onRefresh() {
      this.loading = true;
      this.RefreshToken()
        .then(() => {
          resetRouter();
        })
        .finally(() => {
          this.loading = false;
          this.$nextTick(() => {
            this.$router.replace({ name: this.$config.app.home });
          });
        });
    },
  },
};
</script>

<style lang="scss">
.page-lock {
  position: relative;
  width: 100%;
  height: 100%;
  color: #7793a7;
  background-color: #1c2b36;
  > .lock-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
