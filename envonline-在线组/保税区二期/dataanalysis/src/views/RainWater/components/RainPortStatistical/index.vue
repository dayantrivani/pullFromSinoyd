<template>
  <!-- 雨水排口统计 -->
  <decor-border>
    <main-case title="雨水排口统计">
      <div class="mod-rainPortStatistical" v-loading="loading">
        <!-- 企业排放量/总排放量 -->
        <section>
          <div class="unit-style">单位：t</div>
          <div class="icon-num">
            <div class="percent">50<span>%</span></div>
            <div class="num"><span>1234567.89</span>&nbsp;/&nbsp;<span>123456789</span></div>
          </div>
          <div class="charts chartsOne" ref="chartsOne"></div>
        </section>

        <!-- 企业排放时长/总排放时长 -->
        <section>
          <div class="unit-style">单位：h</div>
          <div class="icon-num">
            <div class="percent">50<span>%</span></div>
            <div class="num"><span>72</span>&nbsp;/&nbsp;<span>7200</span></div>
          </div>
          <div class="charts chartsTwo" ref="chartsTwo"></div>
        </section>

        <!-- 企业超标次数/总超标次数 -->
        <section>
          <div class="unit-style">单位：次</div>
          <div class="icon-num">
            <div class="percent">50<span>%</span></div>
            <div class="num"><span>72</span>&nbsp;/&nbsp;<span>7200</span></div>
          </div>
          <div class="charts chartsThree" ref="chartsThree"></div>
        </section>
      </div>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'RainPortStatistical',
  data() {
    return {
      loading: false,
      chart: {
        chartsOne: null,
        chartsTwo: null,
        chartsThree: null,
      },
    };
  },
  computed: {
    chartsOne() {
      return {
        color: ['#0088ff', '#11cc56'],
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
          show: true,
          icon: 'circle',
          top: 8,
          right: '20%',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          zlevel: 999,
          textStyle: {
            color: '#b5d8f2',
            fontSize: 14,
          },
          data: [
            { name: '企业排放量' },
            { name: '总排放量' },
          ],
        },
        grid: {
          left: 50,
          right: 30,
          bottom: 40,
          top: '42%',
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
            name: '企业排放量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            zlevel: 2,
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
          {
            name: '总排放量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: {
              color: '#FFB423',
            },
            // data: this.other,
            data: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
          },
        ],
      };
    },
    chartsTwo() {
      return {
        color: ['#0088ff', '#11cc56'],
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
          show: true,
          icon: 'circle',
          top: 8,
          right: '20%',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          zlevel: 999,
          textStyle: {
            color: '#b5d8f2',
            fontSize: 14,
          },
          data: [
            { name: '企业排放时长' },
            { name: '总排放时长' },
          ],
        },
        grid: {
          left: 50,
          right: 30,
          bottom: 40,
          top: '42%',
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
            name: '企业排放时长',
            type: 'bar',
            barWidth: '60%',
            barMaxWidth: 20,
            zlevel: 2,
            itemStyle: {
              barBorderRadius: 8,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#00fd59',
                }, {
                  offset: 1, color: '#09611b',
                }],
                global: false,
              },
            },
            // data: this.other,
            data: [58, 49, 60, 60, 60, 60, 60, 60, 60, 62, 58, 52, 48, 46, 40, 44, 50, 52, 60, 80],
          },
          {
            name: '总排放时长',
            type: 'bar',
            barGap: '-100%',
            barWidth: '60%',
            barMaxWidth: 20,
            itemStyle: {
              barBorderRadius: 8,
              color: '#0e381c',
            },
            // data: this.other,
            data: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
          },
        ],
      };
    },
    chartsThree() {
      return {
        color: ['#0088ff', '#11cc56'],
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
          show: true,
          icon: 'circle',
          top: 8,
          right: '20%',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          zlevel: 999,
          textStyle: {
            color: '#b5d8f2',
            fontSize: 14,
          },
          data: [
            { name: '企业超标次数' },
            { name: '总超标次数' },
          ],
        },
        grid: {
          left: 50,
          right: 30,
          bottom: 40,
          top: '42%',
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
            name: '企业超标次数',
            type: 'scatter',
            smooth: true,
            symbol: 'circle',
            zlevel: 2,
            itemStyle: {
              color: '#FF2E2E',
            },
            // data: this.other,
            data: [58, 49, 60, 60, 60, 60, 60, 60, 60, 62, 58, 52, 48, 46, 40, 44, 50, 52, 60, 80],
          },
          {
            name: '总超标次数',
            type: 'bar',
            barWidth: '60%',
            barMaxWidth: 20,
            itemStyle: {
              barBorderRadius: 8,
              color: '#3E0202',
            },
            // data: this.other,
            data: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
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
