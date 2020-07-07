<template>
  <!-- 进水排水量统计 -->
  <decor-border>
    <main-case v-loading="loading" title="进水排水量统计">
      <div class="draw">
        <img src="@/assets/img/common/water.png" alt="">
        <div class="num-text">
          <div class="number">0.62</div>
          <div class="text">
            <div class="name">水平衡率</div>
            <div class="rule">
              【标准值：0.68&nbsp;&nbsp;&nbsp;&nbsp;正常值<span> >0.68</span>】
            </div>
          </div>
        </div>
      </div>
      <section>
        <div class="icon-text">
          <div class="rate">50<span>%</span></div>
          <div class="name">进水量</div>
          <div class="number">
            <span title="123456789123456789t">123456789123456789</span>t
          </div>
        </div>
        <div class="charts chartsOne" ref="chartsOne"></div>
      </section>
      <section>
        <div class="icon-text">
          <div class="rate">50<span>%</span></div>
          <div class="name">出水量</div>
          <div class="number">
            <span title="123456789t">123456789</span>t
          </div>
        </div>
        <div class="charts chartsOne" ref="chartsTwo"></div>
      </section>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'WaterStatistics',
  data() {
    return {
      loading: false,
      chart: {
        chartsOne: null,
        chartsTwo: null,
      },
    };
  },
  computed: {
    chartsOne() {
      return {
        color: ['#0088ff'],
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          show: false,
        },
        grid: {
          left: 50,
          right: 30,
          bottom: 40,
          top: '30%',
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#F9F9F9',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#B9B9B9',
            },
            // data: this.tstamp,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 21, 22, 23, 24, 25, 26, 27, 28],
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#B9B9B9',
              margin: 15,
            },
          },
        ],
        series: [
          {
            name: '进水量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            markPoint: {
              symbolSize: 30,
              label: {
                fontSize: 10,
                color: 'rgba(255,255,255,1)',
              },
              itemStyle: {
                color: '#0C55F9',
              },
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' },
              ],
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#0C55F9',
                }, {
                  offset: 1, color: 'transparent',
                }],
                global: false,
              },
            },
            // data: this.other,
            data: [58, 49, 60, 60, 60, 60, 60, 60, 60, 62, 58, 52, 48, 46, 40, 44, 50, 52, 60, 70],
          },
        ],
      };
    },
    chartsTwo() {
      return {
        color: ['#00fd59'],
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          show: false,
        },
        grid: {
          left: 50,
          right: 30,
          bottom: 40,
          top: '30%',
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#F9F9F9',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#B9B9B9',
            },
            // data: this.tstamp,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 21, 22, 23, 24, 25, 26, 27, 28],
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#B9B9B9',
              margin: 15,
            },
          },
        ],
        series: [
          {
            name: '出水量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            markPoint: {
              symbolSize: 30,
              label: {
                fontSize: 10,
                color: 'rgba(255,255,255,1)',
              },
              itemStyle: {
                color: '#00fd59',
              },
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' },
              ],
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#00fd59',
                }, {
                  offset: 1, color: 'transparent',
                }],
                global: false,
              },
            },
            // data: this.other,
            data: [58, 49, 60, 60, 60, 60, 60, 60, 60, 62, 58, 52, 48, 46, 40, 44, 50, 52, 60, 70],
          },
        ],
      };
    },
  },
  mounted() {
    this.dealBefore();
  },
  methods: {
    dealBefore() {
      this.$nextTick(() => {
        Object.keys(this.chart).forEach((item) => {
          this.drawEcharts(item);
        });
      });
    },
    drawEcharts(refName) {
      this.chart[refName] = this.$echarts.init(this.$refs[refName]);
      this.chart[refName].clear();
      this.chart[refName].setOption(this[refName]);
      window.addEventListener('resize', () => { this.chart[refName].resize(); });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
