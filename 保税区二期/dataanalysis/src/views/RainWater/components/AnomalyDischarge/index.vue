<template>
  <!-- 排放异常次数 -->
  <decor-border>
    <main-case title="排放异常次数">
      <div v-loading="loading" class="charts" ref="echarts"></div>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'AnomalyDischarge',
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
          // trigger: 'cross',
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
          top: 10,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 30,
          zlevel: 999,
          textStyle: {
            color: '#b5d8f2',
            fontSize: 14,
          },
          data: [
            { name: '企业排放异常次数' },
            { name: '总排放异常次数' },
          ],
        },
        grid: {
          left: 50,
          right: 20,
          bottom: 40,
          top: '20%',
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
            name: '企业排放异常次数',
            type: 'scatter',
            smooth: true,
            symbol: 'circle',
            zlevel: 2,
            itemStyle: {
              color: '#ffb423',
            },
            // data: this.other,
            data: [58, 49, 60, 60, 60, 60, 60, 60, 60, 62, 58, 52, 48, 46, 40, 44, 50, 52, 60, 80],
          },
          {
            name: '总排放异常次数',
            type: 'bar',
            barWidth: '60%',
            barMaxWidth: 20,
            itemStyle: {
              barBorderRadius: 8,
              color: '#412904',
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
