<template>
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="数据类型：">
        <el-select v-model="queryForm.dataType" style="width: 150px;">
          <el-option
            v-for="item in $enum.get('DATA_TYPE')"
            v-show="item.value !== 'RT'"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据时间：">
        <div v-if="['RT', 'Minute'].includes(queryForm.dataType)">
          <el-date-picker
            popper-class="time-picker"
            style="width: 160px;"
            v-model="queryForm.fromTime"
            type="datetime"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH:00:00"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            popper-class="time-picker"
            style="width: 160px;"
            v-model="queryForm.toTime"
            type="datetime"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH:23:59"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </div>
        <div v-else>
          <el-date-picker
            style="width: 140px;"
            v-model="queryForm.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width: 140px;"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="因子选择：">
        <el-select
          style="width:190px;"
          v-model="queryForm.factorCodes"
          collapse-tags
          multiple
        >
          <el-option
            v-for="(item, key) in factorList"
            :key="key"
            :value="item.factorsCode"
            :label="item.factorsName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <!-- <template v-if="echartsList.length !== 0"> -->
      <el-scrollbar v-loading="loading" class="hide-x" :native="false" :noresize="false" style="height:calc(100% - 39px)">
        <el-row :gutter="10" class="pad-b-sm pad-x-xxl">
          <el-col
            v-for="(item, key) in echartsList"
            :key="key"
            :span="24"
            style="border:1px solid #333"
            class="mar-t-xxl"
          >
            <div :ref="echartsList[key]" style="height:60vh;width: 100%"></div>
          </el-col>
        </el-row>
      </el-scrollbar>
    <!-- </template>
    <template v-else>
      <div style="height: calc(100% - 70px)">123123123</div>
    </template> -->
  </div>
</template>

<script>
import { getDay } from '@/libs/tools';
import { analyzeResp } from '@/global/libs/util';
// 引入 ECharts 主模块
import echarts from 'echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { mapState } from 'vuex';

