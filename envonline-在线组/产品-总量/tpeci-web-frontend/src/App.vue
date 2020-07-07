<template>
  <div id="app" v-wechat-title="`${title}${$config.title}`">
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      device: {        // 浏览器窗口宽度
        width: 0,
        height: 0,
      },
    };
  },
  computed: {
    title() {
      const { title } = this.$route.meta;
      return title ? `${title} | ` : '';
    },
  },
  watch: {
    device: {
      handler(size) {
        const fz = size.width / 1600 * 100;
        document.documentElement.style.fontSize = `${fz}px`;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    window.document.documentElement.style.fontSize = '100px';
    // 获取窗口宽度,并设置事件屏幕分辨率大小变动时重新设置窗口
    this.onResize();
    window.addEventListener('resize', () => { this.onResize(); });
  },
  methods: {
    onResize() {
      this.device.width = window.document.documentElement.clientWidth;
      this.device.height = window.document.documentElement.clientheight;
    },
  },
};
</script>
