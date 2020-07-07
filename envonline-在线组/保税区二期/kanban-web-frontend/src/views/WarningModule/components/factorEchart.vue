<template>
  <div class="factor-echart">
    <div ref="echart" style="height: 100%" :class="{ 'empty-box': isEmpty }"></div>
  </div>
</template>

<script>
export default {
  name: 'factorEchart',
  props: {
    factorData: {
      type: Object,
    },
  },
  watch: {
    factorData: {
      handler(val) {
        this.option.title.text = val.chemicalFormula;
        this.option.series[0].data = [val.cumulativeCou];
        this.option.series[1].data = [val.dayCou];
        this.$nextTick(() => {
          this.drawEchart();
        });
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      isEmpty: false, // 标记echarts是否有数据渲染
      option: {
        color: ['#37e4cb', '#ffd619'],
        title: {
          text: 'SO2',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            color: '#fff',
          },
        },
        grid: {
          top: 20,
          bottom: 20,
          right: '70%',
        },
        legend: {
          right: 20,
          top: 'center',
          orient: 'vertical',
          textStyle: {
            color: '#fff',
            rich: {
              subTitle: {
                fontWeight: 600,
                fontSize: 18,
              },
            },
          },
          formatter: (params) => {
            const value = this.option.series.filter(n => n.name === params)[0].data[0];
            return `${params}\n{subTitle|${value}}`;
          },
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: { show: false },
            axisTick: { show: false },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: { show: false },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)',
              },
            },
          },
        ],
        series: [
          {
            name: '累计排放量',
            type: 'bar',
            barWidth: '40%',
            data: [20],
          },
          {
            name: '今日排放量',
            type: 'bar',
            barWidth: '40%',
            data: [10],
          },
        ],
      },
    };
  },
  methods: {
    drawEchart() {
      const myChart = this.$echarts.init(this.$refs.echart);
      myChart.clear();
      myChart.setOption(this.option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.factor-echart {
  position: relative;
  height: 100%;
  margin-right: 0.15rem;
  &.active {
    background-color: #90939922;
  }
  ::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9;
    cursor: pointer;
  }
}
</style>
