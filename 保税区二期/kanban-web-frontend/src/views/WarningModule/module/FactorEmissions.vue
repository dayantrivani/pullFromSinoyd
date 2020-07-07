<!-- 因子排放量 -->
<template>
  <el-row class="factor-emissions fill-h">
    <el-col :span="10">
      <el-row class="fill-h">
        <el-col :span="12" v-for="item in factorData" :key="item.factorCode">
          <factor-echart
            :factorData="item"
            :class="{ active: checkFactor === item.factorCode }"
            @click.native="onClickFactor(item.factorCode)"
          ></factor-echart>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="14" style="padding-left: 0.15rem">
      <el-row class="fill-h">
        <el-col :span="12">
          <div ref="radarEchart" style="height: 100%" :class="{ 'empty-box': isEmpty }"></div>
        </el-col>
        <el-col :span="12">
          <div ref="pictorialBarEchart" style="height: 100%" :class="{ 'empty-box': isEmpty }"></div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import * as _cloneDeep from 'lodash/cloneDeep';
import factorEchart from '../components/factorEchart';
import { analyzeResp } from '@/libs/util';

export default {
  name: 'FactorEmissions',
  components: { factorEchart },
  props: {
    type: { // 本组件属于废水 water 还是废气 air
      type: String,
      default: 'air',
      required: true,
    },
  },
  data() {
    return {
      isEmpty: false, // 标记echarts是否有数据渲染
      option: [
        {
          color: ['#46B9B2', '#752036'],
          grid: {},
          title: {
            text: 'NOx排放量与2019年同比',
            textStyle: { color: '#fff' },
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['2019', '2020'],
            orient: 'vertical',
            right: 0,
            top: '20%',
            textStyle: {
              color: '#909399',
            },
          },
          radar: {
            center: ['40%', '60%'],
            radius: '60%',
            name: {
              textStyle: {
                color: '#909399',
              },
            },
            nameGap: 5,
            indicator: [
              { name: '1月', max: 15 },
              { name: '2月', max: 15 },
              { name: '3月', max: 15 },
              { name: '4月', max: 15 },
              { name: '5月', max: 15 },
              { name: '6月', max: 15 },
              { name: '7月', max: 15 },
              { name: '8月', max: 15 },
              { name: '9月', max: 15 },
              { name: '10月', max: 15 },
              { name: '11月', max: 15 },
              { name: '12月', max: 15 },
            ],
          },
          series: [{
            name: '2020 vs 2019',
            type: 'radar',
            tooltip: {
              trigger: 'item',
            },
            data: [
              {
                value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                name: '2020',
                areaStyle: {
                  normal: {
                    color: '#46B9B2',
                  },
                },
              },
              {
                value: [12, 4, 11, 10, 8, 9, 1, 3, 2, 6, 7, 6],
                name: '2019',
                areaStyle: {
                  normal: {
                    color: '#752036',
                  },
                },
              },
            ],
          }],
        },
        {
          title: {
            text: 'NOx排放量企业排名',
            textStyle: {
              color: '#fff',
              fontSize: 16,
            },
          },
          grid: {
            top: 30,
            bottom: 20,
            right: 20,
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'none',
            },
            formatter: params => `${params.name}:${params.value}`,
          },
          xAxis: {
            data: [],
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
          },
          yAxis: {
            splitLine: { show: false },
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
          },
          color: ['#6cb6ab'],
          series: [{
            name: 'hill',
            type: 'pictorialBar',
            barCategoryGap: '-130%',
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            itemStyle: {
              opacity: 0.5,
            },
            label: {
              show: true,
              position: 'top',
              formatter: (obj) => {
                let label = obj.data.value;
                if (obj.dataIndex % 2 !== 0) {
                  label = `${label}\n`;
                }
                return label;
                // const params = `${obj.data.value}`;
                // let newParamsName = '';
                // const paramsNameNumber = params.length;
                // const provideNumber = 4;
                // const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                // if (paramsNameNumber > provideNumber) {
                //   for (let p = 0; p < rowNumber; p++) {
                //     let tempStr = '';
                //     const start = p * provideNumber;
                //     const end = start + provideNumber;
                //     if (p === rowNumber - 1) {
                //       tempStr = params.substring(start, paramsNameNumber);
                //     } else {
                //       tempStr = `${params.substring(start, end)}\n`;
                //     }
                //     newParamsName += tempStr;
                //   }
                // } else {
                //   newParamsName = params;
                // }
                // return newParamsName;
              },
            },
            emphasis: {
              itemStyle: {
                opacity: 1,
              },
            },
            data: [123, 60, 25, 18, 12, 9, 2, 1],
            z: 10,
          }],
        },
      ],
      checkFactor: '',
      factorData: [], // 左侧因子数据
      emissionsData: [], // 右侧选中因子，对应因子雷达数据，企业因子值
    };
  },
  mounted() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.$nextTick(() => {
        if (this.type === 'air') {
          this.getAirFactor();
        } else if (this.type === 'water') {
          this.getWaterFactor();
        }
      });
    },
    drawEchart(option = this.option) {
      this.drawRadarEchart(option[0]);
      this.drawPictorialBarEchart(option[1]);
    },
    drawRadarEchart(option = this.option[0]) {
      const myChart = this.$echarts.init(this.$refs.radarEchart);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    drawPictorialBarEchart(option = this.option[1]) {
      const myChart = this.$echarts.init(this.$refs.pictorialBarEchart);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    onClickFactor(factorCode) {
      this.checkFactor = factorCode;
      if (this.type === 'air') {
        this.getAirEmissions();
      } else if (this.type === 'water') {
        this.getWaterEmissions();
      }
    },

    // 请求事件
    getAirFactor() {
      this.$http.get('redis/AirFactorEmission_s').then((response) => {
        if (response.data.success) {
          this.$set(this, 'factorData', response.data.data || []);
          this.checkFactor = this.factorData[0].factorCode;
          this.getAirEmissions();
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
    getAirEmissions() {
      this.$http.get(`redis/AirFactorEmissionYearOnYear${this.checkFactor}_s`).then((response) => {
        if (response.data.success) {
          this.$set(this, 'emissionsData', response.data.data || []);
          const radarOption = _cloneDeep(this.option[0]);
          const pictorialBarOption = _cloneDeep(this.option[1]);
          const max = Math.max(...[...this.emissionsData.lastYear, ...this.emissionsData.thisYear]);
          const title = `${this.factorData.filter(n => n.factorCode === this.checkFactor)[0]
            .factorName}排放量与${this.emissionsData.data[0]}年同比`;
          radarOption.title.text = title;
          pictorialBarOption.title.text = title;
          radarOption.legend.data = this.emissionsData.data;
          radarOption.radar.indicator = this.emissionsData.time.map(n => ({
            name: `${n}月`,
            max,
          }));
          [radarOption.series[0].data[0].name, radarOption.series[0].data[1].name] = this.emissionsData.data;
          radarOption.series[0].data[0].value = this.emissionsData.thisYear;
          radarOption.series[0].data[1].value = this.emissionsData.lastYear;
          pictorialBarOption.series[0].data = this.emissionsData.top10.map(n => ({ name: n.portName, value: n.cou }));
          this.$nextTick(() => {
            this.drawEchart([radarOption, pictorialBarOption]);
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
    getWaterFactor() {
      this.$http.get('redis/WaterFactorEmission_s').then((response) => {
        if (response.data.success) {
          this.$set(this, 'factorData', response.data.data || []);
          this.checkFactor = this.factorData[0].factorCode;
          this.getWaterEmissions();
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
    getWaterEmissions() {
      this.$http.get(`redis/WaterFactorEmissionYearOnYear${this.checkFactor}_s`).then((response) => {
        if (response.data.success) {
          this.$set(this, 'emissionsData', response.data.data || []);
          const radarOption = _cloneDeep(this.option[0]);
          const pictorialBarOption = _cloneDeep(this.option[1]);
          const max = Math.max(...[...this.emissionsData.lastYear, ...this.emissionsData.thisYear]);
          const title = `${this.factorData.filter(n => n.factorCode === this.checkFactor)[0]
            .factorName}排放量与${this.emissionsData.data[0]}年同比`;
          radarOption.title.text = title;
          pictorialBarOption.title.text = title;
          radarOption.legend.data = this.emissionsData.data;
          radarOption.radar.indicator = this.emissionsData.time.map(n => ({
            name: `${n}月`,
            max,
          }));
          [radarOption.series[0].data[0].name, radarOption.series[0].data[1].name] = this.emissionsData.data;
          radarOption.series[0].data[0].value = this.emissionsData.thisYear;
          radarOption.series[0].data[1].value = this.emissionsData.lastYear;
          pictorialBarOption.series[0].data = this.emissionsData.top10.map(n => ({ name: n.portName, value: n.cou }));
          this.$nextTick(() => {
            this.drawEchart([radarOption, pictorialBarOption]);
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
.factor-emissions {
  height: 100%;
}
</style>
