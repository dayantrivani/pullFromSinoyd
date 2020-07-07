<template>
  <!-- 数据比对曲线 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline class="fn-no-wrap">
        <el-form-item label="行政区域：">
          <select-tree
            style="width: 130px"
            v-model="regionCodeId"
            lazy
            joint
            rootKey="0"
            url="sys/area"
            :props="{ label: 'areaName' }"
          ></select-tree>
        </el-form-item>
        <el-form-item label="站点：">
          <select-port-one
            style="width: 180px;"
            class="mar-l-xs"
            v-model="queryForm.portId"
            filterable
            :options="portList">
          </select-port-one>
        </el-form-item>
        <el-form-item label="因子选择：">
          <el-select style="width:190px;" v-model="queryForm.factorCodes" multiple collapse-tags>
            <el-option
              v-for="(item, key) in factorList"
              :key="key"
              :value="item.factorShowCode"
              :label="item.factorShowName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间：">
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
            value-format="yyyy-MM-dd HH:00:00"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div
      ref="chart"
      style="height: 100%;width: 100%"
      :class="options.series.length === 0 && options.xAxis.length === 0 ? 'empty-data' : ''"
    ></div>
  </el-card>
</template>

<script>
import Echarts from 'echarts';
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import * as cloneDeep from 'lodash/cloneDeep';
import SelectPortOne from './components/SelectPortOne';

export default {
  name: 'DataComparison',
  mixins: [queryList],
  components: { SelectPortOne },
  data() {
    const getOptions = () => ({
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            name: '数据比对曲线',
          },
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        type: 'value',
      },
      series: [],
      // series: [
      //   {
      //     name: '邮件营销',
      //     type: 'line',
      //     stack: '总量',
      //     data: [120, 132, 101, 134, 90, 230, 210],
      //   },
      //   {
      //     name: '联盟广告',
      //     type: 'line',
      //     stack: '总量',
      //     data: [220, 182, 191, 234, 290, 330, 310],
      //   },
      // ],
    });
    return {
      isAuto: false,
      regionCodeId: '', // 行政区域id
      queryForm: {
        factorCodes: [],
        portId: '',
        fromTime: getDay(-1, true, false),
        toTime: getDay(0, true, false),
        portType: this.amcsType,
        sort: 'Tstamp-',
      },
      options: getOptions(),
      pickerOneDate: '',
      factorList: [], // 因子数据
      portList: [], // 站点数据
      pickStart: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerOneDate = minDate.getTime();
          if (maxDate) {
            this.pickerOneDate = '';
          }
          // 但第二次未选择时,maxDate为空, 在第二次选择后, 大小值视情况而定
        },
        // 设置禁用状态，参数为当期日期，要求返回Boolean
        disabledDate: (time) => {
          // 当我点击选中一个日期时
          if (this.pickerOneDate !== '') {
            let date = '';
            let max = '';
            let min = '';
            date = 1 * 24 * 3600000;
            max = this.pickerOneDate + date;
            min = this.pickerOneDate - date;
            return time.getTime() > max || time.getTime() < min || time.getTime() > +new Date();
          }
          // 当我点击选中第二个日期后, 或者点开日期控件时
          return time.getTime() > +new Date();
        },
      },
    };
  },
  created() {
    this.queryForm.portType = this.amcsType;
    this.getPortList();
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
    timeRange: {
      get() {
        return (!this.queryForm.fromTime && !this.queryForm.toTime)
          ? ''
          : [this.queryForm.fromTime, this.queryForm.toTime];
      },
      set(val) {
        [this.queryForm.fromTime, this.queryForm.toTime] = val || ['', ''];
      },
    },
  },
  watch: {
    regionCodeId() {
      this.getPortList();
    },
    // eslint-disable-next-line
    'queryForm.portId': function (val) {
      if (val !== '') {
        this.$nextTick(() => {
          this.getFactorList();
        });
      }
    },
  },
  methods: {
    onBlur() {
      this.pickerOneDate = '';
    },
    drawEcharts() {
      const echart = Echarts.init(this.$refs.chart);
      echart.clear();
      echart.setOption(this.options);
      window.addEventListener('resize', () => { echart.resize(); });
      echart.getZr().on('click', (params) => {
        const pointInPixel = [params.offsetX, params.offsetY];
        if (echart.containPixel('grid', pointInPixel)) {
          // const xIndex = echart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
          // console.log(params, xIndex, echart.getOption());
        }
      });
    },
    getPortList() {              // 获取排口点位列表
      this.queryForm.portId = '';
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          regionCodeId: this.regionCodeId,
          childPortTypes: this.queryForm.childPortType,
          portType: this.amcsType,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.portList = this.handleParentData(cloneDeep(response.data.data), 0);
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    handleParentData(val, iNum) {  // 处理数据
      const field = [
        { name: 'psName', key: 'psId' },
        { name: 'portName', key: 'id' },
      ];
      const valmap = val.map(item => item[field[iNum].key]);
      const arr = [];
      for (let i = 0; i < val.length; i += 1) {
        const arrmap = arr.map(item => item.value);
        if (!arrmap.includes(valmap[i])) {
          const treedata = {};
          this.$set(treedata, 'label', val[i][field[iNum].name]);
          this.$set(treedata, 'value', val[i][field[iNum].key]);
          arr.push(treedata);
        }
      }
      if (iNum < field.length - 1) {
        arr.forEach((item) => {
          this.$set(item, 'children', []);
          val.forEach((op) => {
            if (item.value === op[field[iNum].key]) item.children.push(op);
          });
          if (item.children.length) {
            const num = iNum + 1;
            this.$set(item, 'children', this.handleParentData(item.children, num));
          }
        });
      }
      return arr;
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取因子数据
    getFactorList() {
      this.$http.post('bas/portFactors/valueType', {
        dataType: 'Hour',
        portIds: [this.queryForm.portId],
      }).then((response) => {
        if (response.data.success) {
          this.factorList = response.data.data || [];
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      this.$http.post('audit/dataAuditCurve/single', { ...this.queryForm }).then((response) => {
        if (response.data.success) {
          this.options.xAxis.data = response.data.data.XData;
          // console.log(Object.keys(response.data.data).filter(n => n !== 'XData'), this.factorList);
          // this.options.legend.data = Object.keys(response.data.data).filter(n => n !== 'XData');
          const series = []; // 折线图数据
          const legend = []; // 折线图图例名
          Object.keys(response.data.data).filter(n => n !== 'XData').forEach((ele) => {
            const [factor] = this.factorList.filter(n => ele.includes(n.factorShowCode));
            series.push({
              name: factor.factorShowCode === ele ? factor.factorShowName : `审核${factor.factorShowName}`,
              type: 'line',
              data: response.data.data[ele],
            });
            legend.push(factor.factorShowCode === ele ? factor.factorShowName : `审核${factor.factorShowName}`);
          });
          this.options.series = series;
          this.options.legend.data = legend;
          this.drawEcharts();
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
  },
};
</script>

<style lang="scss" scoped>
</style>
