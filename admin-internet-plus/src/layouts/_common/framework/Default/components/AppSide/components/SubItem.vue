<template functional>
  <!-- 含子节点 -->
  <el-submenu
    v-if="props.data[props.navbar.children] && props.data[props.navbar.children].length"
    :key="props.data[props.navbar.code]"
    :index="props.data[props.navbar.code]"
    :popper-class="props.popperClass"
  >
    <template slot="title">
      <icon :name="props.data[props.navbar.icon]" />
      <span :class="props.data[props.navbar.class]">
        {{ props.data[props.navbar.label] }}
      </span>
    </template>
    <!-- 递归自身 -->
    <sub-item
      v-for="item in props.data[props.navbar.children]"
      :key="item[props.navbar.code]"
      :data="item"
      :navbar="props.navbar"
    />
  </el-submenu>
  <!-- 叶子节点 -->
  <el-menu-item
    v-else
    :key="props.data[props.navbar.code]"
    :index="props.data[props.navbar.code]"
    :title="props.data[props.navbar.label]"
    :class="props.data[props.navbar.class]"
  >
    <icon :name="props.data[props.navbar.icon]" />
    <span slot="title">{{ props.data[props.navbar.label] }}</span>
  </el-menu-item>
</template>
