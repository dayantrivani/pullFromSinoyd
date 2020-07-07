<template>
  <div
    :class="{
      'app': 1,
      'is-collapse': custom.sideCollapse,
      'app-tags-view': custom.tagsUse,
      'app-tags-fixed': custom.tagsFixed,
      'app-head-fixed': custom.headFixed,
      'app-side-fixed': custom.sideFixed,
      'app-head-stick': custom.headStick && custom.headFixed,
      'app-head-hide': hideShow && custom.headFixed && custom.headGlideHide,
    }">
    <app-head />
    <app-side />
    <!-- <a-back-top /> -->
    <main class="app-main" ref="main">
      <app-tags />
      <transition name="fade-move" mode="out-in">
        <keep-alive :include="cacheViews" :max="$config.app.viewCacheMax">
          <!-- <iframe v-if="$config.app.iframe" :src="iframeSrc"></iframe> -->
          <router-view v-if="reload" />
        </keep-alive>
      </transition>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import AppHead from './components/app-head';
import AppSide from './components/app-side';
import AppTags from './components/app-tags';

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
      },
      immediate: true,
    },
    'custom.themeSide': {
      handler(val) {
        document.body.setAttribute('themetype', val);
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
    const customLocal = this.$tools.getSessionStorage(this.$config.localKey.custom) || this.$config.custom;
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
      this.$tools.setSessionStorage(this.$config.localKey.custom, config);
    },
  },
};
</script>