export default {
  name: 'PaneDataCurve',
  mixins: [],
  props: ['portType'],
  components: {},
  data() {
    return {
      loading: false,
      queryForm: {
        dataType: 'Hour',
        portType: this.portType,
        toDate: getDay(0, false, false),
        fromDate: getDay(-1, false, false),
        toTime: '',
        fromTime: '',
        portId: '',
        factorCodes: [],
        isShowEmissions: true,
      },
      interval: 7, // 设置时间间隔 7天
      factorList: [],
      echartsList: [], // 页面渲染echarts源
      chartData: [],
      chartObj: {},
    };
  },
  computed: {
    ...mapState({
      portInfo: state => state.portInfo,
    }),
  },
  created() {
    this.getFactorList();
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.dataType': function (val) {
      if (val === 'Minute') {
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.queryForm.fromTime = getDay(0);
        this.queryForm.toTime = getDay(0, true, true);
        this.interval = 1; // 设置时间间隔 1天
      } else if (val === 'Hour' || val === 'AuditHour') {
        this.queryForm.fromDate = getDay(-7, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.interval = 7; // 设置时间间隔 7天
      } else if (val === 'Day' || val === 'monthReport') {
        this.queryForm.fromDate = getDay(-30, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.interval = 31; // 设置时间间隔 31天
      }
    },
    // eslint-disable-next-line
    'portInfo.portId'(val) {
      this.getFactorList();
    },
  },
  methods: {
    // 获取因子数据
    getFactorList() {
      // const { dataType } = this.queryForm;
      // this.queryForm.portId = this.portInfo.portId;
      this.$http.get('bas/portInfoFactors', {
        params: {
          portId: this.portInfo.portId,
          page: 1,
          rows: 100000,
          sort: 'factorsName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.factorList = response.data.data.filter(n => n.factorsCode !== 'w00000' && n.factorsCode !== 'a00000') || [];
          this.queryForm.factorCodes = this.factorList.filter(n => n.factorsCode !== 'w00000' && n.factorsCode !== 'a00000')
            .map(factor => factor.factorsCode);
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
        const name = this.factorList.find(factor => factor.factorsCode === code).factorsName;
        const { isZsAvg, unit, unitCou } = this.factorList.find(factor => factor.factorsCode === code);
        this.chartData[code] = {
          Avg: yAxis[`${code.split('-')[0]}-Avg`],
          Cou: yAxis[`${this.portType === 1 ? 'w00000' : 'a00000'}-Cou`],
          ZsAvg: yAxis[`${code.split('-')[0]}-ZsAvg`],
          name,
          isZsAvg,
          unit,
          unitCou,
        };
      });
      this.queryForm.factorCodes.forEach((factor) => {
        this.echartsInit(factor, factor, xAxis, this.chartData[factor]);
      });
    },
    // 获取曲线数据
    getItemList() {
      let stamp = 0;
      this.queryForm.portId = this.portInfo.portId || '';
      let url = 'amcs/dataCurve';
      let queryForm = { ...this.queryForm };
      let groupFactorCode = 'w00000-Cou';
      if (this.queryForm.portType === 1) groupFactorCode = 'w00000-Cou';
      if (this.queryForm.portType === 2) groupFactorCode = 'a00000-Cou';
      if (this.queryForm.dataType === 'monthReport') {
        if (this.queryForm.portType === 1) url = 'amcs/reportCurve/water';
        if (this.queryForm.portType === 2) url = 'amcs/reportCurve/air';
        stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portId: this.queryForm.portId,
          factorCodes: this.queryForm.factorCodes,
          portType: this.queryForm.portType,
          reportType: this.queryForm.dataType,
          groupFactorCode: '',
        };
      } else if (['Minute', 'RT'].includes(this.queryForm.dataType)) {
        stamp = new Date(this.queryForm.toTime).getTime() - new Date(this.queryForm.fromTime).getTime();
        queryForm = {
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          portId: this.queryForm.portId,
          factorCodes: this.queryForm.factorCodes,
          portType: this.queryForm.portType,
          dataType: this.queryForm.dataType,
          groupFactorCode,
        };
      } else {
        stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portId: this.queryForm.portId,
          factorCodes: this.queryForm.factorCodes,
          portType: this.queryForm.portType,
          dataType: this.queryForm.dataType,
          groupFactorCode,
        };
      }
      if (stamp > this.interval * 3600 * 1000 * 24) {
        this.$message.warning(`请选择${this.interval}天内的时间`);
      } else {
        this.queryItemList(url, queryForm);
      }
    },
    queryItemList(url, queryForm) {
      this.loading = true;
      this.$http.post(url, queryForm)
        .then((response) => {
          if (response.data.success) {
            this.echartsList = [...this.queryForm.factorCodes];
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
    echartsInit(obj, dom, xAxis, data) {
      this.$nextTick(() => {
        this.chartObj[obj] = echarts.init(this.$refs[dom] && this.$refs[dom][0]);
        this.chartObj[obj].setOption({
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
              `${this.portType === 1 ? '废水' : '废气'}排放量`,
              `${data.name}平均值`,
              `${this.portType === 2 && data.isZsAvg ? `${data.name}折算平均值` : ''}`,
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
              name: `${data.unit ? `单位（${data.unit}）` : ''}`,
              axisLabel: {
                formatter: '{value}',
              },
            },
            {
              type: 'value',
              name: `${data.unitCou ? `单位（${data.unitCou}）` : ''}`,
              axisLabel: {
                formatter: '{value}',
              },
            },
          ],
          series: [
            {
              name: `${this.portType === 1 ? '废水' : '废气'}排放量`,
              type: 'bar',
              yAxisIndex: 1,    // 双纵坐标
              data: data.Cou,
              itemStyle: {
                color: '#ed7d31',
              },
            },
            {
              name: `${data.name}平均值`,
              type: 'line',
              data: data.Avg,
              showSymbol: false,  // 折线图的拐点
              yAxisIndex: 0,    // 双纵坐标
              itemStyle: {
                color: '#409EFF',
              },
            },
            {
              name: `${data.name}折算平均值`,
              type: 'line',
              data: data.isZsAvg ? data.ZsAvg : [],
              showSymbol: false,  // 折线图的拐点
              yAxisIndex: 0,    // 双纵坐标
              itemStyle: {
                color: '#40edff',
              },
            },
          ],
        });
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
