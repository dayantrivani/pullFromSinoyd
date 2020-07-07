<template>
  <!-- 废水/废气报表统计 -->
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-x-sm">
      <el-form-item label="数据类型：">
        <el-select v-model="queryForm.reportType" style="width: 150px;">
          <el-option
            v-for="item in select.reportTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </el-form-item>

      <!--
        当数据类型为日报表 - 精确到日
        月报表 - 精确到月
        年报表 - 精确到年
        季报表 - 精确到年 当数据类型为季报表 - 下拉框选择季度
      -->
      <el-form-item>
        <el-date-picker
          v-model="vmodeldate"
          v-if="type === 'date'"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          style="width: 140px;"
          :picker-options="pickerOption"
          :clearable="false">
        </el-date-picker>
        <el-date-picker
          v-model="vmodelmonth"
          v-if="type === 'month'"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          style="width: 113px;"
          :picker-options="pickerOption"
          :clearable="false">
        </el-date-picker>
        <el-date-picker
          v-model="vmodelyear"
          v-if="type === 'year'"
          type="year"
          style="width: 94px;"
          :picker-options="pickerOption"
          :clearable="false">
        </el-date-picker>
      </el-form-item>

      <el-form-item v-show="isShowQuarter">
        <el-select v-model="quarterLevel" style="width: 150px;">
          <el-option
            v-for="(item, index) in select.quarterLevelList"
            :key="index"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </el-form-item>

      <date-num v-model="queryForm.ye" :keyPollutant="queryForm.keyPollutant"/>

      <el-form-item label="站点：">
        <select-port
          width="180px"
          v-model="queryForm.portIds"
          filterable
          :options="portList"
          :field="[
            { name: 'psName', key: 'psId' },
            { name: 'portName', key: 'id' }
          ]">
        </select-port>
        <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="openTransfer">站 点</el-button>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button class="mar-l-sm" type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>

    <div :model="queryForm" inline class="mar-b-xs mar-x-sm">
      <el-button
        type="primary"
        icon="fas fa-download"
        :loading="downloading"
        :disabled="!selectedIds.length"
        @click="onDownload"
      >批量导出
      </el-button>
      <el-button
        type="primary"
        icon="far fa-copy"
        :loading="fileloading"
        :disabled="!selectedIds.length"
        @click="onOrganizeFiles"
      >归档</el-button>
      <el-button type="primary" icon="fas fa-user-cog" @click="onCustomExport">自定义导出</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 66px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="40"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" width="116">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-eye" @click="onClickPreview(scope.row)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="180px" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column label="起始时间" prop="beginTime" min-width="160px" show-overflow-tooltip></el-table-column>
      <el-table-column label="结束时间" prop="endTime" min-width="160px" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <form-down-load ref="dialogform" :portType="amcsType"/>
    <item-preview ref="dialogitem" :portType="amcsType" :query="queryForm"/>
    <Transfer-port ref="port" @getQueryData="getPortIdsList" />
  </el-card>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import SelectPort from '@/components/widget/select-port';
import TransferPort from '@/components/widget/transfer-port';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import FormDownLoad from './components/FormDownLoad.vue';
import ItemPreview from './components/ItemPreview.vue';
import DateNum from '@/components/widget/date-num';

