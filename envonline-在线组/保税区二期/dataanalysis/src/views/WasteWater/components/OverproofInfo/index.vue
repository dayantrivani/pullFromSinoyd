<template>
  <div class="OverproofInfo">
    <box-border>
      <el-row>
        <el-col :span="8" class="icon-overproof">
          <img src="../../../../assets/img/WasteWater/icon-overproof.png" alt="图片加载失败">
          <span class="title">最新超标信息</span>
        </el-col>
        <el-col :span="16">
          <el-row class="overproof-info" style="height: 100%">
            <el-col :span="16" class="content"><span class="mar-r-xs"></span>这里放置最新的超标信息</el-col>
            <el-col :span="8" class="time" title="2019/12/19 09:08">2019/12/19 09:08</el-col>
          </el-row>
          <el-row class="overproof-info" style="height: 100%">
            <el-col :span="16" class="content"><span class="mar-r-xs"></span>这里放置最新的超标信息</el-col>
            <el-col :span="8" class="time" title="2019/12/19 09:08">2019/12/19 09:08</el-col>
          </el-row>
        </el-col>
      </el-row>
    </box-border>
    <box-border class="overproof-count">
      <el-row class="top">
        <el-col :span="16"><p class="title">企业超标次数</p></el-col>
        <el-col :span="8" class="control">
          <p :class="{ active: dateType }" @click="onClickDate(true)">本月</p>
          <p :class="{ active: !dateType }" @click="onClickDate(false)">本年</p>
        </el-col>
      </el-row>
      <div ref="OverproofInfo" class="main"></div>
    </box-border>
  </div>
</template>

<script>
import BoxBorder from '../box-border';

export default {
  name: 'OverproofInfo',
  components: {
    BoxBorder,
  },
  data() {
    const echarts = this.$echarts;
    return {
      dateType: true,
      options: {
        xAxis: {
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          axisLabel: {
            textStyle: {
              color: '#ccd',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          z: 10,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#ccd',
            },
          },
        },
        dataZoom: [{
          type: 'inside',
          throttle: 50,
        }],
        series: [
          {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              normal: {
                color: '#fab024',
              },
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' },
              ],
            },
            stack: 'a',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#fab024',
                }, {
                  offset: 1,
                  color: 'transparent',
                }]),
              },
            },
            data: [10, 21, 22, 24, 19, 18, 16, 12, 16, 19, 22, 26, 24],
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawEchart();
    });
  },
  methods: {
    onClickDate(dateType) {
      this.dateType = dateType;
    },
    drawEchart() {
      const myChart = this.$echarts.init(this.$refs.OverproofInfo);
      myChart.clear();
      myChart.setOption(this.options);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.OverproofInfo {
  height: 0.7rem;
  .icon-overproof {
    height: 0.7rem;
    line-height: 0.7rem;
    .title {
      color: #16adee;
      width: calc(100% - 0.45rem);
      text-align: center;
    }
    >img {
      width: 0.45rem;
      vertical-align: middle;
    }
    >span {
      display: inline-block;
    }
  }
  .overproof-info {
    padding-top: 0.1rem;
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      >span {
        display: inline-block;
        width: 0.04rem;
        height: 0.04rem;
        border: 1px solid transparent;
        border-radius: 0.02rem;
        background-color: #129ff7;
        vertical-align: middle;
      }
    }
    .time {
      text-align: right;
      // font-size: 0.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .overproof-count {
    margin-top: 0.2rem;
    height: 3.8rem;
    .top {
      padding-top: 0.15rem;
      height: 0.4rem;
      box-sizing: border-box;
      .title{
        font-size: 0.18rem;
        font-weight: 500;
        color: #16adee;
        margin-left: 0.2rem;
      }
      .control {
        text-align: right;
        padding-right: 0.1rem;
        >p {
          display: inline-block;
          width: 0.6rem;
          height: 0.2rem;
          line-height: 0.2rem;
          margin-left: 0.1rem;
          border: 0 solid transparent;
          border-radius: 0.1rem;
          color: #fff;
          background-color: #129ff7;
          font-size: 0.1rem;
          text-align: center;
          box-shadow: 0 0.01rem 0.05rem #129ff7;
          cursor: pointer;
          &.active {
            background-color: #ffb423;
            box-shadow: 0 0.01rem 0.05rem #ffb423;
          }
        }
      }
    }
    .main {
      width: 100%;
      height: calc(100% - 0.5rem);
      margin-top: 0.1rem;
    }
  }
}
</style>
