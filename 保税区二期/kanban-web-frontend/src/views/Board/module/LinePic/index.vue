<template>
  <!-- 雨水排放 -->
  <div class="fill-h" style="background-color: #1a1a1a;">
    <el-row style="height:7%;">
      <div class="line-title">空气报警次数
        <span style="padding-left:2vw;cursor: pointer;" @click="pickerDateBol = 1"
          :class="pickerDateBol === 1?'line-title-show':''">年</span>
        <span>/</span>
        <span style="cursor: pointer;" @click="pickerDateBol = 2"
          :class="pickerDateBol === 2?'line-title-show':''">月</span>
        <el-date-picker v-model="nowDateLeft" v-show="pickerDateBol === 1" :editable="false" :clearable="false"
          type="year" @change="changeDateLeft" placeholder="选择年" prefix-icon="none"
          class="yd-date-picker fn-clear mar-r-xs" style="width: 0.85rem !important;">
        </el-date-picker>
        <el-date-picker v-model="nowDateLeft" v-show="pickerDateBol === 2" :editable="false" :clearable="false"
          type="month" @change="changeDateLeft" placeholder="选择月" prefix-icon="none"
          class="yd-date-picker fn-clear mar-r-xs" style="width: 0.85rem !important;">
        </el-date-picker>
        <el-date-picker v-model="nowDateRight" :editable="false" :clearable="false" type="month"
          @change="changeDateRight" placeholder="选择月" prefix-icon="none"
          class="yd-date-picker fn-right fn-clear mar-r-xs" style="width: 0.85rem !important;">
        </el-date-picker>
      </div>
    </el-row>
    <el-row style="height:43%;">
      <el-col :span="12" class="fill-h">
        <div ref="lineLeftOne" class="fill-h"></div>
      </el-col>
      <el-col :span="12" class="fill-h">
        <div ref="lineRightOne" class="fill-h"></div>
      </el-col>
    </el-row>
    <el-row style="height:7%;">
      <div class="line-title">地表水报警次数
      </div>
    </el-row>
    <el-row style="height:43%;">
      <el-col :span="12" class="fill-h">
        <div ref="lineLeftTwo" class="fill-h"></div>
      </el-col>
      <el-col :span="12" class="fill-h">
        <div ref="lineRightTwo" class="fill-h"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts';
import { analyzeResp } from '@/libs/util';

export default {
  name: 'LinePic',
  data() {
    return {
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
    this.getItemList();
  },
  watch: {
    pickerDateBol: {
      handler() {
        this.changeDateLeft();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getItemList() {
      this.getRedisAirLeftData();
      this.getRedisAirRightData();
      this.getRedisWaterLeftData();
      this.getRedisWaterRightData();
    },
    // 左边时间变动
    changeDateLeft() {
      this.getAirLeftData();
      this.getWaterLeftData();
    },
    // 右边时间变动
    changeDateRight() {
      this.getAirRightData();
      this.getWaterRightData();
    },
    // 左边数据接口
    getRedisAirLeftData() {
      this.$http.get('redis/AirQualityAlarmQtyTBYear_s').then((response) => {
        if (response.data.success) {
          this.airDataLeft = response.data.data;
          this.lineAirDataLeft();
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
    getRedisWaterLeftData() {
      this.$http.get('redis/SurfaceWaterAlarmQtyTBYear_s').then((response) => {
        if (response.data.success) {
          this.waterDataLeft = response.data.data;
          this.lineWaterDataLeft();
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
    getAirLeftData() {
      this.$http.get('airquality/gis/yearonyear', {
        params: {
          type: this.pickerDateBol,
          year: this.nowDateLeft.getFullYear(),
          month: this.nowDateLeft.getMonth() + 1,
        },
      }).then((response) => {
        if (response.data.success) {
          this.airDataLeft = response.data.data;
          this.lineAirDataLeft();
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
    getWaterLeftData() {
      this.$http.get('surfacewater/gis/yearonyear', {
        params: {
          type: this.pickerDateBol,
          year: this.nowDateLeft.getFullYear(),
          month: this.nowDateLeft.getMonth() + 1,
        },
      }).then((response) => {
        if (response.data.success) {
          this.waterDataLeft = response.data.data;
          this.lineWaterDataLeft();
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
    // 右边数据接口
    getRedisAirRightData() {
      this.$http.get('redis/AirQualityAlarmQtyHB_s').then((response) => {
        if (response.data.success) {
          this.airDataRight = response.data.data;
          this.lineAirDataRight();
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
    getRedisWaterRightData() {
      this.$http.get('redis/SurfaceWaterAlarmQtyHB_s').then((response) => {
        if (response.data.success) {
          this.waterDataRight = response.data.data;
          this.lineWaterDataRight();
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
    getAirRightData() {
      this.$http.get('airquality/gis/monthonmonth', {
        params: {
          year: this.nowDateRight.getFullYear(),
          month: this.nowDateRight.getMonth() + 1,
        },
      }).then((response) => {
        if (response.data.success) {
          this.airDataRight = response.data.data;
          this.lineAirDataRight();
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
    getWaterRightData() {
      this.$http.get('surfacewater/gis/monthonmonth', {
        params: {
          year: this.nowDateRight.getFullYear(),
          month: this.nowDateRight.getMonth() + 1,
        },
      }).then((response) => {
        if (response.data.success) {
          this.waterDataRight = response.data.data;
          this.lineWaterDataRight();
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
    // 上左
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
        tooltip: {
          trigger: 'axis',
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
        backgroundColor: '#1A1A1A',
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
        backgroundColor: '#1A1A1A',
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '10%',
          // containLabel: true
        },
        tooltip: {
          trigger: 'axis',
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
              return dataItem * 0.01;
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
        backgroundColor: '#1A1A1A',
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '10%',
          // containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
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
        backgroundColor: '#1A1A1A',
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '10%',
          // containLabel: true
        },
        tooltip: {
          trigger: 'axis',
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

<style>
.linePic {
  width: 42vw;
  height: 5rem;
}
.line-title {
  clear: both;
  margin: 0.5vh 0 0 1vh;
  font-size: 0.16rem;
}
.line-title-show {
  text-decoration: underline;
  font-size: 0.18rem;
  color: rgb(237, 165, 2);
}
.line-charts {
  display: flex;
}
.line-charts div {
  flex: 1;
  height: 2rem;
}
</style>
