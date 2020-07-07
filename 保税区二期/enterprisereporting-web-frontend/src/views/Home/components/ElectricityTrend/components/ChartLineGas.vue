<template>
  <div class="gas-chart" ref="gas"></div>
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
          bottom: 50,
          top: 40,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,.9)',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#23e680',
            },
          },
          textStyle: {
            color: '#23e680',
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
                  border-left:2px solid #23e680;
                  border-top:2px solid #23e680";
              ></div>
              <div
                style="
                  position:absolute;
                  right:0;
                  top:0;
                  width:8px;
                  height:8px;
                  border-right:2px solid #23e680;
                  border-top:2px solid #23e680";
              ></div>
              <div
                style="
                  position:absolute;
                  left:0;
                  bottom:0;
                  width:8px;
                  height:8px;
                  border-left:2px solid #23e680;
                  border-bottom:2px solid #23e680";
              ></div>
              <div
                style="
                  position:absolute;
                  right:0;
                  bottom:0;
                  width:8px;
                  height:8px;
                  border-right:2px solid #23e680;
                  border-bottom:2px solid #23e680";
              ></div>
              ${params[0].data}
            </div>`;
            return tooltip;
          },
          extraCssText: 'padding: 0',
        },
        title: {
          text: `当前用天然气总数\t\t\t${this.data.totalQty}（${this.data.unitNum ? '万吨' : '吨'}）`,
          padding: [5, 0],
          textStyle: {
            color: '#2ad1ff',
            fontSize: '14',
          },
        },
        xAxis: {
          type: 'category',
          data: this.data.dateList,
          splitLine: {  // x轴分割线
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#003452',
            },
          },
          axisLabel: {
            interval: 0,  // 强制显示所有 label
          },
          axisTick: { // 坐标轴刻度
            show: false,
          },
        },
        yAxis: {},
        series: [{
          itemStyle: {
            color: '#23e680',
            shadowColor: 'rgba(35, 230, 128, 1)',
            shadowBlur: 10,
          },
          symbolSize: 13,
          data: this.data.dataList,
          type: 'scatter',
        }],
      };
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.chart = this.$echarts.init(this.$refs.gas);
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
