<!-- 布局 / 树目录表格 -->

<template>
  <container>
    <layout-doc>
      <template #doc>
        <div class="box-doc row-md">
          <p>目录区</p>
          <!-- 路由 hash 模式已经将#占用, 页面的锚点功能失效，js 实现替代 -->
          <p><a @click="$tools.goAnchor(0)">锚点1</a></p>
          <p><a @click="$tools.goAnchor('#link2')">锚点2</a></p>
          <p><a @click="$tools.goAnchor('#link3')">锚点3</a></p>
          <p><a @click="$tools.goAnchor('#link4')">锚点4</a></p>
          <p><a @click="$tools.goAnchor('#link5')">锚点5</a></p>
          <p>示例模块</p>
          <p><a @click="$router.replace({ name: 'Notice' })">公告管理</a></p>
        </div>
      </template>
      <div class="box-content row-md">
        <span>内容区</span>
        <p id="link1">锚点1</p>
        <div style="height: 500px"></div>
        <p id="link2">锚点2</p>
        <div style="height: 500px"></div>
        <p id="link3">锚点3</p>
        <div style="height: 500px"></div>
        <p id="link4">锚点4</p>
        <div style="height: 500px"></div>
        <p id="link5">锚点5</p>
      </div>
    </layout-doc>
  </container>
</template>

<script>
import LayoutDoc from '@/layouts/LayoutDoc';

export default {
  name: 'DocContent',
  components: {
    LayoutDoc,
  },
};
</script>

<style lang="scss" scoped>
  .box-doc {
    padding: 15px;
    min-height: 500px;
    border: 1px solid $--color-success;
    background-color: lighten($--color-success, 30%);
  }
  .box-content {
    padding: 15px;
    min-height: 2000px;
    border: 1px solid $--color-primary;
    background-color: lighten($--color-primary, 30%);
  }
</style>
