<template>
  <div style="color:white;">
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="7">
            <factor-echart style="height:2rem;"
                           :factorData="airfactorData[0]">
            </factor-echart>
          </el-col>
          <el-col :span="7">
            <div ref="radarEchartLeft1"
                 style="height:2rem;"
                 :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
          <el-col :span="10">
            <div ref="pictorialBarEchartLeft1"
                 style="height:2rem;"
                 :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="7">
            <factor-echart style="height:2rem;"
                           :factorData="airfactorData[1]">
            </factor-echart>
          </el-col>
          <el-col :span="7">
            <div ref="radarEchartRight1"
                 style="height:2rem;"
                 :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
          <el-col :span="10">
            <div ref="pictorialBarEchartRight1"
                 style="height:2rem;"
                 :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="7">
            <factor-echart style="height:2rem;"
                           :factorData="waterfactorData[0]">
            </factor-echart>
          </el-col>
          <el-col :span="7">
            <div ref="radarEchartLeft2"
                 style="height:2rem;"
                 :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
          <el-col :span="10">
            <div ref="pictorialBarEchartleft2"
                 style="height:2rem;"
                 :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
                    <el-col :span="7">
            <factor-echart style="height:2rem;"
                           :factorData="waterfactorData[1]">
            </factor-echart>
          </el-col>
          <el-col :span="7">
            <div ref="radarEchartRight2"
                 style="height:2rem;"
                 :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
          <el-col :span="10">
            <div ref="pictorialBarEchartRight2"
                 style="height:2rem;"
                 :class="{ 'empty-box': isEmpty }"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as _cloneDeep from 'lodash/cloneDeep';
import factorEchart from '../components/factorEchart';
import { analyzeResp } from '@/libs/util';

