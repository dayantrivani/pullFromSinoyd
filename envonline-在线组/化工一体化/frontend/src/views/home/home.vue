<template>
  <div class="page-home">
    <header class="home_header">
      <div class="sup-control">
        <div class="left-time">
          <div class="date-box">
            <p class="time">{{nowTime[1]}}</p>
            <p>{{nowTime[0]}}</p>
          </div>
        </div>
        <div class="right-user">
          <figure class="Logout">
            <img src="../../assets/wholeprocessImage/user.png"/>
            <figcaption>
              <section class="Logout_user"><div class="hide" :title="`欢迎您，${name}`">欢迎您，{{name}}</div></section>
              <section class="Logout_icon btn" @click="onClickLogout">
                <span>退出</span><img src="../../assets/wholeprocessImage/tuichu.png"/>
              </section>
            </figcaption>
          </figure>
        </div>
      </div>
      <div class="header-title"></div>
    </header>
    <div class="home_body">
      <control-item
        class="body-item"
        v-for="(item, index) in links"
        :key="index"
        :index="index"
        :itemList="itemList"
        @click="onLink(item)"></control-item>
    </div>
    <footer class="home_footer">
      <div class="footer-container">
        <div class="sub-control icon-left" @click="onLink('base')">
          <img src="../../assets/wholeprocessImage/base.png"/>
          <div class="control-icon"></div>
        </div>
        <div class="sub-control" @click="onLink('emergency')">
          <img src="../../assets/wholeprocessImage/emergency.png"/>
          <div class="control-icon"></div>
        </div>
        <div class="sub-control icon-right" @click="onLink('frame')">
          <img src="../../assets/wholeprocessImage/frame.png"/>
          <div class="control-icon">
        </div></div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import controlItem from './components/controlItem/index';

export default {
  name: 'Home',
  inject: ['app'],
  components: {
    controlItem,
  },
  data() {
    return {
      nowTime: ['', ''], // 当前时间
      itemList: {
        isShowValue: true,
        data: [{
          text: '储罐接入',
          value: 24,
          unit: '个',
        }, {
          text: '气体接入',
          value: 141,
          unit: '个',
        }, {
          text: '视频接入',
          value: 24,
          unit: '个',
        }, {
          text: '警告数量',
          value: 0,
          unit: '个',
        }],
      },
      links: {
        1: 'keypoint',
        2: 'wholeprocess',
        3: 'gis',
        4: '',
        5: 'risk',
      },
    };
  },
  created() {
    this.setNowTime(); // 初始化定时器
  },
  destroyed() {
    clearTimeout(this.timeoutId); // 销毁定时器
  },
  computed: {
    name() {
      return this.$store.state.auth.userInfo.userName || '';
    },
  },
  methods: {
    ...mapActions('auth', ['Logout']),
    setNowTime() {
      if (!(this && this._isDestroyed)) { // 判断当前组件是否被销毁 如果没有被销毁就新建定时器实时刷新时间
        this.nowTime = this.$tools.formatDate(new Date(), 'Y年m月d日 H:i:s').split(' ');
        this.timeoutId = setTimeout(this.setNowTime, 1000);
      }
    },
    onLink(name) {          // 跳转链接
      this.app.onClickLink(name);
    },
    onClickLogout() {       // 注销登录
      // this.$router.push({ name: 'Login' });
      if (process.env.NODE_ENV === 'production') {
        if (this.$store.state.auth.userInfo.loginUrl) {
          window.location.href = this.$store.state.auth.userInfo.loginUrl;
        } else {
          window.location.href = `${window.location.origin}/frontend/#/login`;
        }
      } else {
        this.$router.replace({ name: 'Login' });
      }
      this.Logout();
    },
  },
};
</script>
