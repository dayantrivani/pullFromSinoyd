<template>
  <div class="g-login">
    <header>
      <div class="container">
        <div class="brand">
          <span>智慧水务综合调度信息</span> 监管平台
        </div>
      </div>
    </header>
    <main>
      <el-form class="login-form" ref="form" :model="loginForm" size="medium">
        <div :class="`${isScan ? 'btn-pc' : 'btn-QRcode'}`" @click.self="handleScan"></div>
        <div v-show="isScan" class="QRcode">
          <div class="qr-code" alt="二维码"></div>
          <div class="text-center tips">扫一扫，下载APP</div>
        </div>
        <div v-show="!isScan">
          <el-form-item prop="username" style="width: 300px;">
            <template slot="label">
              <div class="form-label">
                <span class="ch-label">用户名</span>
                <span class="symbol"> | </span>
                <span class="en-label">User name</span>
              </div>
            </template>
            <el-input
              v-model="loginForm.uid"
              autofocus
              clearable
              placeholder="请输入用户名"
              @keyup.enter.native="onClickLogin()">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="width: 300px;" class="mar-t-md">
            <template slot="label">
              <div class="form-label">
                <span class="ch-label">密 码</span>
                <span class="symbol"> | </span>
                <span class="en-label">Password</span>
              </div>
            </template>
            <el-input
              v-model="loginForm.pid"
              placeholder="请输入密码"
              :type="isSee ? 'text' : password"
              @focus="password = 'password'"
              @keyup.enter.native="onClickLogin()">
              <i slot="prefix" class="el-input__icon el-icon-key"></i>
              <i
                slot="suffix"
                v-if="!loginForm.remember"
                :class="`el-input__icon fas fa-${isSee ? 'eye' : 'eye-slash'}`"
                @click="isSee = !isSee"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="btn-login mar-y-lg"
              :loading="loading"
              :disabled="!isLoginValid"
              @click="onClickLogin()">{{ `登 录${loading ? ' 中' : ''}` }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </main>
    <footer>
      <span class="copyright">Copyright ©2019 技术支持：江苏远大信息股份有限公司</span>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      isScan: false, // 扫码
      isSee: false,
      loading: false,
      password: 'text',
      loginForm: {
        uid: '',
        pid: '',
        remember: false,
      },
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
    }),
    isLoginValid() {
      return this.loginForm.uid && this.loginForm.pid;
    },
    remember() {
      return this.loginForm.remember;
    },
    // logo标题
    logo() {
      if (typeof this.$config.logo === 'string') {
        return ['', this.$config.logo];
      }
      return this.$config.logo;
    },
  },
  watch: {
    remember(val) {
      this.isSee = !(val || true);
    },
  },
  methods: {
    ...mapActions('auth', ['Login']),
    handleScan() {
      this.isScan = !this.isScan;
    },
    onClickLogin() {
      // 1. 验证用户是否填写了账户密码
      if (!this.isLoginValid) return;
      // 2. 登录按钮状态
      this.loading = true;
      // 3. 调登录接口
      this.$store.dispatch('auth/Login', this.loginForm).then(() => {
        // 4. 调侧边栏导航树接口
        // this.$store.dispatch('auth/GetMenu').then(() => {
        // this.$store.dispatch('auth/CreateRoutes');
        this.$router.replace('/');
        this.loading = false;
        // });
      }, () => {
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
