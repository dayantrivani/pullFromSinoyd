<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      class="z-pointer"
      v-show="$route.name !== $config.app.home"
      @click.native="onBackHome()">
      <icon v-show="app.custom.crumbsIconShow" name="home" /> 工作台
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.id">
      <icon v-show="app.custom.crumbsIconShow && item.icon" :name="item.icon || ''" />
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Breadcrumb',
  inject: ['app'],
  computed: mapState('auth', ['breadcrumbList']),
  methods: {
    onBackHome() {
      this.$router.replace({ name: this.$config.app.home });
    },
  },
};
</script>
