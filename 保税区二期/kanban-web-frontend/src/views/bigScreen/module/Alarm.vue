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
            <div ref="airEchart" style="height:1rem;" :class="{ 'empty-box': isEmpty }"></div>
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
            <div ref="waterEchart" style="height:1rem;" :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div ref="lineLeftOne" style="height:1.5rem;"></div>
      </el-col>
      <el-col :span="6">
        <div ref="lineRightOne" style="height:1.5rem;"></div>
      </el-col>
      <el-col :span="6">
        <div ref="lineLeftTwo" style="height:1.5rem;"></div>
      </el-col>
      <el-col :span="6">
        <div ref="lineRightTwo" style="height:1.5rem;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as _cloneDeep from 'lodash/cloneDeep';
import echarts from 'echarts';
// import { analyzeResp } from '@/libs/util';

export default {
  name: 'Alarm',
  data() {
    const echarts = this.$echarts;
    return {
      nowDate: new Date(),
      isEmpty: false, // 标记echarts是否有数据渲染
      option: {
        singleAxis: {
          top: '50%',
          type: 'time',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          height: `${100 / 7 - 15}%`,
          axisLabel: {
            show: false,
            interval: 2,
          },
        },
        series: {
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          data: [],
          symbolSize(dataItem) {
            return dataItem[1] * 4;
          },
        },
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
            smooth: true, // 是否平滑
            symbol: 'none',
            lineStyle: {
              normal: {
                type: 'dashed',
                color: 'rgba(222,10,255)',
              },
            },
            data: [],
          },
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
            data: [],
          },
        ],
      },
      airData: {},
      waterData: {},
      airDataLeft: {},
      airDataRight: {},
      waterDataLeft: {},
      waterDataRight: {},
      pickerDateBol: 1,
      nowDateLeft: new Date(),
      nowDateRight: new Date(),
    };
  },
  created() {
    this.getRedisAirLeftData();
    this.getRedisAirRightData();
    this.getRedisWaterLeftData();
    this.getRedisWaterRightData();
    this.getRedisAirData();
    this.getRedisWaterData();
  },
  methods: {
    // 获取redis数据(空气)
    getRedisAirData() {
      this.airData = {
        yearTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        yearData: [10, 5, 6, 2, 10, 5, 6, 2, 10, 5, 6, 2],
        yearTotal: 30,
        monthTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        monthData: [2, 3, 1, 0, 3, 1, 3, 5, 1, 1, 2, 2, 0, 2, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
      };
      //   this.$http.get('redis/AirQualityAlarmTrendMonth_s').then((response) => {
      //     if (response.data.success) {
      //       this.airData = response.data.data || [];
      //       const option = _cloneDeep(this.option);
      //       option.singleAxis.data = this.airData.yearTime;
      //       option.series.data = this.airData.yearData.map((m, n) => [+n, m]);
      //       // 废水废气曲线图数据
      //       this.lineOption.series[1].data = this.airData.monthTime.map((m, n) => [m, this.airData.monthData[n]]);
      //       this.$nextTick(() => {
      //         this.airDrawEchart(option);
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
      const option = _cloneDeep(this.option);
      option.singleAxis.data = this.airData.yearTime;
      option.series.data = this.airData.yearData.map((m, n) => [+n, m]);
      // 废水废气曲线图数据
      this.lineOption.series[1].data = this.airData.monthTime.map((m, n) => [m, this.airData.monthData[n]]);
      this.$nextTick(() => {
        this.airDrawEchart(option);
      });
    },
    // 获取redis数据(废水)
    getRedisWaterData() {
      this.waterData = {
        yearTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        yearData: [10, 5, 6, 2, 10, 5, 6, 2, 10, 5, 6, 2],
        yearTotal: 25,
        monthTime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        monthData: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2, 0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
      //   this.$http.get('redis/AmcsWaterAlarmTrendMonth_s').then((response) => {
      //     if (response.data.success) {
      //       this.waterData = response.data.data || [];
      //       const option = _cloneDeep(this.option);
      //       option.color = 'rgba(222,10,255)';
      //       option.singleAxis.data = this.waterData.yearTime;
      //       option.series.data = this.waterData.yearData.map((m, n) => [+n, m]);
      //       // 废水废气曲线图数据
      //       this.lineOption.series[0].data = this.waterData.monthTime.map((m, n) => [m, this.waterData.monthData[n]]);
      //       this.$nextTick(() => {
      //         this.waterDrawEchart(option);
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
      const option = _cloneDeep(this.option);
      option.color = 'rgba(222,10,255)';
      option.singleAxis.data = this.waterData.yearTime;
      option.series.data = this.waterData.yearData.map((m, n) => [+n, m]);
      // 废水废气曲线图数据
      this.lineOption.series[0].data = this.waterData.monthTime.map((m, n) => [m, this.waterData.monthData[n]]);
      this.$nextTick(() => {
        this.waterDrawEchart(option);
      });
    },
    // 上左
    airDrawEchart(option = this.option) {
      const myChart = this.$echarts.init(this.$refs.airEchart);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // 上右
    waterDrawEchart(option = this.option) {
      const myChart = this.$echarts.init(this.$refs.waterEchart);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    getRedisAirLeftData() {
      this.airDataLeft = {
        'data': ['2018年', '2019年'],
        'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        'thisYear': [3, 5, 3, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        'lastYear': [2, 4, 2, 1, 6, 3, 2, 8, 4, 4, 1, 4],
      };
      this.lineAirDataLeft();
    },
    getRedisAirRightData() {
      this.airDataRight = {
        'data': ['2019年', '2020年'],
        'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 40],
        'thisMonth': [2, 3, 0, 0, 3, 1, 6, 5, 1, 1, 2, 2, 2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2, 3, 4, 5, 6, 3, 5],
        'lastMonth': [4, 5, 1, 2, 5, 6, 7, 8, 4, 3, 4, 5, 2, 1, 1, 1, 3, 1, 4, 3, 0, 1, 1, 1, 2, 6, 3, 2, 7, 1],
      };
      this.lineAirDataRight();
    },
    getRedisWaterLeftData() {
      this.waterDataLeft = {
        'data': ['2019年', '2020年'],
        'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        'thisYear': [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        'lastYear': [2, 4, 2, 1, 6, 3, 2, 8, 4, 4, 1, 4],
      };
      this.lineWaterDataLeft();
    },
    getRedisWaterRightData() {
      this.waterDataRight = {
        'data': ['2019年', '2020年'],
        'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 40],
        'thisMonth': [2, 3, 0, 0, 3, 1, 6, 5, 1, 1, 2, 2, 2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2, 3, 4, 5, 6, 3, 5],
        'lastMonth': [4, 5, 1, 2, 5, 6, 7, 8, 4, 3, 4, 5, 2, 1, 1, 1, 3, 1, 4, 3, 0, 1, 1, 1, 2, 6, 3, 2, 7, 1],
      };
      this.lineWaterDataRight();
    },
    // lineLeftOne
    lineAirDataLeft() {
      const option = {
        title: {
          text: '同比',
          left: '4%',
          align: 'right',
          textStyle: {
            color: 'white',
            fontWeight: 200,
            fontSize: 14,
          },
        },
        legend: {
          data: this.airDataLeft.data,
          right: 10,
          textStyle: {
            color: 'white',
            fontWeight: 100,
            fontSize: 10,
          },
        },
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '10%',
        },
        xAxis: [{
          data: this.airDataLeft.time,
          axisLabel: {
            color: '#626992',
          },
        }],

        yAxis: [{
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.1)',
            },
          },
          axisLabel: {
            color: '#626992',
          },
        }],
        series: [{
          name: this.airDataLeft.data[0],
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(0, 188, 252)',
              }, {
                offset: 1,
                color: 'rgb(14, 70, 119)',
              }]),
              borderWidth: 0,
            },
          },
          data: this.airDataLeft.thisYear,
        },
        {
          name: this.airDataLeft.data[1],
          type: 'line',
          symbol: 'circle',
          lineStyle: {
            normal: {
              type: 'dashed',
              color: 'rgba(213,33,84)',
            },
          },
          data: this.airDataLeft.lastYear,
        },
        ],
      };
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.lineLeftOne);
        myChart.clear();
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
    // 上右
    lineAirDataRight() {
      const option = {
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '10%',
          // containLabel: true
        },
        title: {
          text: '环比',
          left: '4%',
          align: 'right',
          textStyle: {
            color: 'white',
            fontWeight: 200,
            fontSize: 14,
          },
        },
        xAxis: [{
          data: this.airDataRight.time,
          axisLabel: {
            color: '#626992',
          },
        }],
        legend: {
          data: this.airDataRight.data,
          right: 10,
          textStyle: {
            color: 'white',
            fontWeight: 100,
            fontSize: 10,
          },
        },
        yAxis: [{
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.1)',
            },
          },
          axisLabel: {
            color: '#626992',
          },
        }],
        series: [
          {
            name: this.airDataRight.data[0],
            type: 'scatter',
            symbolSize(dataItem) {
              return dataItem * 5;
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                offset: 0,
                color: 'rgb(227, 33, 89)',
              }, {
                offset: 1,
                color: 'rgb(179,57,121)',
              }]),
            },
            data: this.airDataRight.thisMonth,
          },
          {
            name: this.airDataRight.data[1],
            type: 'line',
            smooth: true, // 是否平滑
            symbol: 'none',
            itemStyle: {
              normal: {
                color: 'rgb(29, 91, 150)',
              },
            },
            lineStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(29, 91, 150)',
                }, {
                  offset: 1,
                  color: 'rgb(8,216,246)',
                }]),
              },
            },
            data: this.airDataRight.lastMonth,
          },
        ],
      };
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.lineRightOne);
        myChart.clear();
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
    // 下左
    lineWaterDataLeft() {
      const option = {
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '10%',
          // containLabel: true
        },
        title: {
          text: '环比',
          left: '4%',
          align: 'right',
          textStyle: {
            color: 'white',
            fontWeight: 200,
            fontSize: 14,
          },
        },
        xAxis: [{
          data: this.waterDataLeft.time,
          axisLabel: {
            color: '#626992',
          },
        }],
        legend: {
          data: this.waterDataLeft.data,
          right: 10,
          textStyle: {
            color: 'white',
            fontWeight: 100,
            fontSize: 10,
          },
        },
        yAxis: [{
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.1)',
            },
          },
          axisLabel: {
            color: '#626992',
          },
        }],
        series: [
          {
            name: this.waterDataLeft.data[0],
            type: 'bar',
            barWidth: '40%',
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(5, 230, 189)',
                }, {
                  offset: 1,
                  color: 'rgb(6,86,97)',
                }]),
                borderWidth: 0,
              },
            },
            data: this.waterDataLeft.thisYear,
          },
          {
            name: this.waterDataLeft.data[1],
            type: 'line',
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(237,165,2)',
              },
            },
            lineStyle: {
              normal: {
                type: 'dashed',
                color: 'rgba(237,165,2)',
              },
            },
            data: this.waterDataLeft.lastYear,
          },
        ],
      };
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.lineLeftTwo);
        myChart.clear();
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
    // 下右
    lineWaterDataRight() {
      const option = {
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '10%',
          // containLabel: true
        },
        title: {
          text: '环比',
          left: '4%',
          align: 'right',
          textStyle: {
            color: 'white',
            fontWeight: 200,
            fontSize: 14,
          },
        },
        xAxis: [{
          data: this.waterDataRight.time,
          axisLabel: {
            color: '#626992',
          },
        }],
        legend: {
          data: this.waterDataRight.data,
          right: 10,
          textStyle: {
            color: 'white',
            fontWeight: 100,
            fontSize: 10,
          },
        },
        yAxis: [{
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.1)',
            },
          },
          axisLabel: {
            color: '#626992',
          },
        }],
        series: [
          {
            name: this.waterDataRight.data[0],
            type: 'scatter',
            symbolSize(dataItem) {
              return dataItem * 5;
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(237,165,2)',
              }, {
                offset: 1,
                color: 'rgb(237,165,2)',
              }]),
            },
            data: this.waterDataRight.thisMonth,
          },
          {
            name: this.waterDataRight.data[1],
            type: 'line',
            smooth: true, // 是否平滑
            symbol: 'none',
            itemStyle: {
              normal: {
                color: 'rgb(5, 230, 189)',
              },
            },
            lineStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(5, 230, 189)',
                }, {
                  offset: 1,
                  color: 'rgb(6,86,97)',
                }]),
              },
            },
            data: this.waterDataRight.lastMonth,
          },
        ],
      };
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.lineRightTwo);
        myChart.clear();
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
  },
};
</script>
