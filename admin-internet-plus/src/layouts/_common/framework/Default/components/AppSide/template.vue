<template>
  <aside class="app-side">

    <app-brand />

    <!-- 导航菜单 -->
    <el-scrollbar :class="{ 'menu-scroll': 1, 'toggle': app.custom.showSideBtnBottom }" :native="false" :noresize="false">
      <el-menu
        ref="menu"
        router
        :class="{ 'sidebar line': 1, 'is-hide-icon': app.custom.hideChildIcon }"
        :collapse-transition="false"
        :collapse="!app.custom.sideCollapse"
        :unique-opened="app.custom.sideAccordion"
        :default-active="$route.name"
      >
        <sub-item
          v-for="item in userMenu"
          :key="item[$config.navbar.code]"
          :popper-class="`sidebar-popper ${app.custom.hideChildIcon ? 'is-hide-icon' : ''}`"
          :data="item"
          :navbar="$config.navbar"
        />
      </el-menu>
    </el-scrollbar>
    <div
      v-if="app.custom.showSideBtnBottom"
      class="btn-menu-toggle"
      @click="app.setCustomParam('sideCollapse', !app.custom.sideCollapse)"
    >
      <icon :name="`double-${app.custom.sideCollapse ? 'left' : 'right'}`" />
      <span>收起侧边栏</span>
    </div>
  </aside>
</template>

<script>
import { mapState } from 'vuex';
import AppBrand from '../AppBrand';
import SubItem from './components/SubItem';

export default {
  name: 'AppSide',
  components: {
    AppBrand,
    SubItem,
  },
  inject: ['app'],
  provide() {
    return { side: this };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('auth', ['userMenu']),
  },
};
</script>
