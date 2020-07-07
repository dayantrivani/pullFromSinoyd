<template>
  <div class="SewageInfo">
    <div class="SewageEmissions">
      <div class="displacement">
        <div>
          <p style="width: 1rem;text-align: center;">进口排水量</p>
          <p class="progress"><span class="in" :style="{ width: '90%' }"></span><tt>123456789t</tt></p>
        </div>
        <div>
          <p style="width: 1rem;text-align: center;">出口排水量</p>
          <p class="progress"><span class="out" :style="{ width: '50%' }"></span><tt>12345678t</tt></p>
        </div>
      </div>
      <div ref="SewageEmissions" class="echarts1"></div>
    </div>
    <div class="title">污水厂排放时长</div>
    <div class="SewageDischarge">
      <el-row class="duration">
        <el-col :span="12">
          <span class="progress">50%</span>
          <div class="content">
            <div class="mar-r-xs">
              <span class="radio"></span>
            </div>
            <div>
              <p>进口排水</p>
              <p>时长</p>
            </div>
            <div class="mar-r-xs number">
              <span>720</span>
            </div>
            <div class="unit">小时</div>
          </div>
        </el-col>
        <el-col :span="12">
          <span class="progress">50%</span>
          <div class="content">
            <div class="mar-r-xs">
              <span class="radio"></span>
            </div>
            <div>
              <p>进口排水</p>
              <p>时长</p>
            </div>
            <div class="mar-r-xs number">
              <span>720</span>
            </div>
            <div class="unit">小时</div>
          </div>
        </el-col>
      </el-row>
      <div ref="SewageDischarge" class="echarts2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SewageInfo',
  data() {
    const echarts = this.$echarts;
    return {
      yAxisMax: 26, // 柱状图背景最大值
      options: {
        emissionsOpt: {
          grid: {
            width: '90%',
            height: '55%',
          },
          title: {
            subtext: '单位：t',
            right: 0,
          },
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
                  color: '#16c850',
                },
              },
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' },
                ],
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#16c850',
                  }, {
                    offset: 1,
                    color: 'transparent',
                  }]),
                },
              },
              data: [10, 21, 22, 24, 19, 18, 16, 12, 16, 19, 22, 26, 24],
            }, {
              name: '模拟数据1',
              type: 'line',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                normal: {
                  color: '#0088fd',
                },
              },
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' },
                ],
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#0088fd',
                  }, {
                    offset: 1,
                    color: 'transparent',
                  }]),
                },
              },
              data: [20, 21, 22, 24, 26, 24, 22, 21, 18, 25, 25, 22, 24],
            },
          ],
        },
        dischargeOpt: {
          grid: {
            top: '15%',
            width: '85%',
            height: '55%',
          },
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
            max: (value) => {
              this.yAxisMax = value.max;
              return value.max;
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
          dataZoom: [
            {
              type: 'inside',
            },
          ],
          series: [
            { // For shadow
              type: 'bar',
              itemStyle: {
                normal: {
                  color: '#0e784f',
                  barBorderRadius: [50],
                },
              },
              barGap: '-100%',
              barCategoryGap: '40%',
              data: [],
              animation: false,
            },
            {
              type: 'bar',
              itemStyle: {
                normal: {
                  barBorderRadius: [50],
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#00d6fd' },
                      { offset: 1, color: '#093662' },
                    ]
                  ),
                },
              },
              data: [10, 21, 22, 24, 19, 18, 16, 12, 16, 19, 22, 26, 24],
              z: 3,
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawEmissionsEchart();
      this.drawDischargeEchart();
    });
  },
  methods: {
    drawEmissionsEchart() { // 折线图
      const myChart = this.$echarts.init(this.$refs.SewageEmissions);
      myChart.clear();
      myChart.setOption(this.options.emissionsOpt);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    drawDischargeEchart() { // 柱状图
      const myChart = this.$echarts.init(this.$refs.SewageDischarge);
      myChart.clear();
      this.options.dischargeOpt.series[0].data = this.options.dischargeOpt.series[1].data.map(() => this.yAxisMax);
      myChart.setOption(this.options.dischargeOpt);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.SewageInfo {
  height: 100%;
  user-select: none;
  .SewageEmissions,.SewageDischarge {
    height: calc(50% - 0.25rem);
    .echarts1 {
      height: calc(100% - 0.4rem);
    }
    .echarts2 {
      height: calc(100% - 0.6rem);
    }
  }
  .title {
    line-height: 40px;
    font-size: 0.16rem;
    color: #16adee;
    padding-left: 0.15rem;
  }
  .SewageEmissions {
    .displacement {
      height: 0.4rem;
      >div {
        line-height: 0.2rem;
        >p {
          display: inline-block;
          height: 0.2rem;
          vertical-align: middle;
          &.progress {
            width: calc(100% - 1rem);
            position: relative;
            >t {
              position: absolute;
              z-index: 9;
            }
            >span {
              display: inline-block;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              height: 0.18rem;
              box-sizing: border-box;
              border: 0 solid transparent;
              border-radius: 0.125rem;
              &.in {
                background-image: linear-gradient(to right, transparent , #129ff4);
              }
              &.out {
                background-image: linear-gradient(to right, transparent , #11d05d);
              }
            }
          }
        }
      }
    }
  }
  .SewageDischarge {
    margin-top: 0.1rem;
    white-space: nowrap;
    overflow: hidden;
    .duration {
      height: 0.6rem;
      >div {
        background: url('../../../../assets/img/WaterControl/progress-bg.png') no-repeat;
        background-size: cover;
      }
      .progress {
        display: inline-block;
        width: 0.55rem;
        line-height: 0.6rem;
        text-align: center;
      }
      .content {
        display: inline-flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 0.55rem);
        padding: 0 0.1rem;
        >div {
          >p {
            font-size: 0.12rem;
            color: #0280d0;
          }
        }
        .radio {
          display: inline-block;
          width: 0.1rem;
          height: 0.1rem;
          border: 0 solid transparent;
          border-radius: 0.05rem;
          background-color: #0d7a71;
          &.active {
            background-color: #00d6fd;
          }
        }
        .number {
          text-align: right;
          flex: 1;
          font-size: 0.24rem;
          color: #01b9e3;
        }
        .unit {
          color: #01b9e3;
        }
      }
    }
  }
}
</style>
