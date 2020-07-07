<template>
  <!-- 昨日数据传输有效率柱状图 -->
  <div class="fill-h" ref="hourlyExcessAlarm"></div>
</template>

<script>
import Echarts from 'echarts';

export default {
  name: 'HourlyExcessAlarm',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chart: null,        // 存储echart图表对象
    };
  },
  computed: {
    option() {
      const values = this.data.map(item => +item.dataTransferEffectiveValue.replace(/%/, ''))
        .sort((m, n) => m.dataTransferEffectiveValue - n.dataTransferEffectiveValue);
      // const names = ['暂无', '暂无', '暂无', '暂无', '暂无', '暂无', '暂无', '暂无', '暂无', '暂无'];
      const names = ['暂无', '暂无', '暂无', '暂无', '暂无'];
      const getNames = this.data.map(item => item.portName);
      getNames.forEach((n, i) => { names[i] = n; });
      return ({
        color: ['#5B9BD5'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: '{b}： {c}%',
        },
        grid: {
          top: '30',
          left: '50',
          right: '20',
          bottom: '60',
        },
        xAxis: [
          {
            type: 'category',
            data: names,
            axisLabel: {
              color: '#909399',
              interval: 0,
              showMinLabel: true,
              showMaxLabel: true,
              // rotate: '20',
              align: 'center',
              formatter(params) {
                let newParamsName = '';
                const paramsNameNumber = params.length;
                const provideNumber = 9;
                const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                if (paramsNameNumber > provideNumber) {
                  for (let p = 0; p < rowNumber; p++) {
                    let tempStr = '';
                    const start = p * provideNumber;
                    const end = start + provideNumber;
                    if (p === rowNumber - 1) {
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      tempStr = `${params.substring(start, end)}\n`;
                    }
                    newParamsName += tempStr;
                  }
                } else {
                  newParamsName = params;
                }
                return newParamsName;
                // if (value.length > 10) {
                //   return `${value.slice(0, 9)} . . .`;
                // }
                // return value;
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}%',
              color: '#909399',
            },
            min: 0,
            max: 100,
            interval: 10,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '传输有效率',
            type: 'bar',
            barWidth: '60%',
            data: values,
          },
        ],
      });
    },
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.echartsInit();
        });
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
  },
  methods: {
    echartsInit() {
      this.chart = Echarts.init(this.$refs.hourlyExcessAlarm);
      this.chart.clear();
      this.chart.setOption(this.option);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
