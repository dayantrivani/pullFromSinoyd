<!-- 嵌入布局 -->
<template>
  <div
    v-loading="loading"
    element-loading-background="#F2F2F2"
    :fill="fill"
    :class="{
      'mod-container': 1,
      'layout-iframe': 1,
      'is-iframe': 1,
    }"
    :style="{
      'padding': padding,
    }"
  >

    <!-- 头部内容 -->
    <slot name="header"></slot>

    <!-- 嵌入布局 -->
    <div ref="iframeWrap" class="iframe-wrap"></div>
  </div>
</template>

<script>
export default {
  name: 'Iframe',
  inheritAttrs: false,
  props: {
    // 内边距
    padding: {
      type: String,
      default: '0',
    },
    // 高度撑满
    fill: {
      type: Boolean,
      default: false,
    },
    // iframe: 嵌入模式地址
    src: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  watch: {
    $route: {
      handler(route) {
        this.loadIframe(route.meta.link || this.src);
      },
      immediate: true,
    },
  },
  methods: {
    // 加载页面
    loadIframe(src = this.src) {
      this.loading = true;
      const iframe = document.createElement('iframe');
      iframe.src = src;
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.loading = false;
        });
      } else {
        iframe.onload = () => {
          this.loading = false;
        };
      }
      this.$nextTick(() => {
        const iframeTemp = this.$refs.iframeWrap.children;
        if (!iframeTemp.length) {
          this.$refs.iframeWrap.appendChild(iframe);
        } else {
          this.$refs.iframeWrap.removeChild(iframeTemp[0]);
          this.$refs.iframeWrap.appendChild(iframe);
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* layout-iframe 嵌入布局模式
-------------------------- */
.app {
  // 固定顶栏情况下调整
  &.app-head-fixed .mod-container.layout-iframe {
    height: calc(100vh - #{$-head-height});
  }
  // 固定多页签情况下调整
  &.app-tags-view .mod-container.layout-iframe {
    height: calc(100vh - #{$-head-height + $-tags-height});
  }
}

.layout-iframe {
  overflow: hidden !important;
  .iframe-wrap, iframe {
    width: 100%;
    height: 100%;
  }
  iframe { border: 0; }
}
</style>
