<template>
  <!-- 环境风险预警看板2 -->
  <div class="warning-module" style="color: #fff;">
    <el-row class="fill-h">
      <el-col :span="18" class="content-left">
        <el-row class="left-top">
          <el-col :span="10">
            <emission-statistics ref="EmissionStatistics"></emission-statistics>
          </el-col>
          <el-col :span="14">
            <alarming-trend ref="AlarmingTrend" style="width: calc(100% - 0.15rem);margin-left: 0.15rem"></alarming-trend>
          </el-col>
        </el-row>
        <div class="left-bottom">
          <board-box title="废气因子排放量" style="height:50%;">
            <span class="fn-right fn-clear text-primary" slot="sub-title">
              <sub class="text-info">数据截止至{{now}}</sub>
            </span>
            <factor-emissions ref="FactorEmissionsAir" type="air"></factor-emissions>
          </board-box>
          <board-box title="废水因子排放量" style="height:50%;">
            <factor-emissions ref="FactorEmissionsWater" type="water"></factor-emissions>
          </board-box>
        </div>
      </el-col>
      <el-col :span="6" class="content-right">
        <real-time-alarm ref="RealTimeAlarm"></real-time-alarm>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EmissionStatistics from './module/EmissionStatistics';
import AlarmingTrend from './module/AlarmingTrend';
import FactorEmissions from './module/FactorEmissions';
import RealTimeAlarm from './module/RealTimeAlarm';
import boardBox from './components/boardBox';
import { formatDate } from '@/libs/util';

export default {
  name: 'WarningModule',
  components: {
    EmissionStatistics,
    AlarmingTrend,
    FactorEmissions,
    RealTimeAlarm,
    boardBox,
  },
  data() {
    return {
      now: formatDate(new Date(), 'Y-m-d'),
      countDown: 300, // 倒计时300s
      timer: () => {},
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
  methods: {
    init() {
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
