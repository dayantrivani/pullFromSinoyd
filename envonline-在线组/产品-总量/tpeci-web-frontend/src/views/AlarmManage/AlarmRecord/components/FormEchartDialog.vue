<!-- 选择合同 -->
<template>
  <dialog-modal ref="dialog" size="middle" appendToBody
    :title="`${title}`" @close="closeDialog">
     <div ref="factor" style="height:55vh;width: 100%"></div>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';

export default {
  data() {
    return {
      title: '报警因子数据曲线',
      itemModel: {},
      chartList: [],
      options: {},
    };
  },
  computed: {
    legend() { return this.options.legend; },
    xAxis() { return this.options.xAxis; },
    series() { return this.options.series; },
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    openDialog(row) {
      this.options = this.getEmptyItem();
      this.itemModel = { ...row };
      this.$refs.dialog.openDialog();
      this.options.title.text = this.itemModel.factorName;
      this.options.series.markLine.data[0].yAxis = this.itemModel.upperValue;
      this.getDataCurve();
    },
    drawEcharts() {
      const echart = this.$echarts.init(this.$refs.factor);
      echart.clear();
      echart.setOption(this.options);
      window.addEventListener('resize', () => { echart.resize(); });
    },
    getDataCurve() {
      const [fromTime, toTime] = this.getFormatDate(this.itemModel.alarmTstamp);
      this.$http.post('amcs/dataCurve', {
        portId: this.itemModel.portId,
        factorCodes: [this.itemModel.factorCode],
        portType: this.itemModel.portType,
        dataType: 'Hour',
        fromTime,
        toTime,
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.chartList = response.data.data;
          Object.keys(this.chartList).forEach((element) => {
            if (element === 'XData') {
              this.options.xAxis[0].data = this.chartList[element];
            } else {
              this.options.series.name = this.itemModel.factorName;
              this.options.series.data = this.chartList[element];
            }
          });
          this.$nextTick(() => { this.drawEcharts(); });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getFormatDate(date) {
      const timestamp = new Date(date.replace(/-/g, '/')).getTime();
      const now = new Date().getTime();
      const start = new Date();
      let end = new Date();
      start.setTime(timestamp - 3600 * 1000 * 12);
      end.setTime(timestamp + 3600 * 1000 * 12);
      if (end > now) end = now;
      end = new Date(end);
      return [formatDate(start, 'Y-m-d H:i:s'), formatDate(end, 'Y-m-d H:i:s')];
    },
    closeDialog() {
      this.chartList = [];
      this.itemModel = {};
    },
    getEmptyItem() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        dataZoom: [ // 缩放
          {
            type: 'inside',
          },
          // {
          //   type: 'slider',
          // },
        ],
        grid: {
          left: '75',
          right: '50',
          top: '60',
          bottom: '100',
        },
        title: {
          text: '',
          align: 'center',
          x: 'center',
          y: '10',
        },
        // legend: {
        //   data: ['超标因子α', '超标因子β'],
        //   right: '200',
        //   top: '25',
        // },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLabel: {
              formatter(value) {
                return `{value|${value}}`;
              },
              rotate: 45,   // x轴文字旋转角度
              margin: 10,   // x轴文字与坐标轴之间的间距
              rich: {
                value: {
                  align: 'right',
                },
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '浓度（mg/m³）',
            axisLabel: {
              formatter: '{value}',
            },
          },
        ],
        series: {
          name: '',
          type: 'line',
          data: [],
          showSymbol: false,  // 折线图的拐点
          markLine: {
            silent: true,
            data: [{ yAxis: '' }],
            symbol: 'none',
            lineStyle: {
              color: '#B03A5B',
            },
          },
          itemStyle: {
            color: '#63a0d7',
          },
        },
      };
    },
  },
};
</script>
