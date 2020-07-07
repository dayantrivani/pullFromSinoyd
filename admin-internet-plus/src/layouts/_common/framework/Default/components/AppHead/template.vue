<template>
  <header class="app-head">
    <app-brand />
    <div class="app-head-content fn-flex">
      <btn-toggle-side />
      <app-tags v-if="app.custom.tagsMoveTop" />
      <div class="app-head-content__btn">
        <!-- 开发环境提供图标检索功能 -->
        <button
          v-if="$config.app.useSearchIcon"
          title="图标检索"
          class="btn"
          @click="$router.replace({ name: 'search-icon' })">
          <icon name="search" scale="1.6" />
        </button>
        <template v-for="link in $config.links">
          <button
            v-show="link.show"
            class="btn"
            :key="link.title"
            :title="link.title"
            @click="openWindow(link.url)">
            <icon :name="link.icon" scale="1.6" />
          </button>
        </template>
        <btn-toggle-refresh v-if="$config.app.useRefresh" />
        <btn-toggle-fullscreen v-if="$config.app.useFullscreen" />
        <item-user />
        <item-helper v-if="$config.app.useHelper" />
      </div>
    </div>
  </header>
</template>

<script>
import AppTags from '../AppTags';
import AppBrand from '../AppBrand';
import ItemUser from './components/ItemUser';
import ItemHelper from './components/ItemHelper';
import BtnToggleSide from './components/BtnToggleSide';
import BtnToggleRefresh from './components/BtnToggleRefresh';
import BtnToggleFullscreen from './components/BtnToggleFullscreen';

export default {
  name: 'AppHead',
  components: {
    AppTags,
    AppBrand,
    ItemUser,
    ItemHelper,
    BtnToggleSide,
    BtnToggleRefresh,
    BtnToggleFullscreen,
  },
  inject: ['app'],
  methods: {
    openWindow(url) {
      window.open(url);
    },
  },
};
</script>
