<template>
  <div class="g-login">
    <header>
      <div class="container">
        <img src="../../assets/img/login/logo.png" alt="图片加载失败">
      </div>
    </header>
    <main>
      <animates :time="500" effect="zoomIn" :position="false" speed="speed">
        <div class="login-box">
          <div ref="lottie_box" style="flex: 0.8;"></div>
          <el-form class="login-form" ref="form" :model="loginForm" size="medium">
            <div>
              <div class="login-logo">
                <img class="mar-t-xxl mar-b-lg" src="../../assets/img/login/logo_login.png" alt="图片加载失败">
              </div>
              <el-form-item prop="username" style="width: 100%;">
                <template slot="label">
                  <div class="form-label">
                    <span class="ch-label">用户名</span>
                    <span class="symbol">|</span>
                    <span class="en-label">User name</span>
                  </div>
                </template>
                <el-input
                  autocomplete="new-password"
                  v-model="loginForm.uid"
                  clearable
                  placeholder="请输入用户名"
                  @keyup.enter.native="onClickLogin()"
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="password" style="width: 100%;" class="mar-t-md">
                <template slot="label">
                  <div class="form-label">
                    <span class="ch-label">密 码</span>
                    <span class="symbol">|</span>
                    <span class="en-label">Password</span>
                  </div>
                </template>
                <el-input
                  auto-complete="new-password"
                  clearable
                  v-model="loginForm.pid"
                  placeholder="请输入密码"
                  :type="isSee ? 'text' : 'password'"
                  @keyup.enter.native="onClickLogin()"
                >
                  <i
                    slot="suffix"
                    v-if="!loginForm.remember"
                    :class="`el-input__icon iconfont icon-eye${isSee ? '' : '-close'}`"
                    @click="isSee = !isSee"
                  ></i>
                </el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item class="text-left mar-t-md">
                    <!-- <el-checkbox style="color:white" v-model="loginForm.remember">保持登录</el-checkbox> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button
                  type="primary"
                  class="btn-login"
                  :loading="loading"
                  :disabled="!isLoginValid"
                  @click="onClickLogin()"
                >{{ `登 录${loading ? ' 中' : ''}` }}</el-button>
              </el-form-item>
              <div
                style="height:60px;color:white;text-align:center;padding-top:30px"
              >&copy; 江苏远大信息股份有限公司</div>
            </div>
          </el-form>
        </div>
      </animates>
    </main>
  </div>
</template>

<script>
import lottie from 'lottie-web';
import { mapState, mapActions } from 'vuex';
import crypto from 'crypto-js';
import * as animationData from '../../assets/loginSvg.json';

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
      lottie: null,
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
  mounted() {
    this.lottie = lottie.loadAnimation({
      container: this.$refs.lottie_box,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // 这个地方传入到的时候，通过看vue调试器发现，这个json文件的格式不是object，而是module，这个把这个格式的数据打开，取他的默认default才能是正确的数据
      animationData: animationData.default,
    });
  },
  methods: {
    ...mapActions('auth', ['Login']),
    handleScan() {
      this.isScan = !this.isScan;
    },
    onClickLogin() {
      if (!this.isLoginValid) return;
      this.loading = true;
      // 加密处理 --电力监管
      const key = crypto.enc.Latin1.parse('sinoyd**..123456');
      const rules = {
        iv: key,
        mode: crypto.mode.CBC,
        padding: crypto.pad.ZeroPadding,
      };
      const keyParams = {
        uid: crypto.AES.encrypt('bsqgwh', key, rules).toString(),
        pid: crypto.AES.encrypt('bsqgwh123', key, rules).toString(),
      };
      this.$jsonp('https://ele.envchina.com/api/elecloud/auth/fxJsonp/login', {
        uid: keyParams.uid,
        pid: keyParams.pid,
        callback: 'callback',
      }).then((json) => {
        this.$store.state.auth.status = 200;
        window.sessionStorage.setItem('eleToken', JSON.stringify(json));
      }).catch((err) => {
        this.$store.state.auth.status = err.status;
      });
      this.Login(this.loginForm).then(() => {
        this.loginForm.pid = '';
        this.password = 'text';
        this.$router.replace({ name: 'Home' });
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
