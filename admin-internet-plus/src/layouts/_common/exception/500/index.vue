<template>
  <container fill>
    <div class="exception-info">
      <h1>500</h1>
      <p class="desc">抱歉，服务器出错了</p>
      <el-button type="primary" size="medium" @click="onBack()">返回首页</el-button>
    </div>
  </container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'EX-500',
  methods: {
    ...mapActions('tagsView', ['SetView']),
    onBack() {
      this.SetView({ type: 'REMOVE_VIEW', view: this.$route });
      this.$router.replace({ name: this.$config.app.home });
    },
  },
};
</script>

<style lang="scss" scoped>
.mod-container {
  position: relative;
  background-image: url('~@/assets/img/500.svg');
  background-repeat: no-repeat;
  background-position: 25% 40%;
  .exception-info {
    position: absolute;
    top: 30%;
    left: 55%;
    > h1 {
      margin-bottom: 24px;
      color: #434e59;
      font-weight: 600;
      font-size: 72px;
      line-height: 72px;
    }
    > .desc {
      margin-bottom: 16px;
      color: rgba(0,0,0,.45);
      font-size: 20px;
      line-height: 28px;
    }
  }
}
</style>
