<template>
  <div class="electricity-chart" ref="electricity"></div>
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
        title: {
          text: `当前用电总数\t\t\t ${this.data.totalQty}（${this.data.unitNum ? '万千瓦时' : '千瓦时'}）`,
          padding: [5, 0],
          textStyle: {
            color: '#2ad1ff',
            fontSize: '14',
          },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,.9)',
          axisPointer: {
            type: 'none',
          },
          textStyle: {
            color: '#2acbed',
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
                  border-left:2px solid #2acbed;
                  border-top:2px solid #2acbed";
              ></div>
              <div
                style="
                  position:absolute;
                  right:0;
                  top:0;
                  width:8px;
                  height:8px;
                  border-right:2px solid #2acbed;
                  border-top:2px solid #2acbed";
              ></div>
              <div
                style="
                  position:absolute;
                  left:0;
                  bottom:0;
                  width:8px;
                  height:8px;
                  border-left:2px solid #2acbed;
                  border-bottom:2px solid #2acbed";
              ></div>
              <div
                style="
                  position:absolute;
                  right:0;
                  bottom:0;
                  width:8px;
                  height:8px;
                  border-right:2px solid #2acbed;
                  border-bottom:2px solid #2acbed";
              ></div>
              ${params[0].data}
            </div>`;
            return tooltip;
          },
          extraCssText: 'padding: 0',
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
        series: {
          data: this.data.dataList,
          type: 'bar',
          itemStyle: {
            color: '#2acbed',  // 柱条的颜色
            barBorderRadius: 7, // 柱条的圆角
          },
          barWidth: 13, // 柱条的宽度
        },
      };
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.chart = this.$echarts.init(this.$refs.electricity);
        this.chart.clear();
        this.chart.setOption(this.options);
        window.addEventListener('resize', () => { this.chart.resize(); });
      });
    },
  },
};
</script>
