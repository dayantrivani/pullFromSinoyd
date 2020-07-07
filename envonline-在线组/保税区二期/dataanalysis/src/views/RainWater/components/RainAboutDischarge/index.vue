<template>
  <!-- 雨水内外排放量 -->
  <decor-border>
    <main-case title="雨水内外排放量">
      <div class="icon-draw">
        <div class="icon-num">
          <div class="icon-left">
            <div class="percent">50<span>%</span></div>
            <div class="name" :class="{ 'icon-active': isIn }" @click="isIn = !isIn">内排</div>
            <div class="num" :title="123456789123456789">123456789123456789</div>
            <div class="unit">t</div>
          </div>
          <div class="icon-right">
            <div class="percent">50<span>%</span></div>
            <div class="name" :class="{ 'icon-active': isOut }" @click="isOut = !isOut">外排</div>
            <div class="num" :title="123456789123456789">123456789123456789</div>
            <div class="unit">t</div>
          </div>
        </div>
        <div v-loading="loading" class="charts" ref="echarts"></div>
      </div>
    </main-case>
  </decor-border>
</template>

<script>
export default {
  name: 'RainAboutDischarge',
  data() {
    return {
      loading: false,
      chart: null,
      isIn: false,        // false 代表该图例选中
      isOut: false,       // false 代表该图例选中
    };
  },
  computed: {
    options() {
      return {
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
          icon: 'circle',
        },
        grid: {
          left: 50,
          right: 20,
          bottom: 40,
          top: '35%',
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
            name: '内排',
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
                  offset: 0, color: '#00d7fe',
                }, {
                  offset: 1, color: '#093b67',
                }],
                global: false,
              },
            },
            // data: this.other,
            data: [58, 49, 60, 60, 60, 60, 60, 60, 60, 62, 58, 52, 48, 46, 40, 44, 50, 52, 60, 80],
          },
          {
            name: '外排',
            type: 'bar',
            barGap: '-100%',
            barWidth: '60%',
            barMaxWidth: 20,
            itemStyle: {
              barBorderRadius: 8,
              color: '#0d7a71',
            },
            // data: this.other,
            data: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
          },
        ],
      };
    },
  },
  watch: {
    isIn(val) {
      if (!this.chart) return;
      if (val) {
        this.chart.dispatchAction({
          type: 'legendUnSelect',
          name: '内排',
        });
      } else {
        this.chart.dispatchAction({
          type: 'legendSelect',
          name: '内排',
        });
      }
    },
    isOut(val) {
      if (!this.chart) return;
      if (val) {
        this.chart.dispatchAction({
          type: 'legendUnSelect',
          name: '外排',
        });
      } else {
        this.chart.dispatchAction({
          type: 'legendSelect',
          name: '外排',
        });
      }
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
