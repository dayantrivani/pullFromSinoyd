<template>
  <!-- 生活污水排放量统计 -->
  <!-- <div class="mod-one-sewageDischarge">
  </div> -->
  <decor-border>
    <main-case title="生活污水排放量统计">
      <template v-slot:unit>
        <div class="unit-style">单位：mg/L</div>
      </template>
      <div v-loading="loading" class="charts" ref="echarts"></div>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'SewageDischarge',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    options() {
      return {
        color: ['#0066ff'],
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
          left: 40,
          top: 0,
          itemGap: 10,
          data: [
            { name: '超标' },
            { name: '其他' },
          ],
        },
        grid: {
          left: 50,
          right: 20,
          bottom: 40,
          top: '15%',
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
              formatter(value) {
                return `${value.slice(-2)}`;
              },
            },
            // data: this.tstamp,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8],
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
            name: '因子排放量',
            type: 'line',
            stack: '总量',
            smooth: true,
            symbol: 'none',
            // label: {
            //   show: false,
            //   position: 'top',
            //   textStyle: {
            //     color: 'white',
            //   },
            // },
            markPoint: {
              symbolSize: 30,
              label: {
                fontSize: 10,
                color: 'rgba(255,255,255,1)',
              },
              itemStyle: {
                color: '#0066ff',
                // opacity: 0.8,
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
                  offset: 0, color: '#0066ff',
                }, {
                  offset: 1, color: 'transparent',
                }],
                global: false,
              },
            },
            // data: this.other,
            data: [58, 49, 60, 60, 60, 60, 60, 60, 60, 62, 58, 52, 48, 46, 40, 44, 50, 52, 60, 80],
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
        this.drawEcharts();
      });
    },
    drawEcharts() {
      this.chart = this.$echarts.init(this.$refs.echarts);
      this.chart.clear();
      this.chart.setOption(this.options);
      window.addEventListener('resize', () => { this.chart.resize(); });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
