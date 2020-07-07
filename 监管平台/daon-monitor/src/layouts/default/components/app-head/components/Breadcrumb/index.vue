<template>
  <a-breadcrumb v-show="app.custom.crumbsShow" separator="/">
    <a-breadcrumb-item
      class="z-pointer"
      v-show="$config.app.home === 'home' && $route.name !== $config.app.home"
      @click.native="onBackHome">
      <icon v-show="app.custom.crumbsIconShow" name="home" /> 首页
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.id">
      <icon
        v-show="app.custom.crumbsIconShow && item.icon"
        :name="item.icon || ''"
        :offset="getIconOffset(item)" />
      {{ item.label }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Breadcrumb',
  inject: ['app'],
  computed: mapState('auth', ['breadcrumbList']),
  methods: {
    getIconOffset(item) {
      const hasIcon = !(item.icon || '').includes('icon-');
      return hasIcon ? { top: '2px' } : {};
    },
    onBackHome() {
      this.$router.replace({ name: this.$config.app.home });
    },
  },
};
</script>
