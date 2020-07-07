<template>
  <button
    v-show="$config.layout.fullScreenShow"
    class="btn"
    :title="isFullscreen ? '还原' : '全屏'"
    @click="toggleFullscreen">
    <icon :name="`icon-window-${isFullscreen ? 'restore' : 'full'}`" size="1.4em" :offset="{ top: '1px' }" />
  </button>
</template>

<script>
export default {
  name: 'ToggleFullscreen',
  inject: ['app'],
  data() {
    return {
      isFullscreen: false,
    };
  },
  methods: {
    // 切换全屏
    toggleFullscreen() {
      const el = document.documentElement;
      const fullScreen = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      // eslint-disable-next-line
      const exitScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msExitFullscreen;
      if (!this.isFullscreen) {
        if (fullScreen) {
          fullScreen.call(el);
          this.isFullscreen = true;
        } else if (window.ActiveXObject) {
          // TODO: 万恶的IE
          // 这么丑的代码肯定是兼容IE的
          const wscript = new window.ActiveXObject('WScript.Shell');
          wscript.SendKeys('{F11}');
        }
      } else {
        exitScreen.call(document);
        this.isFullscreen = false;
      }
    },
  },
};
</script>
