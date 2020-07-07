<template>
  <div class="g-login">
    <header>
      <div class="container">
        <!-- <img src="img/login/logo_963x68.png" alt=""> -->
        <!-- <span>{{ logo[0] }}</span> {{ logo[1] }} -->
        <div>
          <span style="color:white">污染源自动在线监控平台</span>
        </div>
      </div>
    </header>
    <main>
      <el-form class="login-form" ref="form" :model="loginForm" size="medium">
        <!-- <div :class="`${isScan ? 'btn-pc' : 'btn-QRcode'}`" @click.self="handleScan"></div> -->
        <!-- <div v-show="isScan" class="QRcode">
          <img src="img/login/login_QR_code_267x267.png" alt="二维码">
          <div class="text-center tips">扫一扫，下载APP</div>
        </div>-->
        <div>
          <div style="color:white;font-size: 24px;line-height:100px">
            LOGIN |
            <span style="font-size:20px">用户登录</span>
          </div>
          <el-form-item prop="username" style="width: 100%;">
            <!-- <template slot="label">
              <div class="form-label">
                <span class="ch-label">用户名</span>
                <span class="symbol">|</span>
                <span class="en-label">User name</span>
              </div>
            </template>-->
            <el-input
              autocomplete="new-password"
              v-model="loginForm.uid"
              clearable
              placeholder="请输入用户名"
              @keyup.enter.native="onClickLogin()"
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" style="width: 100%;" class="mar-t-md">
            <!-- <template slot="label">
              <div class="form-label">
                <span class="ch-label">密 码</span>
                <span class="symbol">|</span>
                <span class="en-label">Password</span>
              </div>
            </template>-->
            <el-input
              auto-complete="new-password"
              clearable
              v-model="loginForm.pid"
              placeholder="请输入密码"
              :type="isSee ? 'text' : 'password'"
              @keyup.enter.native="onClickLogin()"
            >
              <i slot="prefix" class="el-input__icon el-icon-key"></i>
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
                <el-checkbox style="color:white" v-model="loginForm.remember">保持登录</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="text-left mar-t-md">
                <el-radio-group v-model="loginForm.type">
                  <el-radio style="color:white" :label="1">废水</el-radio>
                  <el-radio style="color:white" :label="2">废气</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button
              type="warning"
              class="btn-login mar-y-lg"
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
    </main>
    <footer>
      <!-- <span class="copyright">Copyright ©2018 技术支持：xxxx股份有限公司</span> -->
    </footer>
  </div>
</template>


<script>
import { mapState } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      isSee: false,          // 密码是否可见
      loading: false,        // 登录按钮状态
      loginForm: {
        uid: window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : 'superadmin',
        pid: 'system',
        remember: false,
        type: 1,
      },
    };
  },
  computed: {
    ...mapState({             // 获取存储在sessionStorage 的 user
      user: state => state.auth.user,
    }),
    isLoginValid() {          // 用于验证用户是否填写了账户密码
      return this.loginForm.uid && this.loginForm.pid;
    },
    remember() {              // 用户是否点击了保持登录
      return this.loginForm.remember;
    },
    /** 当值为数组时, ['项目名称', '所属集成页面名称']
     *  当值为字符串时, ['', '所属集成页面名称']
     */
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
  // 避免未获取到最新的confog 问题
  beforeRouteLeave(to, from, next) {
    const toName = window.sessionStorage.getItem('amcsType') === 2 ? 'GasRealTimeMonitor' : 'WaterRealTimeMonitor';
    if (toName === to.name) {
      next();
    } else {
      next({ name: toName === to.name ? to.name : toName });
      window.setTimeout(() => {
        window.location.reload(true);
      }, 200);
    }
  },
  methods: {
    onClickLogin() {
      // 1. 验证用户是否填写了账户密码
      if (!this.isLoginValid) return;
      // 2. 登录按钮状态
      this.loading = true;
      // 3. 调登录接口
      this.$store.dispatch('auth/Login', this.loginForm).then(() => {
        this.$store.commit('auth/SetAmcsType', this.loginForm.type);
        // 4. 调侧边栏导航树接口
        // // console.log('侧栏导航配置后解除注释');
        this.$store.dispatch('auth/GetMenu').then(() => {
          this.$store.dispatch('auth/CreateRoutes');
          // 6. 同样是跳转到指定的url，但是这个方法不会向history里面添加新的记录
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
