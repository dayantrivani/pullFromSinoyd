<template>
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="数据类型：">
        <el-select v-model="valueType" style="width: 150px;">
          <el-option
            v-for="item in $enum.get('DATA——VALUE_TYPE')"
            v-show="(queryForm.dataType === 'RT' ? item.value : 2) === 2"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据值类型：">
        <el-select v-model="queryForm.dataType" style="width: 150px;">
          <el-option
            v-for="item in $enum.get('DATA_TYPE')"
            :key="item.value"
            v-show="['Hour', 'RT', 'Day'].includes(item.value)"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据时间：">
        <el-date-picker
          style="width: 140px"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width: 140px"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="因子：">
        <el-select
          style="width:180px;"
          v-model="queryForm.factorCodes"
          multiple
          collapse-tags
          clearable
        >
          <el-option-group
            v-for="(item, key) in factorGroup"
            :key="key"
            :label="item.name">
            <el-option
              v-for="(ele, index) in item.children"
              :key="index"
              :label="ele.factorShowName"
              :value="ele.factorShowCode">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <el-scrollbar v-loading="loading" class="hide-x" :native="false" :noresize="false" style="height:calc(100% - 70px)">
      <el-row :gutter="10" class="pad-b-sm pad-x-xxl">
        <el-col
          v-for="item in queryForm.factorCodes"
          :key="`${item}${valueType}`"
          :span="24"
          class="mar-y-xl"
        >
          <div
            v-if="valueType !== 0 || item !== 'w00000-Cou'"
            :ref="item"
            style="height:60vh;width: 100%;border:1px solid #333"></div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import echarts from 'echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { mapState } from 'vuex';
