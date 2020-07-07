<template>
  <a-locale-provider :locale="locale">
    <router-view id="app" :class="`page-${$route.name}`"></router-view>
  </a-locale-provider>
</template>

<script>
import { mapActions } from 'vuex';

// ant-design-vue 目前的默认文案是英文, 切换至中文
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getToken } from '@/libs/util';


moment.locale('zh-cn');

export default {
  watch: {
    // 根据当前跳转的路由设置显示在浏览器标签的title
    $route: {
      handler(to) {
        console.log(to);
        this.$tools.setTitle(`${to.meta.title || ''} | ${this.$config.app.title}`);
        if (!['login', 'ThematicMap', 'institutions', 'registered', 'ThematicMapNew', 'transit'].includes(to.name)) {
          this.GetBreadcrumbList(to.name);
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      timer: () => { },
      locale: zhCN,
    };
  },
  created() {
    // 移除载入动画节点
    document.body.removeChild(document.getElementById('loader'));
    // 获取是否保持登录
    const remember = this.$tools.getSessionStorage(this.$config.localKey.remember) - 0;
    if (remember && getToken()) {
      this.refreshToken();
      this.timer = setInterval(() => {
        this.refreshToken();
      }, 25 * 60 * 1000);
    } else {
      window.clearInterval(this.timer);
    }
  },
  methods: {
    ...mapActions('auth', ['GetBreadcrumbList']),
    refreshToken() {
      this.$store.dispatch('auth/RefreshToken');
    },
  },
};
</script>
