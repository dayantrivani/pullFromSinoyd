<template>
  <div
    :class="{
      'app': 1,
      'is-collapse': custom.sideCollapse,
      'app-tags-view': custom.tagsUse && !custom.tagsMoveTop,
      'app-tags-fixed': custom.tagsFixed,
      'app-head-fixed': custom.headFixed,
      'app-side-fixed': custom.sideFixed,
      'app-head-stick': custom.headStick && custom.headFixed,
      'app-head-hide': hideShow && custom.headFixed && custom.headGlideHide,
    }">
    <app-head />
    <app-side />
    <div
      v-if="custom.showSideBtnMiddle"
      class="side-toggle"
      @click="setCustomParam('sideCollapse', !custom.sideCollapse)"
    >
      <i :class="`icon el-icon-arrow-${custom.sideCollapse ? 'left' : 'right'}`"></i>
      <div class="shape"></div>
    </div>
    <el-backtop :right="20" />
    <main class="app-main" ref="main">
      <app-tags v-if="!custom.tagsMoveTop" />
      <keep-alive :include="cacheViews" :max="$config.app.viewCacheMax">
        <router-view v-if="reload" />
      </keep-alive>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import AppHead from './components/AppHead';
import AppSide from './components/AppSide';
import AppTags from './components/AppTags';

export default {
  components: {
    AppHead,
    AppSide,
    AppTags,
  },
  provide() {
    return { app: this };
  },
  computed: {
    ...mapState('tagsView', ['reload']),
    ...mapGetters('tagsView', ['cacheViews']),
    // 下拉隐藏顶栏的滚动距离
    hideShow() {
      return this.scrollTop > 100;
    },
  },
  watch: {
    'custom.theme': {
      handler(val) {
        document.body.setAttribute('theme', val);
        // 非IE浏览器则应用UI控件跟随主题效果
        if (!this.$tools.IEVersion()) {
          document.documentElement.style.setProperty('--primary', `var(--theme-${val})`);
        }
      },
      immediate: true,
    },
    'custom.themeHead': {
      handler(val) {
        document.body.setAttribute('head', val);
      },
      immediate: true,
    },
    'custom.themeSide': {
      handler(val) {
        document.body.setAttribute('side', val);
      },
      immediate: true,
    },
  },
  data() {
    return {
      custom: this.$config.custom,  // 用户个性化配置 @/src/config
      scrollTop: 0,
    };
  },
  created() {
    const customLocal = this.$tools.getLocalStorage(this.$config.localKey.custom) || this.$config.custom;
    this.custom = customLocal;
    document.onscroll = () => {
      this.scrollTop = this.$tools.getScrollTop();
    };
  },
  methods: {
    // 设置参数配置
    setCustomParam(key, val) {
      this.custom[key] = val;
    },
    // 设置&本地存储个性化配置
    setCustomConfig(config) {
      this.custom = config;
      this.$tools.setLocalStorage(this.$config.localKey.custom, config);
    },
  },
};
</script>
