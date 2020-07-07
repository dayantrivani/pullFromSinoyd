<template>
  <div
    class="menu-setting"
    @mouseover="app.setNavMenu(true)"
    @mouseout.stop="app.setNavMenu(false)">
    <div class="btn-menu fn-clear">
      <i class="el-icon-s-grid fn-left"></i>
      <span class="fn-left">产品与服务</span>
      <i class="el-icon-arrow-right fn-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['app'],
};
</script>

<style lang="scss" scoped>
.menu-setting {
  padding: 5px 0;
  border-bottom: 1px solid #666;
}
.btn-menu {
  $w: 50px;
  $h: 40px;
  width: 100%;
  height: $h;
  line-height: $h;
  white-space: nowrap;
  overflow: hidden;
  &:hover {
    background-color: rgba(#333, .5);
  }
  > i {
    display: inline-block;
    width: $w;
    line-height: $h;
    text-align: center;
    font-size: 16px;
  }
}
</style>
