<template>
  <div class="board-one" style="color: #fff;">
    <el-row class="board-top">
      <el-col :span="10">
        <calender ref="calender"></calender>
      </el-col>
      <el-col :span="14">
        <alarm ref="alarm" style="width: calc(100% - 0.15rem);margin-left: 0.15rem"></alarm>
      </el-col>
    </el-row>
    <el-row class="board-bottom">
      <el-col :span="14">
        <reaching-standard ref="reachingStandard"></reaching-standard>
      </el-col>
      <el-col :span="10">
        <line-pic ref="linePic"></line-pic>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import alarm from './module/Alarm';
import calender from './module/Calender';
import linePic from './module/LinePic';
import reachingStandard from './module/ReachingStandard';
import { formatDate } from '@/libs/util';


export default {
  name: 'Board',
  data() {
    return {
      now: formatDate(new Date(), 'Y-m-d'),
      countDown: 300, // 倒计时300s
      timer: () => { },
      refreshTime: 300, // 定时器初始化时间
    };
  },
  watch: {
    countDown() {
      return this.countDown === 0 && this.onResetCountDown();
    },
  },
  created() {
    this.init();
    if (this.refreshTime) {
      this.timer = setInterval(() => this.countDown > 0 && this.countDown--, 1000);
    }
  },
  components: {
    alarm,
    calender,
    linePic,
    reachingStandard,
  },
  methods: {
    init() {
      console.log(this.$refs);
      Object.keys(this.$refs).forEach((ele) => {
        this.$refs[ele].getItemList();
      });
    },
    // 重置计时
    onResetCountDown() {
      this.init();
      if (this.refreshTime) {
        this.countDown = this.refreshTime;
        clearInterval(this.timer);
        this.timer = setInterval(() => this.countDown > 0 && this.countDown--, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
