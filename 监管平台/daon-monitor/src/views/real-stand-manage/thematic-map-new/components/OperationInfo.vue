<template>
  <el-container id="outer-wrapper3">
    <el-header>
      <h5>运维概况</h5>
    </el-header>
    <el-main>
      <el-container>
        <el-header>
          <span>
            <h5>运维情况统计</h5>
            <i class="el-icon-right"></i>
          </span>
          <h6>Operation and maintenace statistics</h6>
        </el-header>
        <el-main class="opt-summar">
          <el-carousel :interval="5000" arrow="always">
            <el-carousel-item v-for="page in Math.ceil(rankArr1.length/5)" :key="page">
              <div
                class="rank-item"
                v-for="(item,index) in rankArr1.slice((page-1)*5, page*5)"
                :key="index"
              >
                <div class="rank-right">
                  <div class="opt-name">{{item.name}}</div>
                  <div class="opt-task-bar">
                    <span class="bar-color-1" :style="{width: item.cNum/staticRefer*100 + '%'}"></span>
                    <span class="bar-color-2" :style="{width: item.sNum/staticRefer*100 + '%'}"></span>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-main>
      </el-container>
      <div class="opt-summar-title">
        <span>运维企业</span>
        <span>{{rankArr1.length}}</span>
      </div>
      <el-container>
        <el-header id="opt-task-header">
          <span>
            <h5>运维任务统计</h5>
            <i class="el-icon-right"></i>
          </span>
          <h6>Trade Union ststistics of market value</h6>
        </el-header>
        <el-main style="overflow: hidden; height: 90%;width: 100%">
          <ve-histogram
            width= "100%"
            height= "100%"
            ref = "echart"
            :data="chartData"
            :colors="chartColors"
            :legend-visible="false"
            :extend="chartExtend"
            :after-config="afterConfig"
          ></ve-histogram>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import {
  getOperaConditions,
  getOperaTasks,
} from '@/api/modules/thematic-map.js';

export default {
  name: 'OperationInfo',
  created() {
    this.chartColors = ['#00A3F4'];
    this.chartSettings = {
      axisVisible: false,
    };
    this.chartExtend = {
      'yAxis.0.show': false,
      grid: {
        show: false,
        top: 0,
        left: '-10%',
        bottom: 0,
        right: 0,
      },
    };
  },
  data() {
    this.chartExtend = {};
    return {
      staticRefer: 100,
      rankArr1: [],
      chartData: {
        columns: ['name', 'num'],
        rows: [],
      },
    };
  },
  methods: {
    afterConfig(options) {
      console.log(options);
      options.xAxis[0].axisLabel = {
        textStyle: {
          color: '#fff',
        },
      };
      options.xAxis[0].axisLabel.formatter = (_ => _.split('').slice(0, 5).join('\n'));
      options.series[0] = {
        type: 'pictorialBar',
        symbol: 'roundRect',
        data: options.series[0].data.map(item => ({
          value: item,
          symbolRepeat: true,
          symbolSize: [20, 5],
        })),
      };
      return options;
    },
    resizeChart() {
      this.$nextTick(() => {
        this.$refs.echart.resize();
      });
    },
  },
  mounted() {
    // 运维情况统计
    getOperaConditions().then((res) => {
      if (res.status === 200 && res.data && res.data.code === 200) {
        this.staticRefer = 100;
        this.rankArr1 = res.data.data.corpList.map((_) => {
          const numTotal = _.companyNum + _.stationNum;
          if (this.staticRefer < numTotal) {
            this.staticRefer = Math.ceil(numTotal / 50) * 50;
          }
          return { cNum: _.companyNum, sNum: _.stationNum, name: _.corpName };
        });
      } else {
        this.$message.warning(res.data.msg);
      }
    });
    // 运维任务统计
    getOperaTasks().then((res) => {
      if (res.status === 200 && res.data && res.data.code === 200) {
        console.log(res.data.data);
        this.chartData.rows = res.data.data.map(_ => ({ name: _.corpName, num: _.total }));
      } else {
        this.$message.warning(res.data.msg);
      }
    });
  },
};
</script>

<style lang="scss">
$blue: rgba(106, 186, 238, 1);
$gray: rgba(152, 159, 181, 1);
#outer-wrapper3 {
  padding: 0 0.3rem;
  height: 100%;
  > header {
    margin-top: -2.5%;
    margin-left: 10%;
    height: 1.5rem !important;
    > h5 {
      color: $blue;
      font-size: 0.83rem;
      font-weight: bold;
    }
  }
  >main {
    margin-top: 0;
    padding: 0 5%;
    color: white;
    height: 90%;
    .el-container:first-child {
      overflow: hidden;
      height: 55%;
    }
    .el-container:last-child {
      overflow: hidden;
      height: 35%;
    }
    header {
      padding: 0;
      h5 {
        display: inline;
        margin-right: 0.2rem;
        font-size: 0.75rem;
        color: white;
      }
      i {
        font-size: 0.75rem;
      }
      > h6 {
        font-size: 0.5rem;
        color: $gray;
        margin-top: 0.2rem;
      }
    }
    #opt-task-header {
      height: auto !important;
      margin-bottom: .3rem;
    }
    .opt-summar-title {
      font-size: 0.6rem;
      margin: -0.2rem auto 0.5rem;
      span:last-child {
        margin-left: 1rem;
      }
    }
    .opt-summar {
      margin-top: 0;
      padding-left: 0;
      padding-right: 0;
      color: white;
      height: 100%;
      width: 100%;
      .el-carousel {
        width: 100%;
        height: 100%;
        padding: 0 0.8rem;
        .el-carousel__indicators--horizontal {
          display: none;
          height: 100%;
        }
        .el-carousel__container {
          width: 100%;
          height: 100%;
          .el-carousel__arrow--left {
            left: -1.2rem;
          }
          .el-carousel__arrow--right {
            right: -1.2rem;
          }
          .rank-item {
            width: 100%;
            height: 16%;
            margin-bottom: 0.3rem;
            position: relative;
            .rank-right {
              width: 100%;
              height: 100%;
              .opt-name {
                font-size: 0.55rem;
                margin-bottom: 0.2rem;
              }
              .opt-task-bar {
                height: 0.5rem;
                width: 100%;
                height: 35%;
                background: #23272f;
                box-sizing: content-box;
                > .bar-color-1 {
                  background: #00a3f4;
                  display: inline-block;
                  height: 100%;
                  vertical-align: top;
                }
                > .bar-color-2 {
                  background: #00b9fb;
                  display: inline-block;
                  height: 100%;
                  vertical-align: top;
                }
              }
            }
          }
        }
      }
    }
    main:last-child {
      padding: 0;
    }
  }
}
</style>
