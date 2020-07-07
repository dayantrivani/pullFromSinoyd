<template>
  <div class="PSInfo">
    <div class="icon-title">
      <i class="icon-factor"></i>
      <span class="mar-l-sm">因子浓度阈值</span>
      <span style="color: #fff;float: right">
        总量控制阀：
        <el-switch
          v-model="value1"
          inactive-value="true"
          active-value="false"
          inactive-color="#13ce66"
          active-color="#ccc">
        </el-switch>
      </span>
    </div>
    <el-row style="text-align: center;">
      <el-col :span="6" v-for="(item, index) in itemList" :key="index">
        <tt class="label">{{item.label}}：</tt>
        <span class="value">{{item.value}}</span>
        <span class="unit">{{item.unit}}</span>
      </el-col>
    </el-row>
    <div class="icon-title">
      <i class="icon-timming"></i>
      <span class="mar-l-sm">定时定量排放</span>
    </div>
    <div class="progress-box">
      <echarts-pie-progress value="48" title="48%" subtitle="占比"></echarts-pie-progress>
      <echarts-pie-progress value="48" title="48%" subtitle="占比"></echarts-pie-progress>
      <echarts-pie-progress value="48" title="48%" subtitle="占比"></echarts-pie-progress>
      <echarts-pie-progress value="48" title="48%" subtitle="占比"></echarts-pie-progress>
      <echarts-pie-progress value="48" title="48%" subtitle="占比"></echarts-pie-progress>
    </div>
  </div>
</template>

<script>
import EchartsPieProgress from './components/echarts-pie-progress';

export default {
  name: 'PSInfo',
  components: {
    EchartsPieProgress,
  },
  data() {
    return {
      value1: true,
      itemList: [
        {
          label: 'pH',
          value: '7',
          unit: '无量纲',
        },
        {
          label: 'COD',
          value: '15',
          unit: 'mg/L',
        },
        {
          label: 'NH',
          value: '15',
          unit: 'mg/L',
        },
        {
          label: 'TP',
          value: '0.5',
          unit: 'mg/L',
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.PSInfo {
  height: 100%;
  padding-left: 0.1rem;
  .icon-title {
    padding-bottom: 0.1rem;
    color: #009ffe;
    font-size: 0.16rem;
    font-weight: bold;
    >i {
      display: inline-block;
      width: 0.26rem;
      height: 0.26rem;
      background-size: cover;
      vertical-align: middle;
    }
    .icon-factor {
      background: url('../../../../assets/img/WaterControl/icon-factor.png') no-repeat;
    }
    .icon-timming {
      background: url('../../../../assets/img/WaterControl/icon-timming.png') no-repeat;
    }
  }
  .progress-box {
    width: 100%;
    height: calc(100% - 1.2rem);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .label {
    display: inline-block;
    width: 0.45rem;
    text-align: right;
  }
  .value {
    font-size: 0.18rem;
    color: #00ff06;
  }
}
</style>
