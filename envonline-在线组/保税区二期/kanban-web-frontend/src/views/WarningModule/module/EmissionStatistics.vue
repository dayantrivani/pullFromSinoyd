<template>
  <div class="emission-statistics">
    <board-box title="胜科水务排放量统计">
      <span class="fn-right fn-clear text-primary" slot="sub-title">
        {{itemData.totalRate}}%
        <sub class="text-info">达标率</sub>
      </span>
      <div ref="echart" style="height: calc(100% - 0.2rem)" :class="{ 'empty-box': isEmpty }"></div>
    </board-box>
  </div>
</template>

<script>
import boardBox from '../components/boardBox';
import { analyzeResp } from '@/libs/util';

export default {
  name: 'EmissionStatistics',
  components: { boardBox },
  data() {
    const echarts = this.$echarts;
    return {
      isEmpty: false, // 标记echarts是否有数据渲染
      option: {
        grid: {
          top: 40,
          right: 20,
          bottom: 20,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          // eslint-disable-next-line
          formatter: params => {
            let [total, standard] = this.deWeightThree(params, 'seriesName');
            total = `${total.seriesName} ${total.axisValue} ${total.value}`;
            standard = standard ? ` <br/> ${standard.seriesName} ${standard.axisValue} ${standard.value}` : '';
            return `${total}${standard}`;
          },
        },
        legend: {
          right: 0,
          data: ['总排放量', '达标排放量'],
          textStyle: {
            color: '#ccc',
          },
        },
        xAxis: {
          data: [],
          axisLine: {
            lineStyle: {
              color: '#aaa6',
            },
          },
          axisLabel: {
            color: '#545a7c',
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#aaa6',
            },
          },
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#aaa6',
            },
          },
          axisLabel: {
            color: '#545a7c',
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#aaa6',
            },
          },
        },
        series: [
          {
            name: '总排放量',
            type: 'line',
            smooth: false,
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            hoverAnimation: false,
            label: {
              show: true,
              formatter: (parms) => {
                const val = `${(this.option.series[1].data[parms.dataIndex]
                  / (this.option.series[0].data[parms.dataIndex] || 1)).toFixed(2)}%`;
                return val;
              },
            },
            itemStyle: {
              color: '#6f0',
            },
            lineStyle: {
              color: '#6f0',
              type: 'dotted',
            },
            data: [],
            z: 10,
          },
          {
            name: '达标排放量',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#03a2db' },
                { offset: 1, color: '#0c5e77' },
              ]),
            },
            data: [],
          },
          {
            name: '总排放量',
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
              color: '#6f09',
            },
            z: -12,
            data: [],
          },
          {
            name: '达标排放量',
            type: 'pictorialBar',
            symbol: 'rect',
            itemStyle: {
              color: '#1a1a1a',
            },
            symbolRepeat: true,
            symbolSize: [12, 4],
            symbolMargin: 1,
            z: -10,
            data: [],
          },
        ],
      },
      itemData: {},
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    // 页面方法
    drawEchart() {
      const myChart = this.$echarts.init(this.$refs.echart);
      myChart.clear();
      myChart.setOption(this.option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },

    // 请求事件
    // 查询趋势数据
    getItemList() {
      this.$http.get('redis/ShengKeWaterDischargeStatistics_h/5F1E8179-53D1-478D-8AC8-7EF84FD1F54E').then((response) => {
        if (response.data.success) {
          this.itemData = response.data.data || [];
          this.option.xAxis.data = this.itemData.data;
          this.option.series[1].data = this.itemData.standardData;
          this.option.series[0].data = this.itemData.totalData;
          this.option.series[2].data = this.itemData.totalData;
          this.option.series[3].data = this.itemData.totalData;
          this.$nextTick(() => {
            this.drawEchart();
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },

    // 特殊方法
    deWeightThree(arr, name) { // 数组对象根据name去重
      const map = new Map();
      arr.forEach((item) => {
        if (!map.has(item[name])) {
          map.set(item[name], item);
        }
      });
      return [...map.values()];
    },
  },
};
</script>

<style lang="scss" scoped>
.emission-statistics {
  height: 100%;
}
</style>
