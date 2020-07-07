<template>
  <div class="page-login">
    <div class="login_header">
      <div class="header_main">
        <img src="@/assets/img/logoa.png" />
        <p>{{ $config.app.title }}</p>
      </div>
    </div>
    <div class="login_main">
      <div class="canvas" id="particles-js"></div>
      <div class="content">
        <div class="bg_title">
          <img class="login_img" src="@/assets/img/bg-title.png" />
          <p class="titile_des">OPERATION MANAGEMENT SPECIALIST</p>
          <div class="title_mes">为您提供可视化的 环境在线监控运维信息管理服务</div>
        </div>
        <div class="login_class">
          <div class="login_title">
            <div class="login_title_name">密码登录</div>
          </div>
          <div class="login_content">
            <a-input placeholder="登录用户名" v-model="loginForm.uid">
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
            </a-input>
            <a-input placeholder="登录密码" type="password" v-model="loginForm.pid">
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input>
            <a-button
              type="primary"
              :disabled="!loginForm.uid || !loginForm.pid"
              @click="onClickLogin"
            >登录</a-button>
            <span class="regire_new" @click="registered">注册新用户</span>
          </div>
          <img class="login_img" src="@/assets/img/erweima.png" />
          <div class="row-to-erweima pos-abstext-xs">
            <div class="pos-rel">
              扫码下载监管手机app
              <div class="pos-abs row"></div>
            </div>
          </div>
          <div class="login_erweim">
            <img src="@/assets/img/login_erweima.png" alt />
          </div>
        </div>
      </div>
    </div>
    <dialog-system ref="DialogSystem" />
    <!-- <div :class="{ 'container': 1, 'right-panel-active': toggle }">
      <div class="form-container sign-up-container">
        <h2 v-if="organization.length">请选择</h2>
        <div class="default-class" v-if="!organization.length">
          <div class="default-der">
            <p>您尚未属于任何监管机构或企业</p>
            <p>请先创建您的监管机构或关联您的企业</p>
          </div>
        </div>
        <scrollbar class="ps-group" v-if="organization.length">
          <div
            v-for="item in organization"
            :key="item.id"
            :class="{ 'ps-item': 1, 'is-active': item.id === selected }"
            @click="onSelectedPs(item)">
            <div class="img-class">
              <img :src="item.pic ? `/api/monitor/static/files/${item.pic}` : img"/>
            </div>
            <a-tag :color="item.type === 1 ? 'purple' : 'blue' ">
              {{ item.type === 1 ? '机构' : '企业' }}
            </a-tag>
            <span>{{ item.firmName || item.companyName }}</span>
          </div>
        </scrollbar>
        <div class="btn mar-t-sm" v-if="organization.length" @click="onClickIn">进入平台</div>
      </div>
      <div class="form-container sign-in-container">
        <h1>登录</h1>
        <div class="input-outline-x">
          <input
            class="input-control input-outline"
            type="text"
            v-model="loginForm.uid"
            placeholder="用户名"
            @keyup.enter="onClickLogin()"
            autofocus="autofocus" />
          <label class="input-label">用户名</label>
        </div>
        <div class="input-outline-x">
          <input
            v-model="loginForm.pid"
            class="input-control input-outline"
            placeholder="密码"
            autocomplete="off"
            :type="password"
            @keyup.enter="onClickLogin()"
            @focus="password = 'password'" />
          <label class="input-label">密 码</label>
        </div>
        <div class="registered-class">还没有账号？<span @click="registered">注册新账号</span></div>
        <div :class="{ 'btn': 1, 'is-disable': loginDisable }" @click="onClickLogin()">
          <span>登录</span>
          <span v-show="loading">中...</span>
        </div>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
          <h1 class="app-title">{{ $config.app.title }}</h1>
          <div class="box-group">
            <h2 class="box-item" @click="onClickAgency">
              <icon name=icon-qiye />
              <span>新建机构</span>
              <span class="der">点击新建您的监管机构或者加入平台已有的监管机构</span>
            </h2>
          </div>
          <div class="btn ghost" @click="SwtichToggle(0)">返回登录</div>
        </div>
          <div class="overlay-panel overlay-right">
            <h1 class="app-title">{{ $config.app.title }}</h1>
            <h2>欢迎回来！</h2>
            <p>输入您的用户信息登录后，进行操作。</p>
          </div>
        </div>
      </div>
    </div>-->
    <footer class="copyright">Copyright ©2019 技术支持：道农(武汉)大数据科技有限公司</footer>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { resetRouter } from '@/routes';
import particlesConfig from './particles.json';
import { getMenu, chooseReg } from '@/api/auth.js';
import { setSessionStorage } from '@/libs/tools';
import DialogSystem from './components/DialogSystem';

