<template>
  <!-- 水平衡异常次数 -->
  <decor-border>
    <main-case title="水平衡异常次数">
      <template v-slot:unit>
        <div class="unit-style">
          <div class="unit-num">120</div>
          <div class="unit-text">总异常次数</div>
        </div>
      </template>
       <div v-loading="loading" class="charts" ref="echarts"></div>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'BalanceAnomaly',
  data() {
    return {
      loading: false,
      chart: null,
    };
  },
  computed: {
    options() {
      return {
        color: ['#ffb423'],
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
          left: 45,
          right: 30,
          bottom: 40,
          top: 20,
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
            name: '水平衡异常次数',
            type: 'bar',
            barWidth: '60%',
            barMaxWidth: 20,
            itemStyle: {
              barBorderRadius: 8,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#FFAE00',
                }, {
                  offset: 1, color: '#D01D1C',
                }],
                global: false,
              },
            },
            label: {
              show: true,
              color: '#ea9e0b',
              position: 'top',
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
