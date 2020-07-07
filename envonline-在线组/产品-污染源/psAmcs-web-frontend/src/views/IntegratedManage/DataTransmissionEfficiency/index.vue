<!-- 数据传输有效率 -->
<template>
  <el-card>
    <template slot="header">
      <!-- 查询表单 -->
      <el-form :model="queryForm" inline>
        <el-form-item label="时间：">
          <el-date-picker
            style="width:140px"
            v-model="queryForm.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width:140px"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="时间：">
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            v-model="dateRange"
          ></el-date-picker>
        </el-form-item> -->

        <date-num v-model="queryForm.ye" :keyPollutant="queryForm.keyPollutant"/>

        <!-- <el-form-item label="监管级别：">
          <el-select style="width: 150px" clearable v-model="queryForm.keyPollutant">
            <el-option label="全部" :value="-1"></el-option>
            <el-option
              v-for="item in $enum.get('KEY_POLLUTANT')"
              :key="item.value"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="queryForm.keyPollutant === 1" label="年份：">
          <el-date-picker
            style="width: 100px"
            v-model="queryForm.ye"
            value-format="yyyy"
            type="year"
            :clearable="false"
            placeholder="选择年份">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="站点：">
          <select-port
            v-model="queryForm.portIds"
            filterable
            :options="portList"
            :field="[
              { name: 'psName', key: 'psId' },
              { name: 'portName', key: 'id' }
            ]">
          </select-port>
          <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="selectPort">站 点</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      @expand-change="expandChange"
      @selection-change="onChangeSelected"
    >
      <el-table-column type="expand">
        <template>
          <div ref="chart" style="height:500px;"></div>
        </template>
      </el-table-column>
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="区域" prop="regionName" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" show-overflow-tooltip min-width="160"></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="传输率" prop="dataTransfer" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="有效率" prop="dataEffective" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="传输有效率" prop="dataTransferEffective" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <div
            :style="{
              'position': 'relative',
              'color': 'inherit',
              'width': '100%',
              'height': '15px',}"
            :class="{
              'bg-success': parseInt(row.dataTransferEffective) === 100,
              'bg-danger': parseInt(row.dataTransferEffective) < 90,
              'bg-warning': 90 <= parseInt(row.dataTransferEffective) && parseInt(row.dataTransferEffective) < 100
            }"
          >
            <div :style="{
              'position': 'absolute',
              'left': '0px',
              'top': '0px',
              'width': `${row.dataTransferEffective}`,
              'height': '100%',}"
              :class="{
                'bg-success': parseInt(row.dataTransferEffective) > 95,
                'bg-danger': parseInt(row.dataTransferEffective) < 85,
                'bg-warning': 85 <= parseInt(row.dataTransferEffective) && parseInt(row.dataTransferEffective) <= 95
              }"
            ></div>
            <div :style="{
              'position': 'absolute',
              'right': '0px',
              'top': '0px',
              'background-color': '#f7f7f7',
              'height': '100%',
              'width': `${100 - parseInt(row.dataTransferEffective)}%`,
            }"></div>
            <span :style="{
              'position': 'absolute',
              'left': '50%',
              'top': '50%',
              'transform': 'translate(-50%, -50%)'}"
            >{{ row.dataTransferEffective }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <Transfer-port ref="port" :keyPollutant="queryForm.keyPollutant" @getQueryData="getQueryData"></Transfer-port>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
// 引入 ECharts 主模块
import echarts from 'echarts';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import SelectPort from '@/components/widget/select-port';
import TransferPort from '@/components/widget/transfer-port';
import DateNum from '@/components/widget/date-num';
// import SelectStation from './components/SelectStation';

export default {
  name: 'DataTransmissionEfficiency',
  mixins: [queryList],
  provide() {                         // 仅用于监管级别date-num组件
    return { app: this };
  },
  components: { SelectPort, TransferPort, DateNum },
  // components: { SelectStation },
  // inheritAttrs: false,
  data() {
    return {
      isAuto: false,
      queryForm: {
        fromDate: getDay(-1, false, false),
        portIds: [],
        toDate: getDay(-1, false, false),
        isAll: true,
        portType: '',
        keyPollutant: -1,
        ye: -1,
        childPortTypes: [],
      },
      downloading: false,
      chartData: {},
      options: {
        dataZoom: [ // 缩放
          {
            type: 'inside',
          },
          {
            type: 'slider',
          },
        ],
        title: {
        // text: '折线图堆叠',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [],
          left: '100',
          top: '20',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            margin: 15,   // x轴文字与坐标轴之间的间距
          },
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [],
      },
      portList: [],
    };
  },
  created() {
    this.queryForm.portType = this.amcsType;
    this.queryForm.childPortTypes = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
    this.getPortList();
    this.getItemList();
  },
  mounted() {
    this.$nextTick(() => {
      this.echartsInit();
    });
  },
  computed: {
    amcsType() {
      return this.$store.state.auth.amcsType;
    },
    dateRange: {
      get() {
        let date = '';
        if (this.queryForm.fromDate === '1900-01-01 00:00:00' && this.queryForm.toDate === '1900-01-01 00:00:00') {
          date = '';
        } else if (!this.queryForm.fromDate && !this.queryForm.toDate) {
          date = '';
        } else {
          date = [this.queryForm.fromDate, this.queryForm.toDate];
        }
        return date;
      },
      set(val) {
        [this.queryForm.fromDate, this.queryForm.toDate] = val || ['1900-01-01 00:00:00', '1900-01-01 00:00:00'];
      },
    },
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this.queryForm, 'isAll', false);
        } else {
          this.$set(this.queryForm, 'isAll', true);
        }
      },
      deep: true,
    },
    // eslint-disable-next-line
    'queryForm.keyPollutant': function () {
      this.getPortList();
    },
  },
  methods: {
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    expandChange(row, expandedRows) {
      if (!expandedRows.length) { return; }
      const { fromDate, toDate } = this.queryForm;
      const queryParams = {
        fromDate,
        toDate,
        portId: row.portId,
      };
      this.getChartData(queryParams);
    },
    onChangeCheck(val) { // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    getQueryData(portIds) {
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },
    // 站点选择
    selectPort() {
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    // 获取图表数据
    getChartData(params = {}) {
      this.$http.get('amcs/dataTransferEffective/curve', { params })
        .then((response) => {
          if (response.data.success) {
            this.chartData = response.data.data;
            this.handleData(this.chartData);
            this.$nextTick(() => {
              this.echartsInit();
            });
          } else {
            this.$message({
              type: 'warning',
              message: response.data,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
    // 处理曲线数据
    handleData(source) {
      const { XData, ...yAxis } = source;
      const legend = Object.keys(yAxis).map(n => n.split(':')[0]);
      const entry = Object.entries(yAxis);
      const series = [];
      entry.forEach((e) => {
        const [n, item] = e;
        const name = n ? n.split(':')[0] : '';
        const data = item.map(m => m.substr(0, m.length - 1));
        series.push({ name, data, type: 'line' });
      });
      this.options.series = series;
      this.options.legend.data = legend;
      this.options.xAxis.data = XData;
    },
    onDownload() {
      this.downloading = true;
      const { page, rows } = this.pager;
      this.$http.post('amcs/dataTransferEffective/export', this.queryForm, {
        'responseType': 'blob',
        params: { page, rows },
      }).then((response) => {
        const filename = `数据传输有效率${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post('amcs/dataTransferEffective', this.queryForm, {
        params: { page, rows },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
    // 获取站点
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          keyPollutant: this.queryForm.keyPollutant,
          childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES', this.amcsType),
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
    // 初始化echarts
    echartsInit() {
      this.Chart = echarts.init(this.$refs.chart);
      this.Chart.setOption(this.options);
      window.addEventListener('resize', () => {
        this.Chart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
