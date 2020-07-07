<template>
  <div class="not-found">
    <div class="title text-center">
      <div class="img-responsive"></div>
      <h2 class="lime">您访问的页面不见了...</h2>
      <p>即将离开本页，
        <span class="lime">{{ countDown }}</span> 秒后自动返回上一页
      </p>
      <button @click="$router.back()">立即返回</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  data() {
    return {
      countDown: 3,
    };
  },
  watch: {
    // countDown() {
    //   return this.countDown === 0 && this.$router.back();
    // },
  },
  created() {
    const vm = this;
    setInterval(() => vm.countDown > 0 && vm.countDown--, 1000);
  },
};
</script>
