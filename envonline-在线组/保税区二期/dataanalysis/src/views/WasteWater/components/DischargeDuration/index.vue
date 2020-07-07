<template>
  <!-- 排口排放时长统计 -->
  <main-case title="排口排放时长统计">
    <div slot="title" class="mar-l-sm">
      <el-date-picker
        class="yd-date-picker mar-r-xs"
        prefix-icon="icon-null"
        v-model="value3"
        type="year"
        placeholder="选择年">
      </el-date-picker>
      <el-select class="yd-date-picker" v-model="value">
        <el-option label="全部" value=""></el-option>
      </el-select>
    </div>
    <div ref="DischargeDuration" class="charts"></div>
  </main-case>
</template>

<script>
// import { analyzeResp } from '@/libs/util';

export default {
  name: 'DischargeDuration',
  data() {
    // const echarts = this.$echarts;
    return {
      chart: null,
      value: '',
      value3: '',
      options: {
        title: {
          subtext: '单位：h',
          left: '50',
        },
        xAxis: {
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          axisLabel: {
            textStyle: {
              color: '#ccd',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          z: 10,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#ccd',
            },
          },
        },
        dataZoom: [
          {
            type: 'inside',
          },
        ],
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                barBorderRadius: [50],
                // color: new echarts.graphic.LinearGradient(
                //   0, 0, 0, 1,
                //   [
                //     { offset: 0, color: '#20ed4b' },
                //     { offset: 1, color: '#034e0d' },
                //   ]
                // ),
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: '#20ed4b', // 0% 处的颜色
                    },
                    {
                      offset: 1, color: '#034e0d', // 100% 处的颜色
                    },
                  ],
                  global: false,
                },
              },
            },
            data: [10, 21, 22, 24, 19, 18, 16, 12, 16, 19, 22, 26, 24],
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawEchart();
    });
  },
  created() {
    // this.getItemList();
  },
  methods: {
    drawEchart() {
      this.chart = this.$echarts.init(this.$refs.DischargeDuration);
      this.chart.clear();
      this.chart.setOption(this.options);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
      // myChart.resize();
      // setTimeout(myChart.resize, 250);
    },
    // 获取记录列表
    getItemList() {
      // this.$axios.request({
      //   url: 'sinoyd-airquality/airquality/regionHourAQI/last24hAQI',
      //   method: 'get',
      // }).then((res) => {
      //   if (res.status === 200 && res.data.success) {
      //     this.options.series[0].data = res.data.data.data;
      //     this.options.xAxis.data = res.data.data.time;
      //     this.drawScatter();
      //   } else {
      //     this.$tools.message('warning', res);
      //   }
      // }, ({ error }) => {
      //   analyzeResp(error);
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
