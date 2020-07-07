<template>
  <board-box title="报警趋势图" class="alarming-trend">
    <span slot="sub-title">
      <el-date-picker
        v-model="date"
        :editable="false"
        :clearable="false"
        type="month"
        value-format="yyyy-MM"
        placeholder="选择月"
        prefix-icon="none"
        class="yd-date-picker fn-right fn-clear mar-r-xs"
        style="width: 0.85rem !important;"
        @change="onChangeDate">
      </el-date-picker>
    </span>
    <el-row class="fill-h">
      <el-col :span="10">
        <div style="height: 50%">
          <p class="title">废气报警次数</p>
          <p class="count">{{airData.yearTotal}}</p>
          <div ref="airEchart" style="height: calc(100% - 0.5rem)" :class="{ 'empty-box': isEmpty }"></div>
        </div>
        <div style="height: 50%">
          <p class="title">废水报警次数</p>
          <p class="count">{{waterData.yearTotal}}</p>
          <div ref="waterEchart" style="height: calc(100% - 0.5rem)" :class="{ 'empty-box': isEmpty }"></div>
        </div>
      </el-col>
      <el-col :span="14" style="padding-left: 0.15rem">
        <div class="fill-h" style="width: calc(100% - 0.15rem)">
          <div ref="lineEchart" class="fill-h" :class="{ 'empty-box': isEmpty }"></div>
        </div>
      </el-col>
    </el-row>
  </board-box>
</template>

<script>
import * as _cloneDeep from 'lodash/cloneDeep';
import boardBox from '../components/boardBox';
import { analyzeResp } from '@/libs/util';

export default {
  name: 'AlarmingTrend',
  components: { boardBox },
  data() {
    const echarts = this.$echarts;
    return {
      isEmpty: false, // 标记echarts是否有数据渲染
      queryForm: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      option: {
        color: 'rgba(222,10,255)',
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
            return dataItem[1] * 0.01;
          },
        },
      },
      lineOption: {
        backgroundColor: '#1A1A1A',
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
            data: [
              [1, 24],
              [2, 35],
              [3, 38],
              [4, 23],
              [5, 32],
              [6, 12],
              [7, 22],
              [8, 24],
              [9, 36],
              [10, 23],
              [11, 24],
              [12, 35],
              [13, 24],
              [14, 28],
              [15, 28],
              [16, 23],
              [17, 28],
              [18, 29],
            ],
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
    airDrawEchart(option = this.option) {
      const myChart = this.$echarts.init(this.$refs.airEchart);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    waterDrawEchart(option = this.option) {
      const myChart = this.$echarts.init(this.$refs.waterEchart);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    lineDrawEchart() {
      const myChart = this.$echarts.init(this.$refs.lineEchart);
      myChart.clear();
      myChart.setOption(this.lineOption);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    onChangeDate() { // 改变年月
      this.$http.get('amcs/gis/alarmtrend', {
        params: {
          ...this.queryForm,
          portType: 1,
        },
      }).then((response) => {
        if (response.data.success) {
          this.waterData = response.data.data || [];
          const option = _cloneDeep(this.option);
          option.singleAxis.data = this.waterData.yearTime;
          option.series.data = this.waterData.yearData.map((m, n) => [+n, m]);
          // 废水废气曲线图数据
          this.lineOption.series[0].data = this.waterData.monthTime.map((m, n) => [m, this.waterData.monthData[n]]);
          this.$nextTick(() => {
            this.waterDrawEchart(option);
            this.lineDrawEchart(option);
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
      this.$http.get('amcs/gis/alarmtrend', {
        params: {
          ...this.queryForm,
          portType: 2,
        },
      }).then((response) => {
        if (response.data.success) {
          this.airData = response.data.data || [];
          const option = _cloneDeep(this.option);
          option.singleAxis.data = this.airData.yearTime;
          option.series.data = this.airData.yearData.map((m, n) => [+n, m]);
          // 废水废气曲线图数据
          this.lineOption.series[1].data = this.airData.monthTime.map((m, n) => [m, this.airData.monthData[n]]);
          this.$nextTick(() => {
            this.airDrawEchart(option);
            this.lineDrawEchart(option);
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

    // 请求事件
    getWaterData() {
      this.$http.get('redis/AmcsWaterAlarmTrendMonth_s').then((response) => {
        if (response.data.success) {
          this.waterData = response.data.data || [];
          const option = _cloneDeep(this.option);
          option.singleAxis.data = this.waterData.yearTime;
          option.series.data = this.waterData.yearData.map((m, n) => [+n, m]);
          // 废水废气曲线图数据
          this.lineOption.series[0].data = this.waterData.monthTime.map((m, n) => [m, this.waterData.monthData[n]]);
          this.$nextTick(() => {
            this.waterDrawEchart(option);
            this.lineDrawEchart(option);
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
    getAirData() {
      this.$http.get('redis/AmcsAirAlarmTrendMonth_s').then((response) => {
        if (response.data.success) {
          this.airData = response.data.data || [];
          const option = _cloneDeep(this.option);
          option.singleAxis.data = this.airData.yearTime;
          option.series.data = this.airData.yearData.map((m, n) => [+n, m]);
          // 废水废气曲线图数据
          this.lineOption.series[1].data = this.airData.monthTime.map((m, n) => [m, this.airData.monthData[n]]);
          this.$nextTick(() => {
            this.airDrawEchart(option);
            this.lineDrawEchart(option);
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
  },
};
</script>

<style lang="scss" scoped>
  .alarming-trend {
    width: 100%;
    height: 100%;
    .title {
      font-size: 0.14rem
    }
    .count {
      font-size: 0.18rem
    }
  }
</style>
