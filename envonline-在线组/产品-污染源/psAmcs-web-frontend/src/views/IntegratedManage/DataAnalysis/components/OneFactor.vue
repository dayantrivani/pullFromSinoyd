<template>
  <!-- 数据分析 -->
  <div style="height: calc(100% - 25px);">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm fn-no-wrap">
      <el-form-item label="站点类型：">
        <el-select v-model="queryForm.childPortType" @change="onChangeChildPortType">
          <el-option
            v-for="item in childPortTypeList"
            :key="item.value"
            :value="item.dictValue"
            :label="item.dictName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryForm.dataType" style="width: 130px;">
          <el-option
            v-for="item in $enum.get('DATA_TYPE')"
            v-show="['Minute', 'Hour', 'Day'].includes(item.value)"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
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
            value-format="yyyy-MM-dd HH:00:00"
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
      <el-form-item label="站点：">
        <select-port
          v-model="queryForm.portIds"
          filterable
          :options="portList"
          :field="[
            { name: 'psName', key: 'psId' },
            { name: 'portName', key: 'id' }
          ]"
          style="width: 110px">
        </select-port>
        <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="selectPort">站 点</el-button>
      </el-form-item>
      <el-form-item label="因子选择：">
        <el-select style="width:190px;" v-model="queryForm.factorCode">
          <el-option
            v-for="(item, key) in factorList"
            :key="key"
            :value="item.factorShowCode"
            :label="item.factorShowName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <div
      ref="chart"
      style="height:calc(100% - 34px);width: 100%"
      :class="options.series.length === 0 ? 'empty-data' : ''"
    ></div>
    <Transfer-port ref="port" :childPortTypes="[queryForm.childPortType]" @getQueryData="getQueryData"></Transfer-port>
  </div>
</template>

<script>
import Echarts from 'echarts';
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import SelectPort from '@/components/widget/select-port';
import TransferPort from '@/components/widget/transfer-port';

export default {
  name: 'OneFactor',
  mixins: [queryList],
  components: { SelectPort, TransferPort },
  data() {
    const getOptions = () => ({
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
      },
      yAxis: {
        type: 'value',
      },
      series: [],
    });
    return {
      isAuto: false,
      queryForm: {
        factorCode: '',
        portIds: [],
        fromDate: getDay(-2, false, false),
        toDate: getDay(0, false, false),
        fromTime: '',
        toTime: '',
        portType: this.amcsType,
        childPortType: '',
        dataType: 'Hour',
        sort: 'Tstamp-',
      },
      options: getOptions(),
      pickerOneDate: '',
      childPortTypeList: [], // 站点类型
      itemList: [],
      factorList: [], // 因子数据
      portList: [], // 站点数据
    };
  },
  created() {
    this.queryForm.portType = this.amcsType;
    this.getChildPortTypeList();
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
    dateRange: {
      get() {
        return (!this.queryForm.fromDate && !this.queryForm.toDate)
          ? ''
          : [this.queryForm.fromDate, this.queryForm.toDate];
      },
      set(val) {
        [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
      },
    },
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
    // eslint-disable-next-line
    'queryForm.dataType': function (val) {
      if (val === 'RT') {
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.queryForm.fromTime = formatDate(new Date(), 'Y-m-d 22:00:00');
        this.queryForm.toTime = getDay(1, true, false);
      } else if (val === 'Minute') {
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.queryForm.fromTime = formatDate(new Date(), 'Y-m-d 22:00:00');
        this.queryForm.toTime = getDay(1, true, false);
      } else if (val === 'Hour' || val === 'AuditHour') {
        this.queryForm.fromDate = getDay(-2, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
      } else {
        this.queryForm.fromDate = getDay(-7, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
      }
      this.pickerOneDate = '';
    },
    // eslint-disable-next-line
    'queryForm.portIds.length': function (val) {
      if (val !== 0) {
        this.$nextTick(() => {
          this.getFactorList();
        });
      }
    },
  },
  methods: {
    drawEcharts() {
      const echart = Echarts.init(this.$refs.chart);
      echart.clear();
      echart.setOption(this.options);
      window.addEventListener('resize', () => { echart.resize(); });
    },
    getQueryData(portIds) {
      this.queryForm.portIds = portIds || [];
    },
    // 站点选择
    selectPort() {
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortList() {              // 获取排口点位列表
      this.queryForm.portIds = [];
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.queryForm.childPortType,
          portType: this.amcsType,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 改变测点类型
    onChangeChildPortType() {
      this.getPortList();
      this.queryForm.factorCode = ''; // 清空选中因子值
      this.factorList = []; // 因子列表清空
    },
    // 获取测点类型数据
    getChildPortTypeList() {
      this.$http.get(`sys/enumCode/child/PortType/${this.amcsType === 1 ? 'Water' : 'Air'}`).then((response) => {
        if (response.data) {
          this.childPortTypeList = response.data || [];
          this.childPortTypeList = this.childPortTypeList.filter((n) => {
            const childPortTypesArr = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
            return childPortTypesArr.includes(n.dictValue) || childPortTypesArr.includes(n.dictValue - 0);
          });
          this.queryForm.childPortType = this.childPortTypeList[0].dictValue || '';
          this.getPortList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取因子数据
    getFactorList() {
      this.$http.post('bas/portFactors/valueType', {
        dataType: this.queryForm.dataType,
        portIds: this.queryForm.portIds,
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
      if (!this.isInTimerange()) return;
      this.loading = true;
      let queryForm = { ...this.queryForm };
      if (this.queryForm.dataType === 'RT' || this.queryForm.dataType === 'Minute') {
        queryForm = {
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          portIds: this.queryForm.portIds,
          portType: this.queryForm.portType,
          factorCode: this.queryForm.factorCode,
          dataType: this.queryForm.dataType,
        };
      } else {
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          portType: this.queryForm.portType,
          factorCode: this.queryForm.factorCode,
          dataType: this.queryForm.dataType,
        };
      }
      this.$http.post('amcs/dataCurve/multi', queryForm).then((response) => {
        if (response.data.success) {
          this.options.xAxis.data = response.data.data.XData;
          this.options.legend.data = [...Object.keys(response.data.data).filter(n => n !== 'XData').map(n => n.split(':')[0])];
          const series = [];
          Object.keys(response.data.data).filter(n => n !== 'XData').forEach((ele) => {
            series.push({
              name: ele.split(':')[0],
              type: 'line',
              data: response.data.data[ele],
            });
          });
          this.options.series = series;
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

    // 特殊方法
    isInTimerange() { // 判断当前日期跨度是否超过30天
      let count = 2;
      let stamp = 0;
      let res;
      if (this.queryForm.dataType === 'RT' || this.queryForm.dataType === 'Minute') {
        count = 1 / 12;
        stamp = new Date(this.queryForm.toTime).getTime() - new Date(this.queryForm.fromTime).getTime();
      } else {
        if (this.queryForm.dataType === 'Day') {
          count = 7;
        } else if (this.queryForm.dataType === 'Hour') {
          count = 2;
        }
        stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      }
      if (stamp > count * 3600 * 1000 * 24) {
        res = false;
        if (this.queryForm.dataType === 'RT' || this.queryForm.dataType === 'Minute') {
          this.$message.warning(`请选择${count * 24}小时内的时间`);
        } else {
          this.$message.warning(`请选择${count}天内的时间`);
        }
      } else {
        res = true;
      }
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
