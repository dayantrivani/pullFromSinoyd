<template>
  <div class="g-login">
    <header>
      <div class="container">
        <span>{{ logo[0] }}</span>{{ logo[1] }}
      </div>
    </header>
    <main>
      <el-form class="login-form" ref="form" :model="loginForm" size="medium">
        <h3 class="title mar-b-md pad-l-sm">用户登录</h3>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.uid"
            autofocus
            clearable
            placeholder="请输入用户名"
            @keyup.enter.native="onClickLogin()">
            <i slot="prefix" class="el-input__icon fas fa-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="mar-t-md">
          <el-input
            v-model="loginForm.pid"
            placeholder="请输入密码"
            :type="isSee ? 'text' : 'password'"
            @keyup.enter.native="onClickLogin()">
            <i slot="prefix" :class="`el-input__icon fas fa-${isSee ? 'unlock-alt' : 'lock'}`"></i>
            <i
              slot="suffix"
              v-if="!loginForm.remember"
              :class="`el-input__icon fas fa-${isSee ? 'eye' : 'eye-slash'}`"
              @click="isSee = !isSee"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="text-right">
          <!-- <el-checkbox v-model="loginForm.remember">保持登录</el-checkbox> -->
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            :disabled="!isLoginValid"
            @click="onClickLogin()">{{ `登录${loading ? '中' : ''}` }}
          </el-button>
        </el-form-item>
      </el-form>
    </main>
    <footer>
      <span class="copyright">Copyright ©2018 技术支持：xxxx股份有限公司</span>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      isSee: false,
      loading: false,
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
    onClickLogin() {
      if (!this.isLoginValid) {
        return;
      }
      this.loading = true;
      this.$store.dispatch('auth/Login', this.loginForm).then(() => {
        this.$store.dispatch('auth/GetMenu').then(() => {
          this.$store.dispatch('auth/CreateRoutes');
          this.$router.replace('/');
          this.loading = false;
        });
      }, () => {
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
