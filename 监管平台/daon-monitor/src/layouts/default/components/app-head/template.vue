<template>
  <header class="app-head">
    <brand v-once v-show="$route.name !== 'institutions'"/>
    <div class="app-head-content fn-flex">
      <toggle-side v-show="$route.name !== 'institutions'"/>
      <!-- <breadcrumb /> -->
      <div class="flex-1 text-right i-wrap-no">
        <toggle-message v-if="$route.name !== 'institutions'" />
        <toggle-refresh />
        <toggle-fullscreen />
        <item-theme />
        <item-user />
        <item-helper />
      </div>
    </div>
  </header>
</template>

<script>
import Brand from '../app-brand';
// import Breadcrumb from './components/Breadcrumb';
import ItemUser from './components/item-user';
import ItemTheme from './components/item-theme';
import ItemHelper from './components/item-helper';
import ToggleSide from './components/toggle-side';
import ToggleRefresh from './components/toggle-refresh';
import ToggleMessage from './components/toggle-message';
import ToggleFullscreen from './components/toggle-fullscreen';

export default {
  name: 'AppHead',
  components: {
    Brand,
    // Breadcrumb,
    ItemUser,
    ItemTheme,
    ItemHelper,
    // ItemSystem,
    ToggleSide,
    ToggleRefresh,
    ToggleMessage,
    ToggleFullscreen,
  },
};
</script>
