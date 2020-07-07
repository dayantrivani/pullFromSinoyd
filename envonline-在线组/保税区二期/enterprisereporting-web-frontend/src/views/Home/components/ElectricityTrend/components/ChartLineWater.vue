<template>
  <div class="water-chart" ref="water"></div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        dateList: [],
        dataList: [],
        totalQty: 0,
      }),
    },
  },
  computed: {
    options() {
      return {
        grid: {
          left: 40,
          bottom: 40,
          top: 40,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,.9)',
          axisPointer: {
            type: 'none',
          },
          textStyle: {
            color: '#fcff00',
          },
          formatter(params) {
            if (!params[0].data) { return ''; }
            const tooltip = `<div style="position:relative;padding: 5px 10px;">
              <div
                style="
                  position:absolute;
                  left:0;
                  top:0;
                  width:8px;
                  height:8px;
                  border-left:2px solid #fcff00;
                  border-top:2px solid #fcff00";
              ></div>
              <div
                style="
                  position:absolute;
                  right:0;
                  top:0;
                  width:8px;
                  height:8px;
                  border-right:2px solid #fcff00;
                  border-top:2px solid #fcff00";
              ></div>
              <div
                style="
                  position:absolute;
                  left:0;
                  bottom:0;
                  width:8px;
                  height:8px;
                  border-left:2px solid #fcff00;
                  border-bottom:2px solid #fcff00";
              ></div>
              <div
                style="
                  position:absolute;
                  right:0;
                  bottom:0;
                  width:8px;
                  height:8px;
                  border-right:2px solid #fcff00;
                  border-bottom:2px solid #fcff00";
              ></div>
              ${params[0].data}
            </div>`;
            return tooltip;
          },
          extraCssText: 'padding: 0',
        },
        title: {
          text: `当前用水总数\t\t\t${this.data.totalQty}（${this.data.unitNum ? '万立方米' : '立方米'}）`,
          padding: [5, 0],
          textStyle: {
            color: '#2ad1ff',
            fontSize: '14',
          },
        },
        xAxis: {
          axisLabel: {
            interval: 0,  // 强制显示所有 label
          },
          axisTick: { // 坐标轴刻度
            show: false,
          },
          type: 'category',
          data: this.data.dateList,
        },
        yAxis: {},
        series: [{
          // eslint-disable-next-line
          // showSymbol: this.data.dateList.length !== 1 ? false : true,
          lineStyle: {
            width: 3,
            color: '#f8d502',  // 折线的颜色
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#f8d502',
            // color: '#f00',   // 颜色设置无效
          },
          data: this.data.dataList,
          type: 'line',
          smooth: true,
        }],
      };
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.chart = this.$echarts.init(this.$refs.water);
        this.chart.clear();
        this.chart.setOption(this.options);
        window.addEventListener('resize', () => { this.chart.resize(); });
      });
    },
  },
};
</script>

<style scoped>
</style>