export default {
  name: 'FactorEmissions',
  components: { factorEchart },
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
      checkFactorleft1: '',
      checkFactorRight1: '',
      checkFactorleft2: '',
      checkFactorRight2: '',
      airfactorData: [], // 左侧因子数据
      waterfactorData: [], // 左侧因子数据
      airEmissionsDataLeft: [], // 右侧选中因子，对应因子雷达数据，企业因子值
      waterEmissionsDataLeft: [], // 右侧选中因子，对应因子雷达数据，企业因子值
      airEmissionsDataRight: [], // 右侧选中因子，对应因子雷达数据，企业因子值
      waterEmissionsDataRight: [], // 右侧选中因子，对应因子雷达数据，企业因子值
    };
  },
  mounted() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.$nextTick(() => {
        this.getAirFactor();
        this.getWaterFactor();
      });
    },

    // 请求事件
    getAirFactor() {
      this.$set(this, 'airfactorData', [{
        factorCode: 'a21026',
        factorName: '二氧化硫',
        chemicalFormula: 'SO₂',
        dayCou: 1.5,
        cumulativeCou: 110.9,
        unit: '吨',
      }, {
        factorCode: 'a21002',
        factorName: '氮氧化物',
        chemicalFormula: 'NOx',
        dayCou: 441.5,
        cumulativeCou: 110.9,
        unit: '吨',
      }]);
      this.$http.get('redis/AirFactorEmission_s').then((response) => {
        if (response.data.success) {
          this.$set(this, 'airfactorData', response.data.data || []);
          this.checkFactorleft1 = this.airfactorData[0].factorCode;
          this.checkFactorRight1 = this.airfactorData[1].factorCode;
          this.getAirEmissionsLeft();
          this.getAirEmissionsRight();
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
      this.checkFactorleft1 = this.airfactorData[0].factorCode;
      this.checkFactorRight1 = this.airfactorData[1].factorCode;
      this.getAirEmissionsLeft();
      this.getAirEmissionsRight();
    },
    getAirEmissionsLeft() {
      this.$set(this, 'airEmissionsDataLeft', {
        data: ['2019年', '2020年'],
        time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        lastYear: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        thisYear: [2, 3, 0, 0, 3, 1, 6, 5, 1, 1, 2, 2],
        top10: [{
          portId: '48b807f5-5e66-4116-ad08-b7d120d2eed1',
          portName: '飞翔俱乐部',
          cou: '12334.1',
        }, {
          portId: '48b807f5-5e66-4116-ad08-b7d120d2eed1',
          portName: '飞翔俱乐部',
          cou: '12334.1',
        }],
      });
      this.$http.get(`redis/AirFactorEmissionYearOnYear${this.checkFactorleft1}_s`).then((response) => {
        if (response.data.success) {
          const radarOption = _cloneDeep(this.option[0]);
          const pictorialBarOption = _cloneDeep(this.option[1]);
          this.getRaAarAndPictorialBar(this.airfactorData, this.airEmissionsDataLeft, radarOption, pictorialBarOption, this.checkFactorleft1);
          this.$nextTick(() => {
            this.drawEchartLeft1([radarOption, pictorialBarOption]);
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
      const radarOption = _cloneDeep(this.option[0]);
      const pictorialBarOption = _cloneDeep(this.option[1]);
      this.getRaAarAndPictorialBar(this.airfactorData, this.airEmissionsDataLeft, radarOption, pictorialBarOption, this.checkFactorleft1);
      this.$nextTick(() => {
        this.drawEchartLeft1([radarOption, pictorialBarOption]);
      });
    },
    getAirEmissionsRight() {
      this.$set(this, 'airEmissionsDataRight', {
        data: ['2019年', '2020年'],
        time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        lastYear: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        thisYear: [2, 3, 0, 0, 3, 1, 6, 5, 1, 1, 2, 2],
        top10: [{
          portId: '48b807f5-5e66-4116-ad08-b7d120d2eed1',
          portName: '飞翔俱乐部',
          cou: '12334.1',
        }, {
          portId: '48b807f5-5e66-4116-ad08-b7d120d2eed1',
          portName: '飞翔俱乐部',
          cou: '12334.1',
        }],
      });
      this.$http.get(`redis/AirFactorEmissionYearOnYear${this.checkFactorRight1}_s`).then((response) => {
        if (response.data.success) {
          const radarOption = _cloneDeep(this.option[0]);
          const pictorialBarOption = _cloneDeep(this.option[1]);
          this.getRaAarAndPictorialBar(this.airfactorData, this.airEmissionsDataRight, radarOption, pictorialBarOption, this.checkFactorRight1);
          this.$nextTick(() => {
            this.drawEchartRight1([radarOption, pictorialBarOption]);
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
      const radarOption = _cloneDeep(this.option[0]);
      const pictorialBarOption = _cloneDeep(this.option[1]);
      this.getRaAarAndPictorialBar(this.airfactorData, this.airEmissionsDataRight, radarOption, pictorialBarOption, this.checkFactorRight1);
      this.$nextTick(() => {
        this.drawEchartRight1([radarOption, pictorialBarOption]);
      });
    },
    getWaterFactor() {
      this.$set(this, 'waterfactorData', [{
        factorCode: 'w01018',
        factorName: '化学需氧量',
        chemicalFormula: 'COD',
        dayCou: 41.5,
        cumulativeCou: 55.9,
        unit: '吨',
      }, {
        factorCode: 'w21003',
        factorName: '氨氮',
        chemicalFormula: '氨氮',
        dayCou: 21.5,
        cumulativeCou: 21.9,
        unit: '吨',
      }]);
      this.$http.get('redis/WaterFactorEmission_s').then((response) => {
        if (response.data.success) {
          this.$set(this, 'airfactorData', response.data.data || []);
          this.checkFactorleft2 = this.waterfactorData[0].factorCode;
          this.checkFactorRight2 = this.waterfactorData[1].factorCode;
          this.getWaterEmissionsLeft();
          this.getWaterEmissionsRight();
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
      this.checkFactorleft2 = this.waterfactorData[0].factorCode;
      this.checkFactorRight2 = this.waterfactorData[1].factorCode;
      this.getWaterEmissionsLeft();
      this.getWaterEmissionsRight();
    },
    getWaterEmissionsLeft() {
      this.$set(this, 'waterEmissionsDataLeft', {
        data: ['2019年', '2020年'],
        time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        lastYear: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        thisYear: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        top10: [{
          portId: '48b807f5-5e66-4116-ad08-b7d120d2eed1',
          portName: '飞翔俱乐部',
          cou: '12334.1',
        }, {
          portId: '48b807f5-5e66-4116-ad08-b7d120d2eed1',
          portName: '飞翔俱乐部',
          cou: '12334.1',
        }],
      });
      this.$http.get(`redis/WaterFactorEmissionYearOnYear${this.checkFactorleft2}_s`).then((response) => {
        if (response.data.success) {
          this.$set(this, 'waterEmissionsDataLeft', response.data.data || []);
          const radarOption = _cloneDeep(this.option[0]);
          const pictorialBarOption = _cloneDeep(this.option[1]);
          this.getRaAarAndPictorialBar(this.waterfactorData, this.waterEmissionsDataLeft, radarOption, pictorialBarOption, this.checkFactorleft2);
          this.$nextTick(() => {
            this.drawEchartLeft2([radarOption, pictorialBarOption]);
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
      const radarOption = _cloneDeep(this.option[0]);
      const pictorialBarOption = _cloneDeep(this.option[1]);
      this.getRaAarAndPictorialBar(this.waterfactorData, this.waterEmissionsDataLeft, radarOption, pictorialBarOption, this.checkFactorleft2);
      this.$nextTick(() => {
        this.drawEchartleft2([radarOption, pictorialBarOption]);
      });
    },
    getWaterEmissionsRight() {
      this.$set(this, 'waterEmissionsDataRight', {
        data: ['2019年', '2020年'],
        time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        lastYear: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        thisYear: [2, 3, 0, 0, 3, 1, 5, 5, 1, 1, 2, 2],
        top10: [{
          portId: '48b807f5-5e66-4116-ad08-b7d120d2eed1',
          portName: '飞翔俱乐部',
          cou: '12334.1',
        }, {
          portId: '48b807f5-5e66-4116-ad08-b7d120d2eed1',
          portName: '飞翔俱乐部',
          cou: '12334.1',
        }],
      });
      this.$http.get(`redis/WaterFactorEmissionYearOnYear${this.checkFactorRight2}_s`).then((response) => {
        if (response.data.success) {
          this.$set(this, 'waterEmissionsDataRight', response.data.data || []);
          const radarOption = _cloneDeep(this.option[0]);
          const pictorialBarOption = _cloneDeep(this.option[1]);
          this.getRaAarAndPictorialBar(this.waterfactorData, this.waterEmissionsDataRight, radarOption, pictorialBarOption, this.checkFactorRight2);
          this.$nextTick(() => {
            this.drawEchartRight2([radarOption, pictorialBarOption]);
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
      const radarOption = _cloneDeep(this.option[0]);
      const pictorialBarOption = _cloneDeep(this.option[1]);
      this.getRaAarAndPictorialBar(this.waterfactorData, this.waterEmissionsDataRight, radarOption, pictorialBarOption, this.checkFactorRight2);
      this.$nextTick(() => {
        this.drawEchartRight2([radarOption, pictorialBarOption]);
      });
    },
    // 第一组
    drawEchartLeft1(option = this.option) {
      this.drawRadarEchartLeft1(option[0]);
      this.drawPictorialBarEchartLeft1(option[1]);
    },
    drawPictorialBarEchartLeft1(option = this.option[1]) {
      const myChart = this.$echarts.init(this.$refs.pictorialBarEchartLeft1);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    drawRadarEchartLeft1(option = this.option[0]) {
      const myChart = this.$echarts.init(this.$refs.radarEchartLeft1);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // 第二组
    drawEchartRight1(option = this.option) {
      this.drawRadarEchartRight1(option[0]);
      this.drawPictorialBarEchartRight1(option[1]);
    },
    drawRadarEchartRight1(option = this.option[0]) {
      const myChart = this.$echarts.init(this.$refs.radarEchartRight1);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    drawPictorialBarEchartRight1(option = this.option[1]) {
      const myChart = this.$echarts.init(this.$refs.pictorialBarEchartRight1);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // 第三组
    drawEchartleft2(option = this.option) {
      this.drawRadarEchartleft2(option[0]);
      this.drawPictorialBarEchartleft2(option[1]);
    },
    drawRadarEchartleft2(option = this.option[0]) {
      const myChart = this.$echarts.init(this.$refs.radarEchartLeft2);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    drawPictorialBarEchartleft2(option = this.option[1]) {
      const myChart = this.$echarts.init(this.$refs.pictorialBarEchartleft2);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // 第四组
    drawEchartRight2(option = this.option) {
      this.drawRadarEchartRight2(option[0]);
      this.drawPictorialBarEchartRight2(option[1]);
    },
    drawRadarEchartRight2(option = this.option[0]) {
      const myChart = this.$echarts.init(this.$refs.radarEchartRight2);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    drawPictorialBarEchartRight2(option = this.option[1]) {
      const myChart = this.$echarts.init(this.$refs.pictorialBarEchartRight2);
      myChart.clear();
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    getRaAarAndPictorialBar(factorData, emissionsData, radarOption, pictorialBarOption, checkFactor) {
      const max = Math.max(...[...emissionsData.lastYear, ...emissionsData.thisYear]);
      const title = `${factorData.filter(n => n.factorCode === checkFactor)[0].factorName}排放量与${emissionsData.data[0]}年同比`;
      radarOption.title.text = title;
      pictorialBarOption.title.text = title;
      radarOption.legend.data = emissionsData.data;
      radarOption.radar.indicator = emissionsData.time.map(n => ({
        name: `${n}月`,
        max,
      }));
      [radarOption.series[0].data[0].name, radarOption.series[0].data[1].name] = emissionsData.data;
      radarOption.series[0].data[0].value = emissionsData.lastYear;
      radarOption.series[0].data[1].value = emissionsData.thisYear;
      pictorialBarOption.series[0].data = emissionsData.top10.map(n => ({ name: n.portName, value: n.cou }));
    },
  },
};
</script>

<style lang="scss" scoped>
.factor-emissions {
  height: 100%;
}
</style>
