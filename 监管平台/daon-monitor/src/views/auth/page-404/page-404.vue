<template>
  <div class="page404">
    <div class="title">
      <div class="img-responsive"></div>
      <h2 class="lime">您访问的页面不见了...</h2>
      <button @click="$router.replace('/')">返回首页</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-404',
};
</script>
