<template>
  <board-box title="报警趋势图" class="alarming-trend">
    <el-row style="height:5%">
      <el-date-picker v-model="date" :editable="false" :clearable="false" type="month" @change="changeDate"
        value-format="yyyy-MM" placeholder="选择月" prefix-icon="none" class="yd-date-picker fn-right fn-clear mar-r-xs"
        style="width: 0.85rem !important;">
      </el-date-picker>
    </el-row>
    <el-row style="height:95%">
      <el-col :span="10">
        <div style="height: 50%">
          <p class="title">大气报警次数</p>
          <p class="count">{{airData.yearTotal}}</p>
          <div ref="airEchart" style="height: calc(100% - 0.5rem)" :class="{ 'empty-box': isEmpty }"></div>
        </div>
        <div style="height: 50%">
          <p class="title">地表水报警次数</p>
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
import boardBox from '../../components/boardBox';
import { analyzeResp } from '@/libs/util';

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
        tooltip: {
          trigger: 'axis',
        },
        series: {
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          data: [],
          symbolSize(dataItem) {
            return dataItem[1] * 0.2;
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
        tooltip: {
          trigger: 'axis',
          formatter: params => `地表水${params[0].data[0]}日: ${params[0].data[1]}次<br />大气${params[1].data[0]}日: ${params[1].data[1]}次`,
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
      queryForm: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      airData: {},
      waterData: {},
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
  components: { boardBox },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.getRedisAirData();
      this.getRedisWaterData();
    },
    // 时间变动
    changeDate() {
      this.getAirData();
      this.getWaterData();
    },
    // 获取redis数据(空气)
    getRedisAirData() {
      this.$http.get('redis/AirQualityAlarmTrendMonth_s').then((response) => {
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
    // 获取空气数据
    getAirData() {
      this.$http.get('airquality/gis/alarmtrend', {
        params: {
          ...this.queryForm,
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
    // 获取redis数据(废水)
    getRedisWaterData() {
      this.$http.get('redis/AmcsWaterAlarmTrendMonth_s').then((response) => {
        if (response.data.success) {
          this.waterData = response.data.data || [];
          const option = _cloneDeep(this.option);
          option.color = 'rgba(222,10,255)';
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
    // 获取数据(废水)
    getWaterData() {
      this.$http.get('surfacewater/gis/alarmtrend', {
        params: {
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.waterData = response.data.data || [];
          const option = _cloneDeep(this.option);
          option.color = 'rgba(222,10,255)';
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
    // 左上
    airDrawEchart(option = this.option) {
      const myChart = this.$echarts.init(this.$refs.airEchart);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // 左下
    waterDrawEchart(option = this.option) {
      const myChart = this.$echarts.init(this.$refs.waterEchart);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // 右
    lineDrawEchart() {
      const myChart = this.$echarts.init(this.$refs.lineEchart);
      myChart.clear();
      myChart.setOption(this.lineOption);
      window.addEventListener('resize', () => {
        myChart.resize();
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
    font-size: 0.14rem;
  }
  .count {
    font-size: 0.18rem;
  }
}
</style>
