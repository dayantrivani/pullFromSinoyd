<template>
<!-- 中间   污水排放量 -->
  <el-row class="EmissionStatistics">
    <el-col :span="10">
      <echarts-pie-progress value="48" title="48%" subtitle="占比"></echarts-pie-progress>
    </el-col>
    <el-col :span="14">
      <div class="top-20">
        <div class="digifacewide-box">
          <div class="digifacewide">
            <p v-for="(item, index) in values.toString().padStart(10, ' ')" :key="index">{{item}}</p>
          </div>
          <div class="title" @click="onClickCircle(true)">
            <p class="circle" :class="{ active: isEnt}"></p>
            <p class="pad-l-sm">企业污水排放量</p>
            <p class="unit">t</p>
          </div>
        </div>
        <div class="digifacewide-box">
          <div class="digifacewide">
            <p v-for="(item, index) in '123456789'.toString().padStart(10, ' ')" :key="index">{{item}}</p>
          </div>
          <div class="title" @click="onClickCircle(false)">
            <p class="circle" :class="{ active: !isEnt}"></p>
            <p class="pad-l-sm">总污水排放量</p>
            <p class="unit">t</p>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import EchartsPieProgress from './components/echarts-pie-progress';

export default {
  name: 'EmissionStatistics',
  components: {
    EchartsPieProgress,
  },
  data() {
    return {
      isEnt: true,
      values: 59259258,
    };
  },
  methods: {
    onClickCircle(isEnt) {
      this.isEnt = isEnt;
    },
  },
};
</script>

<style lang="scss" scoped>
.EmissionStatistics {
  height: 1.8rem;
  user-select: none;
  >div {
    position: relative;
    .top-20 {
      position: absolute;
      top: 20%;
      width: 100%;
    }
  }
  .digifacewide-box {
    padding-left: 0.2rem;
    padding-bottom: 0.05rem;
    >.digifacewide {
      padding-left: 1px;
      >p {
        text-align: center;
        display: inline-block;
        width: calc(10% - 1px);
        margin-left: 1px;
        font-size: 0.3rem;
        height: 0.3rem;
        line-height: 0.3rem;
        vertical-align: middle;
        background-color: #152653;
        color: #01ccf9;
      }
    }
    >.title {
      font-size: 0.14rem;
      height: 0.3rem;
      line-height: 0.3rem;
      >p {
        display: inline-block;
        &.circle {
          width: 0.15rem;
          height: 0.15rem;
          border: 1px solid transparent;
          border-radius: 0.8rem;
          background-image: radial-gradient(#15305d, #0d5995);
          vertical-align: middle;
          cursor: pointer;
          &.active {
            background-image: radial-gradient(#01ccf9, #129ff5);
            box-shadow: 0px 0px 10px #12a1f7;
          }
        }
        &.unit {
          float: right;
          padding: 0 0.1rem;
          &::after {
            content: '';
            clear: both;
          }
        }
      }
    }
  }
}
</style>
