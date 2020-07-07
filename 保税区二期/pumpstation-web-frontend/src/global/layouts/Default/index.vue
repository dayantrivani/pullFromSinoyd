<template>
  <div class="g-wrap">
    <layout-header :class="{ 'g-head': 1, 'is-fold': isFold }" />
    <layout-sidebar :class="{ 'g-side': 1, 'is-fold': isFold }" />
    <main ref="main" :class="{ 'g-main': 1, 'is-fold': isFold }">
      <transition name="fade-move" mode="out-in">
        <!-- keep-alive 是vue自带的组件,被该组件包裹的页面(或内容),相互切换不会清空操作记录 -->
        <keep-alive :include="cachedViews" :max="maxCache">
          <router-view v-if="isRefresh" />
        </keep-alive>
      </transition>
    </main>
  </div>
</template>

<script>
import LayoutHeader from './components/Header';
import LayoutSidebar from './components/Sidebar';

export default {
  components: {
    LayoutHeader,
    LayoutSidebar,
  },
  data() {
    return {
      // 最大缓存页面数量
      maxCache: 15,
    };
  },
  computed: {
    // 是否折叠
    isFold() {
      return !this.$store.state.isFold;
    },
    // 缓存页面
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    // 是否刷新页面
    isRefresh() {
      return this.$store.state.tagsView.isRefresh;
    },
  },
};
</script>

<style lang="scss">
  .fade-move-leave-active,
  .fade-move-enter-active {
    transition: all .15s;
  }
  .fade-move-enter {
    opacity: 0;
    transform: translateX(-10px);
  }
  .fade-move-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
