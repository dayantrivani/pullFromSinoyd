<template>
  <router-view id="app"></router-view>
</template>

<script>
import links from '@/config/links';
import { IEVersion } from '@/libs/tools';

export default {
  provide() {
    return { app: this };
  },
  watch: {
    // 根据当前跳转的路由设置显示在浏览器标签的title
    $route() {
      this.setTitle();
    },
    deviceWidth: {
      handler(size) {
        // 设计稿尺寸（宽度）
        const PSD_SIZE = 1920;
        // 浏览器窗口宽度
        let width = size;
        // html的font-size始终等于横向分辨率/body元素宽
        // if (size < 1600) width = 1600;
        // if (size > PSD_SIZE) width = PSD_SIZE;
        if (size < 1440) width = 1440;
        // 设置html的font-size = 设备宽度 ÷ (设计稿宽度 ÷ 参考像素)
        document.documentElement.style.fontSize = `${width / (PSD_SIZE / 100)}px`;
      },
      immediate: true,
    },
  },
  data() {
    return {
      deviceWidth: document.documentElement.clientWidth,        // 浏览器窗口宽度
      modLink: links,                                           // 链接地址
    };
  },
  created() {
    this.setTitle();
  },
  mounted() {
    const self = this;
    window.onresize = ()  => {
      self.deviceWidth = document.documentElement.clientWidth;
    };
  },
  methods: {
    setTitle() {
      window.document.title = `${this.$route.meta.title || ''} | ${this.$config.app.title}`;
    },
    onClickLink(name) {                 // 跳转地址前的处理
      const item = this.modLink[name];
      if (item.link === '#') return;
      if (['psRecord', 'common'].includes(name) && item.type) {
        window.sessionStorage.setItem('baseType', item.type);
      } else if (['psamcsWater', 'psamcsGas'].includes(name) && item.type) {
        window.sessionStorage.setItem('amcsType', item.type);
      }
      if (name === 'powerColud') {
        if (this.$store.state.auth.status === 200) {
          const eleToken = JSON.parse(window.sessionStorage.getItem('eleToken'));
          this.openWin(item.link, { token: eleToken }, 'https://ele.envchina.com/#/loading');
        }
      } else {
        this.openWin(item.link);
      }
    },
    openWin(toLink, message, targetWin) {  // 新窗口跳转到链接页
      let link = '';
      if (toLink.includes('http://') || toLink.includes('https://')) {    // 如果地址包含http
        link = toLink;
      } else if (IEVersion() === 10) {     // 如果是IE10浏览器
        link = `${window.location.protocol}//${window.location.host}/${toLink}/#/`;
      } else {                             // 其余浏览器
        link = `${window.location.origin}/${toLink}/#/`;
      }
      const linkWin = window.open(link, '_blank');  // 使用新窗口打开地址
      setTimeout(() => {
        linkWin.postMessage(message, targetWin);
      }, 3000);
    },
  },
};
</script>
