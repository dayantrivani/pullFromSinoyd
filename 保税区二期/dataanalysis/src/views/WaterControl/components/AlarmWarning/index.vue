<template>
  <div class="alarmWarning">
    <el-scrollbar style="height: 100%;">
      <div v-for="i in 5" :key="i" class="alarmInfo">
        <div class="circle" :style="{ backgroundColor: '#f92def' }"></div>
        <div class="name">X企业X排口</div>
        <div class="content">排口阀门关闭报警</div>
        <div class="time">2019-12-25 12:00</div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'alarmWarning',
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.alarmWarning {
  height: calc(100% - 0.1rem);
  padding: 0 0.1rem;
  .alarmInfo {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    line-height: 0.2rem;
  }
  .circle {
    width: 0.08rem;
    height: 0.08rem;
    border: 0 solid transparent;
    border-radius: 0.04rem;
  }
  .name {
    font-weight: 600;
    padding: 0 0.15rem;
  }
  .content {
    flex: 1;
    font-size: 0.12rem;
  }
  .time {
    font-size: 0.12rem;
    font-weight: 200;
    padding-right: 0.05rem;
  }
}
</style>
