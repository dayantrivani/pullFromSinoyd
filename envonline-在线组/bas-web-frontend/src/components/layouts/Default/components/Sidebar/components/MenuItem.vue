<template>
  <!-- 含子节点 -->
  <el-submenu v-if="hasMenu(item)" :key="item.moduleUrl" :index="item.moduleUrl">
    <template slot="title">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </template>
    <menu-item v-for="subItem in item.children" :item="subItem" :key="subItem.moduleUrl" />
  </el-submenu>
  <!-- 无子节点 -->
  <el-menu-item v-else :key="item.id" :index="item.moduleUrl" @click="$router.push({ name: item.moduleUrl })">
    <i :class="item.icon"></i>
    <span :class="item.class">{{ item.label }}</span>
  </el-menu-item>
</template>

<script>

export default {
  name: 'MenuItem',
  props: ['item'],
  methods: {
    // 是否含有子项目
    hasMenu(item) {
      return item.children && item.children.length;
    },
  },
};
</script>
