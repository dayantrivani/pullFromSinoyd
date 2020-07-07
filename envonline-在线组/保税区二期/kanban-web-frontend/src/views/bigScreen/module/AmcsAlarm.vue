<template>
  <div>
    <el-row>
      <el-col style="font-size:0.3rem;">
        报警趋势图
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="6">
            <div style="font-size:0.2rem;">
              大气报警次数
            </div>
            <div style="font-size:0.4rem;">
              352
              <span style="font-size:0.1rem;">次</span>
            </div>
          </el-col>
          <el-col :span="18">
            <div ref="lineEchartLeft" style="height:1rem;" :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="6">
            <div style="font-size:0.2rem;">
              地表水报警次数
            </div>
            <div style="font-size:0.4rem;">
              352
              <span style="font-size:0.1rem;">次</span>
            </div>
          </el-col>
          <el-col :span="18">
            <div ref="lineEchartRight" style="height:1rem;" :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
    </el-row>
  </div>
</template>

<script>
import * as _cloneDeep from 'lodash/cloneDeep';
// import { analyzeResp } from '@/libs/util';

export default {
  name: 'AlarmingTrend',
  data() {
    const echarts = this.$echarts;
    return {
      isEmpty: false, // 标记echarts是否有数据渲染
      queryForm: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      lineOption: {
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '15%',
          // containLabel: true
        },
        xAxis: [{
          type: 'value',
          axisLabel: {
            color: '#626992',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.1)',
            },
          },
        }],

        yAxis: [{
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.1)',
            },
          },
          boundaryGap: true,
          axisLabel: {
            color: '#626992',
          },
        }],
        series: [
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              normal: {
                color: 'rgba(144,34,61)',
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(123,32,55,0.8)',
                },
                {
                  offset: 1,
                  color: 'rgba(123,32,55,0)',
                },
                ], false),
                shadowColor: 'rgba(123,32,55, 0.9)',
                shadowBlur: 20,
              },
            },
            data: [
              [1, 12],
              [2, 22],
              [3, 32],
              [4, 31],
              [5, 23],
              [6, 24],
              [7, 12],
              [8, 22],
              [9, 17],
              [10, 18],
              [11, 15],
              [12, 25],
              [13, 12],
              [14, 23],
              [15, 23],
              [16, 28],
              [17, 24],
              [18, 23],
            ],
          },
        ],
      },
      waterData: {},
      airData: {},
    };
  },
  computed: {
    date: {
      get() {
        return `${this.queryForm.year}-${this.queryForm.month}`;
      },
      set(val) {
        [this.queryForm.year, this.queryForm.month] = val.split('-');
      },
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.getWaterData();
      this.getAirData();
    },
    lineLeftDrawEchart(lineOption = this.lineOption) {
      const myChart = this.$echarts.init(this.$refs.lineEchartLeft);
      myChart.clear();
      myChart.setOption(lineOption);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    lineRightDrawEchart(lineOption = this.lineOption) {
      const myChart = this.$echarts.init(this.$refs.lineEchartRight);
      myChart.clear();
      myChart.setOption(lineOption);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // onChangeDate() { // 改变年月
    //   this.$http.get('amcs/gis/alarmtrend', {
    //     params: {
    //       ...this.queryForm,
    //       portType: 1,
    //     },
    //   }).then((response) => {
    //     if (response.data.success) {
    //       this.waterData = response.data.data || [];
    //       const option = _cloneDeep(this.option);
    //       option.singleAxis.data = this.waterData.yearTime;
    //       option.series.data = this.waterData.yearData.map((m, n) => [+n, m]);
    //       // 废水废气曲线图数据
    //       this.lineOption.series[0].data = this.waterData.monthTime.map((m, n) => [m, this.waterData.monthData[n]]);
    //       this.$nextTick(() => {
    //         this.waterDrawEchart(option);
    //         this.lineDrawEchart(option);
    //       });
    //     } else {
    //       this.$message.warning({
    //         message: response.data.msg,
    //         duration: 3000,
    //         showClose: true,
    //       });
    //     }
    //   }, ({ response }) => {
    //     analyzeResp(response);
    //   });
    //   this.$http.get('amcs/gis/alarmtrend', {
    //     params: {
    //       ...this.queryForm,
    //       portType: 2,
    //     },
    //   }).then((response) => {
    //     if (response.data.success) {
    //       this.airData = response.data.data || [];
    //       const option = _cloneDeep(this.option);
    //       option.singleAxis.data = this.airData.yearTime;
    //       option.series.data = this.airData.yearData.map((m, n) => [+n, m]);
    //       // 废水废气曲线图数据
    //       this.lineOption.series[1].data = this.airData.monthTime.map((m, n) => [m, this.airData.monthData[n]]);
    //       this.$nextTick(() => {
    //         this.airDrawEchart(option);
    //         this.lineDrawEchart(option);
    //       });
    //     } else {
    //       this.$message.warning({
    //         message: response.data.msg,
    //         duration: 3000,
    //         showClose: true,
    //       });
    //     }
    //   }, ({ response }) => {
    //     analyzeResp(response);
    //   });
    // },

    // 请求事件
    getWaterData() {
      this.waterData = {
        yearTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        yearData: [2, 3, 0, 6, 3, 1, 5, 5, 1, 1, 2, 2],
        yearTotal: 25,
        monthTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        monthData: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2, 0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
      //   this.$http.get('redis/AmcsWaterAlarmTrendMonth_s').then((response) => {
      //     if (response.data.success) {
      //       this.waterData = response.data.data || [];
      //       const lineOption = _cloneDeep(this.lineOption);
      //       // 废水废气曲线图数据
      //       lineOption.series[0].data = this.waterData.monthTime.map((m, n) => [m, this.waterData.monthData[n]]);
      //       this.$nextTick(() => {
      //         this.lineRightDrawEchart(lineOption);
      //       });
      //     } else {
      //       this.$message.warning({
      //         message: response.data.msg,
      //         duration: 3000,
      //         showClose: true,
      //       });
      //     }
      //   }, ({ response }) => {
      //     analyzeResp(response);
      //   });
      const lineOption = _cloneDeep(this.lineOption);
      // 废水废气曲线图数据
      lineOption.series[0].data = this.waterData.monthTime.map((m, n) => [m, this.waterData.monthData[n]]);
      this.$nextTick(() => {
        this.lineRightDrawEchart(lineOption);
      });
    },
    getAirData() {
      this.airData = {
        yearTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        yearData: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        yearTotal: 20,
        monthTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        monthData: [2, 3, 1, 0, 3, 1, 3, 5, 1, 1, 2, 2, 0, 2, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
      };
      //   this.$http.get('redis/AmcsAirAlarmTrendMonth_s').then((response) => {
      //     if (response.data.success) {
      //       this.airData = response.data.data || [];
      //       const lineOption = _cloneDeep(this.lineOption);
      //       // 废水废气曲线图数据
      //       lineOption.series[0].data = this.airData.monthTime.map((m, n) => [m, this.airData.monthData[n]]);
      //       this.$nextTick(() => {
      //         this.lineLeftDrawEchart(lineOption);
      //       });
      //     } else {
      //       this.$message.warning({
      //         message: response.data.msg,
      //         duration: 3000,
      //         showClose: true,
      //       });
      //     }
      //   }, ({ response }) => {
      //     analyzeResp(response);
      //   });
      const lineOption = _cloneDeep(this.lineOption);
      // 废水废气曲线图数据
      lineOption.series[0].data = this.airData.monthTime.map((m, n) => [m, this.airData.monthData[n]]);
      this.$nextTick(() => {
        this.lineLeftDrawEchart(lineOption);
      });
    },
  },
};
</script>
