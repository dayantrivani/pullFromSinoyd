<template>
  <!-- 含叶子节点 -->
  <el-submenu v-if="isLeaf" :key="data[props.path]" :index="data[props.path]">
    <template slot="title">
      <i :class="data[props.icon]"></i>
      <span slot="title">{{ data[props.name] }}</span>
    </template>
    <!-- 递归调用自身遍历子节点 -->
    <menu-item v-for="node in data[props.children]" :key="node[props.path]" :data="node" />
  </el-submenu>
  <!-- 叶子节点 -->
  <el-menu-item
    v-else :key="data[props.path]"
    :index="data[props.path]"
    @click="$router.replace({ name: data[props.path] })">
    <i :class="data[props.icon]"></i>
    <span :class="data.class">{{ data[props.name] }}</span>
  </el-menu-item>
</template>

<script>

export default {
  name: 'MenuItem',
  props: {
    // 节点对象
    data: {
      type: Object,
      required: true,
    },
    // 配置项
    props: {
      type: Object,
      default: () => ({
        name: 'label',        // 标签文字
        icon: 'icon',         // 图标类名
        path: 'moduleUrl',    // 跳转模块名称
        children: 'children', // 子节点，数组
      }),
    },
  },
  data() {
    return {
      // 是否为叶子节点
      isLeaf: this.data[this.props.children] && this.data[this.props.children].length,
    };
  },
};
</script>
