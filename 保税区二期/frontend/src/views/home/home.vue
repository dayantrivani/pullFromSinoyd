<template>
  <div class="page-home">
    <header class="home_header">
      <div ref="lottie_box_head" class="banner"></div>
      <figure class="Logout">
        <img src="../../assets/img/home/user_36x36.png" alt="" @click="onPassClick">
        <figcaption>
          <section class="Logout_user"><div class="hide" :title="`欢迎您，${name}`">欢迎您，{{name}}</div></section>
          <section class="Logout_icon btn" @click="onClickLogout">
            <span>退出</span>
            <img src="../../assets/img/home/btn_logout_icon14x14.png" alt="">
          </section>
        </figcaption>
      </figure>
    </header>
    <section class="home_body">
      <section class="body-header">
        <div ref="lottie_box" class="body-bg-svg"></div>
        <div class="header-left">
          <div ref="lottie_box_left"></div>
          <animates :time="500" effect="fadeIn" :position="false" speed="slow">
            <p class="header-title">污染源</p>
          </animates>
        </div>
        <animates :time="800" effect="fadeIn" :position="false" speed="speed">
          <div class="header-center">
            <div class="center-left">
              <div :class="`left_${key}`" v-for="(item,key) in cleft" :key="key" @click="onLink(item)"></div>
            </div>
            <div class="center-right">
              <div :class="`right_${key}`" v-for="(item,key) in cright" :key="key" @click="onLink(item)"></div>
            </div>
          </div>
        </animates>
        <div class="header-right">
          <div ref="lottie_box_right" class="header-right-svg"></div>
          <animates :time="500" effect="fadeIn" :position="false" speed="slow">
            <p class="header-title">环境质量</p>
          </animates>
        </div>
      </section>
      <el-row class="body-footer">
        <div
          :class="`pic-text_${key}`"
          v-for="(item,key) in footerInfo"
          :key="key"
          @click="![3, '3', 9, '9'].includes(key) ? onLink(item) : ''"
          @mouseenter="onMouseenter(key)"
          @mouseleave ="onMouseleave(key)"
        >
          <img
            :src="require(`../../assets/img/home/pic-text_${hoverIndex === key ? `${hoverIndex}_hover` : key}.png`)"
            alt=""
            draggable="false"
          >
          <div class="pic-text-icon" v-if="[3, '3'].includes(key) && hoverIndex === key" style="position: absolute; top: 20%;">
            <p @click="onLink(item[0])">
              <img :src="require('../../assets/img/home/pic-text_3_gas.png')">
              <span class="mar-l-xs" style="font-size:0.18rem;">大气云电力</span>
            </p>
            <p @click="onLink(item[1])">
              <img :src="require('../../assets/img/home/pic-text_3_water.png')">
              <span class="mar-l-xs" style="font-size:0.18rem;">废水云电力</span>
            </p>
          </div>
          <div class="pic-text-icon" v-if="[9, '9'].includes(key) && hoverIndex === key" style="position: absolute; top: 14%;">
            <p @click="onLink(item[0])">
              <img :src="require('../../assets/img/home/pic-text_9_yuan.png')">
              <span class="mar-l-xs" style="font-size:0.18rem;">一园一档</span>
            </p>
            <p @click="onLink(item[1])">
              <img :src="require('../../assets/img/home/pic-text_9_ent.png')">
              <span class="mar-l-xs" style="font-size:0.18rem;">一企一档</span>
            </p>
          </div>
        </div>
      </el-row>
    </section>
    <aside>
      <div :class="`aside_${key}`" v-for="(item,key) in aside" :key="key" @click="onLink(item)"></div>
    </aside>
    <pass ref="passDialog"></pass>
  </div>
</template>

<script>
import lottie from 'lottie-web';
import { mapActions } from 'vuex';
import Pass from '@/components/locally/DialogPass';
import * as animationDataBg from '../../assets/homeBgSvg.json';
import * as animationDataHead from '../../assets/homeHeadSvg.json';
import * as animationDataTitle from '../../assets/homeTitleSvg.json';

export default {
  name: 'Home',
  inject: ['app'],
  components: {
    Pass,
  },
  data() {
    return {
      hoverIndex: '',
      aside: {
        1: 'alarm',
        2: 'base',
        3: 'frame',
      },
      cleft: {
        1: 'psamcsGas',            // 废气
        2: 'psamcsWater',          // 废水
        3: 'tpeci',                // 总量
        4: 'LDAR',                 // LDAR
        5: '#',                 // 在线工况
        6: 'rain',                 //  雨水
      },
      cright: {
        1: 'petition',             // 信访系统
        2: 'voyage',               // 走航
        3: 'airquality',           // 大气监测
        4: '#',                 // 3D管网
        5: 'skweb',                // 污水管控
        6: 'surfacewater',         // 水质监测
      },
      footerInfo: {
        1: 'bsqvideo',                // 视频监控
        2: 'eec',                  // 能耗管理
        3: ['gasColud', 'powerColud'],     // [, 电力云]
        4: 'gis',                  // GIS
        5: 'kanban',     // 环境预警系统
        6: 'SchedulingCommand',    // 可视化中心
        7: 'areaWaste',            // 危废系统
        8: 'ssx',                  // 例行填报
        9: ['park', 'enterprise'], // [一园一档, 一企一档]
      },
      lottie: null,
      lottieLeft: null,
      lottieRight: null,
    };
  },
  created() {
    this.fnResize();
  },
  mounted() {
    this.lottie = lottie.loadAnimation({
      container: this.$refs.lottie_box,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      // 这个地方传入到的时候，通过看vue调试器发现，这个json文件的格式不是object，而是module，这个把这个格式的数据打开，取他的默认default才能是正确的数据
      animationData: animationDataBg.default,
    });
    this.lottieLeft = lottie.loadAnimation({
      container: this.$refs.lottie_box_left,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationDataHead.default,
    });
    this.lottieLeft = lottie.loadAnimation({
      container: this.$refs.lottie_box_right,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationDataHead.default,
    });
    this.lottieRight = lottie.loadAnimation({
      container: this.$refs.lottie_box_head,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationDataTitle.default,
    });
  },
  computed: {
    name() {
      return this.$store.state.auth.userInfo.userName || '';
    },
  },
  methods: {
    ...mapActions('auth', ['Logout']),
    onMouseenter(index) {
      if (index === '3' || index === '9') this.hoverIndex = index;
    },
    onMouseleave(index) {
      if (index === '3' || index === '9') this.hoverIndex = '';
    },
    onLink(name) {          // 跳转链接
      if (name === 'SchedulingCommand') {
        window.open('#/SchedulingCommand');
      } else if (name === 'envWarningSystem') {
        window.open('#/envWarningSystem');
      } else if (name === '#') {
        window.open('#');
      } else if (name === 'http') {
        window.open('http://223.84.169.166:8088/JAEMIS/login.aspx');
      } else {
        this.app.onClickLink(name);
      }
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
    onPassClick() { // 点击头像修改密码
      this.$refs.passDialog.openDialog();
    },
    onClickSetting() {      // 打开弹框
      this.$refs.dialog.openDialog();
    },
    fnResize() {
      let deviceWidth = document.documentElement.clientWidth || window.innerWidth;
      if (deviceWidth >= 1920) {
        deviceWidth = 1920;
      }
      if (deviceWidth <= 1600) {
        deviceWidth = 1600;
      }
      document.documentElement.style.fontSize = `${deviceWidth / 16} + px`;
      window.addEventListener('resize', () => { this.fnResize(); });
    },
  },
};
</script>