import { getDay, toFactorTree } from '@/libs/tools';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'PaneDataCurve',
  mixins: [],
  props: ['portType'],
  components: {},
  data() {
    return {
      loading: false,
      valueType: 0, // 数据类型
      queryForm: {
        dataType: 'Hour',
        toDate: getDay(0, false, false),
        fromDate: getDay(-2, false, false),
        toTime: '',
        fromTime: '',
        portId: '',
        factorCodes: [],
      },
      interval: 2, // 设置时间间隔 2天
      factorList: [],
      chartData: [],
      chartObj: {},
    };
  },
  computed: {
    ...mapState({
      portInfo: state => state.portInfo,
    }),
    factorGroup() {                                   // 因子列表数据分组
      return toFactorTree(this.factorList);
    },
  },
  watch: {
    valueType() {
      this.getFactorList();
    },
    // eslint-disable-next-line
    'queryForm.dataType': function (val) {
      if (val === 'RT') {
        this.queryForm.fromDate = getDay(-1, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.valueType = 2;
        this.interval = 1; // 设置时间间隔 1天
      } else if (val === 'Hour' || val === 'AuditHour') {
        this.queryForm.fromDate = getDay(-2, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.interval = 2; // 设置时间间隔 2天
      } else {
        this.queryForm.fromDate = getDay(-7, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.interval = 7; // 设置时间间隔 7天
      }
      if (val === 'RT') {
        if (this.factorAction !== 2) {
          this.getFactorList();
        }
        this.factorAction = 2;
      } else {
        if (this.factorAction !== 1) {
          this.getFactorList();
        }
        this.factorAction = 1;
      }
    },
    // eslint-disable-next-line
    'portInfo.portId'(val) {
      this.queryForm.portId = val;
      this.getFactorList();
    },
  },
  methods: {
    onTabClick() {
      this.queryForm.portId = this.portInfo.portId;
      this.getFactorList();
      Object.keys(this.chartObj).forEach((element) => {
        this.chartObj[element].resize();
      });
    },
    // 获取因子数据
    getFactorList() {
      this.$http.post('bas/portFactors/valueType', {
        portIds: [this.queryForm.portId || this.portInfo.portId || ''],
        dataType: this.queryForm.dataType,
        sort: 'factorsName-',
      }).then((response) => {
        if (response.data.success) {
          if (this.valueType === 1) {
            this.factorList = response.data.data.filter(n => n.valueType === 'Cou') || [];
            this.queryForm.factorCodes = this.factorList.filter(n => n.valueType === 'Cou').map(n => n.factorShowCode);
          } else if (this.valueType === 2) {
            this.factorList = response.data.data.filter(n => n.valueType === 'Avg' || n.valueType === 'Rtd') || [];
            this.queryForm.factorCodes = this.factorList.filter(n => n.valueType === 'Avg' || n.valueType === 'Rtd')
              .map(n => n.factorShowCode);
          } else {
            this.factorList = response.data.data.filter(n => n.valueType === 'Avg') || [];
            this.queryForm.factorCodes = this.factorList.filter(n => n.valueType === 'Avg').map(n => n.factorShowCode);
          }
          this.getItemList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 处理曲线数据
    handleData(source) {
      this.chartData = {};
      if (!this.queryForm.factorCodes.length) { return; }
      const { XData, ...yAxis } = source;
      const xAxis = XData || [];
      // 图表的纵坐标
      this.queryForm.factorCodes.forEach((code) => {
        const factorItem = this.factorList.find(factor => factor.factorShowCode === code);
        if (this.valueType === 1) {
          this.chartData[code] = {
            data: yAxis[code],
            type: 'bar',
            name: factorItem.factorShowName,
            unit: `单位（${factorItem.unit ? factorItem.unit : '无'}）`,
          };
        } else if (this.valueType === 2) {
          this.chartData[code] = {
            data: yAxis[code],
            type: 'line',
            name: this.factorList.find(factor => factor.factorShowCode === code).factorShowName,
            unit: code === 'w00000-Avg' ? '单位（l/m）' : '单位（mg/l）',
          };
        } else if (code !== 'w00000-Cou') {
          this.chartData[code] = {
            data: yAxis[code],
            type: 'line',
            name: this.factorList.find(factor => factor.factorShowCode === code).factorShowName,
            unit: '单位（mg/l）',
          };
        }
      });
      this.queryForm.factorCodes.forEach((factor) => {
        if (this.valueType === 0) {
          if (factor !== 'w00000-Cou') {
            this.echartsInit(factor, factor, xAxis, this.chartData[factor], {
              data: yAxis['w00000-Cou'],
              type: 'bar',
              name: '污水排放量',
              unit: '单位（m³）',
            });
          }
        } else {
          this.echartsInit(factor, factor, xAxis, this.chartData[factor]);
        }
      });
    },
    getItemList() {
      const stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      if (stamp > this.interval * 3600 * 1000 * 24) {
        this.$message.warning(`请选择${this.interval}天内的时间`);
      } else {
        this.queryItemList();
      }
    },
    // 获取曲线数据
    queryItemList() {
      this.loading = true;
      const factorCodes = [...this.queryForm.factorCodes];
      if (+this.valueType === 0) {
        if (!factorCodes.includes('w00000-Cou')) factorCodes.push('w00000-Cou');
      }
      this.$http.post('tpeci/historyData/curve',  { ...this.queryForm, factorCodes })
        .then((response) => {
          if (response.data.success) {
            this.itemList = response.data.data;
            this.handleData(this.itemList);
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
    },
    echartsInit(obj, dom, xAxis, data, Cou) {
      this.$nextTick(() => {
        this.chartObj[obj] = echarts.init(this.$refs[dom] && this.$refs[dom][0]);
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
          },
          dataZoom: [ // 缩放
            {
              type: 'inside',
            },
            // {
            //   type: 'slider',
            // },
          ],
          grid: {
            left: '70',
            right: '60',
            top: '60',
            bottom: '120',
          },
          // title: {
          //   text: data.name,
          //   align: 'center',
          //   x: 'center',
          //   y: '10',
          // },
          legend: {
            data: [
              data.name,
            ],
            right: '200',
            top: '20',
          },
          xAxis: {
            type: 'category',
            data: xAxis,
            // axisLabel: {
            //   formatter(value) {
            //     return `{value|${value}}`;
            //   },
            //   rotate: 50,   // x轴文字旋转角度
            //   margin: 15,   // x轴文字与坐标轴之间的间距
            //   rich: {
            //     value: {
            //       align: 'right',
            //     },
            //   },
            // },
          },
          yAxis: [
            {
              type: 'value',
              name: data.unit,
              axisLabel: {
                formatter: '{value}',
              },
            },
          ],
          series: [
            {
              name: data.name,
              type: data.type,
              data: data.data,
              showSymbol: false,  // 折线图的拐点
              yAxisIndex: 0,    // 双纵坐标
              itemStyle: {
                color: '#409EFF',
              },
            },
          ],
        };
        if (Cou) {
          option.legend.data.push(Cou.name);
          option.yAxis.push({
            type: 'value',
            name: Cou.unit,
            axisLabel: {
              formatter: '{value}',
            },
          });
          option.series.push({
            name: Cou.name,
            type: Cou.type,
            data: Cou.data,
            yAxisIndex: 1,    // 双纵坐标
            itemStyle: {
              color: '#ed7d31',
            },
          });
        }
        this.chartObj[obj].setOption(option);
      });
      window.addEventListener('resize', () => {
        this.chartObj[obj].resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
