<!-- 标签栏导航 -->
<template>
  <span class="message">
    <el-badge :value="3" class="item">
      <div class="btn btn-message z-pointer">
        <i class="far fa-envelope am-fade-hover"></i>
      </div>
    </el-badge>
    <el-badge :value="2" class="item" type="warning">
      <div class="btn btn-inform z-pointer">
        <i class="far fa-bell am-shake-hover"></i>
      </div>
    </el-badge>
  </span>
</template>

<script>

export default {
  data() {
    return {
    };
  },
};
</script>
