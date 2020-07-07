<template>
  <!-- 雨水排放量 -->
  <decor-border>
    <main-case title="雨水排放量">
      <template v-slot:unit>
        <div class="unit-style">单位：t</div>
      </template>
      <div v-loading="loading" class="charts" ref="echarts"></div>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'RainDischarge',
  data() {
    return {
      loading: false,
      chart: null,
    };
  },
  computed: {
    options() {
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
          top: 0,
          left: '5%',
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
          right: 20,
          bottom: 40,
          top: '22%',
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
              // formatter(value) {
              //   return `${value.slice(-2)}`;
              // },
            },
            // data: this.tstamp,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 21, 22, 23, 24, 25, 26, 27, 28],
          },
        ],
        yAxis: [
          {
            type: 'value',
            // min: 0,
            // max: 140,
            // interval: 10,
            splitLine: {
              // show: true,
              show: false,
              // lineStyle: {
              //   color: '#F9F9F9',
              // },
            },
            axisLine: {
              show: false,
              // lineStyle: {
              //   color: '#F9F9F9',
              // },
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