export default {
  name: 'StatisticsReport',
  mixins: [queryList],
  provide() {                       // 仅用于监管级别date-num组件
    return { app: this };
  },
  components: {
    FormDownLoad,
    ItemPreview,
    SelectPort,
    TransferPort,
    DateNum,
  },
  data() {
    return {
      isAuto: false,
      loading: false,            // 列表加载
      downloading: false,        // 导出加载
      fileloading: false,        // 归档加载
      isShowQuarter: false,      // 是否显示季度下拉框

      vmodeldate: '',            // 日报表日期控件绑定的值
      vmodelmonth: '',           // 月报表日期控件绑定的值
      vmodelyear: null,          // 季度or年报表日期控件绑定的值
      type: 'date',              // 日期类型决定显示的日期控件类型

      quarterLevel: 1,           // 第几季度
      quarterList: {             // 季度月日后缀
        1: { form: '-01-01', to: '-03-31' },
        2: { form: '-04-01', to: '-06-30' },
        3: { form: '-07-01', to: '-09-30' },
        4: { form: '-10-01', to: '-12-31' },
      },
      select: {                  // 选择框查询条件
        quarterLevelList: this.$enum.get('QUARTER_LEVEL'), // 季度列表
        reportTypeList: this.$enum.get('REPORT_TYPE'),     // 数据类型（报表）
      },
      portList: [],              // 站点列表
      queryForm: {               // 列表查询条件
        ye: -1,                  // 监管年份 监管级别为-1、0时,该值固定为-1
        isAll: true,             // 是否选中所有站点
        portIds: [],             // 下拉框站点
        reportType: 'dayReport', // 数据类型
        fromDate: '',            // 开始时间
        toDate: '',              // 结束时间
        keyPollutant: -1,        // 监管级别 -1 全部 1 重点 0 非重点
      },
      queryReport: {},           // 点击查询时记录查询时的查询条件
      itemList: [],              // 列表数据
      pickerOption: {            // 年月日
        disabledDate: val => val.getTime() > new Date().getTime(),
      },
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  watch: {
    queryForm: {                      // 监控站点
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this.queryForm, 'isAll', false);
        } else {
          this.$set(this.queryForm, 'isAll', true);
        }
      },
      deep: true,
    },

    /** 以下代码用于监控数据类型变化导致的日期变化
     * --------------------------------------
     */
    'queryForm.reportType': {         // 监控数据类型
      handler(val) {
        this.itemList = [];
        this.vmodeldate = '';
        this.vmodelmonth = '';
        this.vmodelyear = null;
        this.isShowQuarter = false;
        this.pager.page = 1;        // 列表重回第一页
        this.quarterLevel = 1;      // 当前季度季度
        let type = '';              // 控件格式
        const date = new Date();    // 当前时间
        /**
         *  dayReport 日报表
         *  monthReport 月报表
         *  quarterReport 季度报表
         *  yearReport 年报表
        */
        if (val === 'dayReport') {
          type = 'date';
          this.vmodeldate = getDay(-1, false);
        } else if (val === 'monthReport') {
          type = 'month';
          this.vmodelmonth = this.getCurrentYearMonth(date);
        } else if (val === 'quarterReport') {
          type = 'year';
          this.isShowQuarter = true;
          this.vmodelyear = date;
        } else if (val === 'yearReport') {
          type = 'year';
          this.vmodelyear = date;
        }
        this.$set(this, 'type', type);
        this.$set(this.queryForm, 'portIds', []);
        this.$set(this.queryForm, 'isAll', true);
        this.getItemList();
      },
    },
    vmodeldate(val) {
      if (!val) return;
      if (this.queryForm.reportType !== 'dayReport') return;
      this.$set(this.queryForm, 'fromDate', val);
      this.$set(this.queryForm, 'toDate', val);
    },
    vmodelmonth(val) {
      if (!val) return;
      if (this.queryForm.reportType !== 'monthReport') return;
      const from = this.getCurrentMonthFirstDay(new Date(val.replace(/-/g, '/')));
      const to = this.getCurrentMonthLastDay(new Date(val.replace(/-/g, '/')));
      this.$set(this.queryForm, 'fromDate', from);
      this.$set(this.queryForm, 'toDate', to);
    },
    vmodelyear(val) {
      if (!val) return;
      if (this.queryForm.reportType === 'quarterReport') {
        this.quarterLevel = Math.ceil((new Date().getMonth() + 1) / 3);
        this.$set(this.queryForm, 'fromDate', `${val.getFullYear()}${this.quarterList[this.quarterLevel].form}`);
        this.$set(this.queryForm, 'toDate', `${val.getFullYear()}${this.quarterList[this.quarterLevel].to}`);
      } else if (this.queryForm.reportType === 'yearReport') {
        this.$set(this.queryForm, 'fromDate', `${val.getFullYear()}-01-01`);
        this.$set(this.queryForm, 'toDate', `${val.getFullYear()}-12-31`);
      }
    },
    quarterLevel(val) {
      this.$set(this.queryForm, 'fromDate', `${this.vmodelyear.getFullYear()}${this.quarterList[val].form}`);
      this.$set(this.queryForm, 'toDate', `${this.vmodelyear.getFullYear()}${this.quarterList[val].to}`);
    },
  },
  created() {
    this.vmodeldate = getDay(-1, false);
    this.getPortList();
    this.getItemList();
  },
  methods: {
    onChangeCheck(val) {        // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    openTransfer() {            // 穿梭框方法 -- 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortIdsList(portIds) {   // 站点穿梭框方法 -- 获取已选站点 id 的集合
      /** 穿梭框选择站点确认后触发列表查询 */
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },
    onCustomExport() {          // 自定义导出
      this.$refs.dialogform.openDialog();
    },
    onClickPreview(row) {       // 预览
      this.$refs.dialogitem.openDialog(row);
    },
    onChangeSelected(val) {     // 列表选中时触发
      this.selectedIds = val.map(item => item.portId);
    },

    /** 请求层 */
    getItemList() {             // 查询列表
      this.loading = true;
      this.selectedIds = [];
      const { page, rows } = this.pager;
      this.$http.post(`amcs/report/${this.$enum.getLabel('LABEL_CODE', this.amcsType).toLowerCase()}Main`,
        this.queryForm, { params: { page, rows } }).then((response) => {
        if (response.status === 200) {
          this.queryReport = _.cloneDeep(this.queryForm);
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    getPortList() {             // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
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
    onDownload() {              // 批量导出请求
      const { reportType, fromDate, toDate } = _.cloneDeep(this.queryReport);
      const body = {
        portIds: this.selectedIds,
        reportType,
        fromDate,
        toDate,
      };
      this.downloading = true;
      this.$http.post(`amcs/report/${this.$enum.getLabel('LABEL_CODE', this.amcsType).toLowerCase()}/zip`, body, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}报表管理${new Date().toLocaleDateString()}.zip`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    onOrganizeFiles() {         // 归档
      const { reportType, fromDate,  toDate } = _.cloneDeep(this.queryReport);
      const filingYear = this.queryReport.toDate
        ? this.queryReport.toDate.slice(0, 4)
        : new Date().getFullYear();
      const body = {
        portIds: this.selectedIds,
        reportType,
        fromDate,
        toDate,
        filingCode: 'StatisticsReport',       // 归档编号
        filingName: 'StatisticsReport',       // 归档名称
        filingYear,                           // 归档年份
      };
      this.fileloading = true;
      this.$http.post(`amcs/report/${this.$enum.getLabel('LABEL_CODE', this.amcsType).toLowerCase()}/file`, body).then((response) => {
        if (response.status === 200) {
          this.$message.success({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
        // const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}报表管理${new Date().toLocaleDateString()}.xls`;
        // this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.fileloading = false;
      });
    },

    /** 特殊方法 */
    getEmptyData() {                // 获取空数据
    },
    getCurrentYearMonth(date) {     // 获取当前年月
      let month = parseInt(date.getMonth() + 1, 10);
      if (month < 10) month = `0${month}`;
      return `${date.getFullYear()}-${month}`;
    },
    getCurrentMonthFirstDay(date) { // 获取当前月份的第一天
      let month = parseInt(date.getMonth() + 1, 10);
      if (month < 10) month = `0${month}`;
      return `${date.getFullYear()}-${month}-01`;
    },
    getCurrentMonthLastDay(date) {  // 获取当前月份的最后一天
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? `0${month}` : month;
      const day = new Date(year, month, 0);
      return `${year}-${month}-${day.getDate()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
