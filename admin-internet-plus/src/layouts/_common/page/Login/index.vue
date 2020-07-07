<template>
  <div class="page-login">
    <!-- 粒子动画绑定元素 -->
    <div class="canvas" id="particles"></div>
    <!-- 容器 -->
    <div :class="{ 'container': 1, 'right-panel-active': toggle }">
      <!-- 选择企业 -->
      <select-team @load="toHome" />
      <!-- 登录表单 -->
      <form-login @load="toggle = 1" />
      <!-- 侧边信息 -->
      <div class="overlay-container">
        <div class="overlay">
          <!-- 选择企业 -->
          <div class="overlay-panel overlay-left">
            <h1 class="app-title">{{ $config.app.title }}</h1>
            <span class="border-y pad-a-sm">欢迎, {{ userInfo.userName }}</span>
            <div class="box-group">
              <h2 class="box-item">
                <icon name="icon-qiyexinxi" />
                <div class="flex-1 text-left">
                  <p class="mar-y-xs pad-l-sm">如果您是监管用户，点击这里新建您的监管机构或者加入平台已有的监管机构</p>
                </div>
              </h2>
              <h2 class="box-item">
                <div class="flex-1 text-left">
                  <p class="mar-y-xs pad-l-sm">如果您是企业用户，点击这里关联您所属的企业</p>
                </div>
                <icon name="relevance" />
              </h2>
            </div>
            <div class="btn ghost" @click="backLogin()">返回登录</div>
          </div>
          <!-- 用户登录 -->
          <div class="overlay-panel overlay-right">
            <h1 class="app-title">{{ $config.app.title }}</h1>
            <h2>欢迎回来！</h2>
            <p>输入您的用户信息登录后，进行操作。</p>
            <p>还没有账号？
              <el-button round>注册新账号</el-button>
            </p>
          </div>
        </div>
      </div><!-- /.overlay-container -->
    </div><!-- /.container -->
    <footer class="copyright">{{ $config.app.copyright }}</footer>
  </div><!-- /.page-login -->
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import FormLogin from './components/FormLogin';
import SelectTeam from './components/SelectTeam';
import pluginConfig from './components/config.plugin.json';

export default {
  name: 'login',
  components: {
    FormLogin,
    SelectTeam,
  },
  data() {
    return {
      toggle: false,
    };
  },
  computed: mapState('auth', ['userInfo']),
  // 导航离开该组件的对应路由时调用
  beforeRouteLeave(to, from, next) {
    next({ replace: true });
    this.$nextTick(() => {
      this.$message.success(`欢迎使用${this.$config.app.title}！`);
    });
  },
  mounted() {
    // 动态载入粒子插件
    this.$tools.asyncLoadPlugin('particlesJS', { src: 'https://cdn.bootcdn.net/ajax/libs/particles.js/2.0.0/particles.min.js' })
      .then(() => {
        // 初始化粒子插件
        window.particlesJS('particles', pluginConfig);
        this.$once('hook:beforeDestroy', () => {
          // 销毁 particlesJS
          // thanks https://github.com/d2-projects/d2-admin/issues/65
          if (window.pJSDom && window.pJSDom.length > 0) {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            window.pJSDom = [];
          }
        });
      });
  },
  methods: {
    ...mapMutations('auth', ['SetSelectedOrg', 'SetLogout']),
    // 返回登录
    backLogin() {
      this.toggle = 0;
      this.SetSelectedOrg();
      this.SetLogout();
    },
    // 进入平台首页
    toHome() {
      this.$router.replace({ name: this.$config.app.home });
    },
  },
};
</script>

<style lang="scss">
@import './style.scss';
</style>