export default {
  name: 'login',
  components: {
    DialogSystem,
  },
  data() {
    return {
      // eslint-disable-next-line
      img: require('@/assets/img/login_bg_1920x1080.jpg'),
      // isCompany: false,
      // isShowPSW: false,
      // toggle: false,
      loading: false,
      password: 'text',
      loginForm: {
        uid: '',
        pid: '',
        remember: false,
      },
      // selected: {},
      // selectedCompany: {},
      // organization: '',
      organization: [],
      selected: '',
      cuttenSeleted: {},
    };
  },
  computed: {
    ...mapState('auth', ['toggle', 'isVisible']),
    loginDisable() {
      return !(this.loginForm.uid && this.loginForm.pid);
    },
  },
  watch: {
    remember: {
      handler(val) {
        this.isSee = !(val.remember || true);
      },
      deep: true,
    },
  },
  created() {
    // const isTrue = this.$tools.getLocalStorage('organization');
    // console.log(isTrue);
    // if (isTrue && isVisible) {
    //   this.$nextTick(() => {
    //     this.$refs.DialogSystem.openDialog(isTrue);
    //   });
    //   // this.organization = this.$tools.getLocalStorage('organization') ? this.$tools.getLocalStorage('organization') : [];
    //   // this.selected = this.organization.length ? this.organization[0].id : '';
    //   // this.cuttenSeleted = this.organization.length ? this.organization[0] : '';
    // }
  },
  mounted() {
    // 动态载入粒子插件
    this.$tools.asyncLoadPlugin('particlesJS', { src: 'https://unpkg.com/particles.js@2.0.0/particles.js' })
      .then(() => {
        // 初始化粒子插件
        window.particlesJS('particles-js', particlesConfig);
      });
    const isTrue = this.$tools.getLocalStorage('organization');
    if (isTrue && this.isVisible) {
      this.$nextTick(() => {
        this.$refs.DialogSystem.openDialog(isTrue);
      });
    }
  },
  beforeDestroy() {
    // 销毁 particlesJS
    // thanks https://github.com/d2-projects/d2-admin/issues/65
    if (window.pJSDom && window.pJSDom.length > 0) {
      window.pJSDom[0].pJS.fn.vendors.destroypJS();
      window.pJSDom = [];
    }
  },
  destroyed() {
    // 离开页面重置状态
    this.SwtichToggle(0);
  },
  methods: {
    ...mapMutations('auth', ['SwtichToggle']),
    ...mapActions('auth', ['Login', 'GetUserMenu']),
    // // 选择企业&机构
    // onSelectedPs(item, type) {
    //   if (!type) {
    //     this.selected = item;
    //   } else {
    //     this.selectedCompany = item;
    //   }
    // },
    // 选择企业&机构
    onSelectedPs(item) {
      this.selected = item.id;
      this.cuttenSeleted = item;
    },
    // 新建机构
    onClickAgency() {
      this.$router.push({ name: 'institutions' });
    },
    // 账户注册
    registered() {
      this.$router.push('/registered');
    },
    // 选择机构或者企业
    onClickIn() {
      // this.isCompany = true;
      if (!this.organization.length) return;
      chooseReg(this.selected).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.$message.success(`欢迎使用${this.$config.app.title}！`);
          getMenu().then((response) => {
            if (response.data.code === 200 && response.data.success) {
              const tem = response.data.data;
              const temFunc = (obj) => {
                this.$set(obj, 'id', obj.url);
                this.$set(obj, 'icon', obj.icon.slice(5));
                this.$set(obj, 'label', obj.name);
                this.$set(obj, 'moduleCode', obj.url);
                this.$set(obj, 'moduleUrl', obj.url);
                this.$set(obj, 'parentId', '0');
                if (obj.children && obj.children.length !== 0) {
                  obj.children.forEach((el) => {
                    this.$set(el, 'parentCode', obj.url);
                    temFunc(el);
                  });
                } else if (obj.children && obj.children.length === 0) {
                  this.$delete(obj, 'children');
                }
              };
              tem.forEach((el) => {
                temFunc(el);
              });
              setSessionStorage(this.$config.localKey.navMenu, tem);
              this.GetUserMenu().then((data) => {
                resetRouter(data);
                this.$router.replace({ name: this.$config.app.home });
              });
            } else {
              this.$message.error(response.data.msg);
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // hidePsw() {
    //   this.isShowPSW = false;
    //   this.password = 'password';
    // },
    // showPsw() {
    //   this.isShowPSW = true;
    //   this.password = 'text';
    // },
    // 登录
    onClickLogin() {
      if (this.loading || this.loginDisable) return;
      this.loading = true;
      this.Login(this.loginForm).then((response) => {
        // this.toggle = 1;
        // this.SwtichToggle(1);
        // this.password = 'text';
        // this.loginForm.pid = '';
        this.$message.success('登录成功，请选择机构或企业');
        // 获取当前账号的机构和企业信息
        // if (!response.organizationMap) return;
        const par = response.organizationMap ? Object.values(response.organizationMap) : [];
        this.$refs.DialogSystem.openDialog(par);
        this.organization = Object.values(response.organizationMap);
        // 默认选中第一个企业
        // eslint-disable-next-line
        // this.selected = this.organization[0];
        this.selected = this.organization.length ? this.organization[0].id : '';
        this.cuttenSeleted = this.organization.length ? this.organization[0] : '';
        this.$tools.setLocalStorage('organization', this.organization);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
