<template>
  <el-card class="not-develpop"></el-card>
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
