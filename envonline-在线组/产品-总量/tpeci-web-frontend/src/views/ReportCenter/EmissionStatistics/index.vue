<template>
  <!-- 排放量统计 -->
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-x-sm">
      <el-form-item label="数据类型：">
        <el-select v-model="queryForm.reportType" style="width: 85px;">
          <el-option
            v-for="(item,index) in $enum.get('REPORT_TYPELIST')"
            :key="+index"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </el-form-item>

      <!--
        当数据类型为日报表 - 精确到日
        月报表 - 精确到月
        年报表 - 精确到年
      -->
      <el-form-item label="时间：">
        <!-- 日 -->
        <el-date-picker
          v-model="queryForm.fromDate"
          v-if="queryForm.reportType === 'dayReport'"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          style="width: 140px;"
          :picker-options="pickerOption"
          :clearable="false"
          :editable="false">
        </el-date-picker>
        <span  v-if="queryForm.reportType === 'dayReport'"> ~ </span>
        <el-date-picker
          v-model="queryForm.toDate"
          v-if="queryForm.reportType === 'dayReport'"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          style="width: 140px;"
          :picker-options="pickerOption"
          :clearable="false"
          :editable="false">
        </el-date-picker>
        <!-- 月 -->
        <el-date-picker
          v-model="queryForm.fromDate"
          v-if="queryForm.reportType === 'monthReport'"
          type="month"
          value-format="yyyy-MM-dd"
          format="yyyy-MM"
          style="width: 113px;"
          :picker-options="pickerOption"
          :clearable="false"
          :editable="false">
        </el-date-picker>
        <span v-if="queryForm.reportType === 'monthReport'"> ~ </span>
        <el-date-picker
          v-model="queryForm.toDate"
          v-if="queryForm.reportType === 'monthReport'"
          type="month"
          value-format="yyyy-MM-dd"
          format="yyyy-MM"
          style="width: 113px;"
          :picker-options="pickerOption"
          :clearable="false"
          :editable="false">
        </el-date-picker>
        <!-- 年 -->
        <el-date-picker
          v-model="year"
          v-if="queryForm.reportType === 'yearReport'"
          type="year"
          value-format="yyyy"
          format="yyyy"
          style="width: 94px;"
          :picker-options="pickerOption"
          :clearable="false"
          :editable="false">
        </el-date-picker>
        <!-- <span v-if="queryForm.reportType === 'yearReport'">&nbsp;</span>
        <el-select v-if="queryForm.reportType === 'yearReport'" v-model="period"
          class="mar-l-sm" style="width: 105px;">
          <el-option v-for="(item,index) in yearPeriod" :key="index"
            :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
      </el-form-item>

      <el-form-item label="因子：">
        <el-select v-model="factorList" style="width: 180px" multiple collapse-tags>
          <el-option
            v-for="item in select.factorList"
            :key="item.id"
            :label="item.factorShowName"
            :value="item.factorShowCode">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="站点：">
        <select-port
          width="180px"
          v-model="queryForm.portIds"
          filterable
          :options="select.portList"
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

      <el-form-item>
        <el-button
        type="primary"
        icon="fas fa-download"
        :loading="downloading"
        @click="onDownload"
      >导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed label="行政区域" prop="regionName" min-width="100px" show-overflow-tooltip></el-table-column>
      <el-table-column fixed label="企业名称" prop="psName" min-width="160px" show-overflow-tooltip></el-table-column>
      <el-table-column fixed label="站点名称" prop="portName" min-width="160px" show-overflow-tooltip></el-table-column>
      <el-table-column fixed label="数据时间" prop="tstamp" min-width="180px" show-overflow-tooltip></el-table-column>
      <el-table-column fixed align="center" prop="w00000-YUQ" min-width="120px" show-overflow-tooltip>
        <template slot="header">
          <span>污水年度剩余量<br/>充值量-排放量</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in colFactor"
        :key="item.id"
        align="center"
        show-overflow-tooltip
        :min-width="getLabelLen(item)"
      >
        <template slot-scope="scope" slot="header"><span v-html="getTableFactorName(item, scope)"></span></template>
        <template slot-scope="{ row }">
          <span :class="{ 'text-danger': isRed(row[item.factorShowCode]) }">
            {{ isOut(row[item.factorShowCode]) }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <Transfer-port ref="port" @getQueryData="getPortIdsList" />
  </el-card>
</template>

<script>
// import _ from 'lodash';
import { analyzeResp } from '@/global/libs/util';
import { tableTitleLen, getDay } from '@/libs/tools';
import { queryList } from '@/global/libs/mixins';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';

export default {
  name: 'EmissionStatistics',
  mixins: [queryList],
  components: {
    SelectPort,
    TransferPort,
  },
  data() {
    return {
      url: 'tpeci/report',
      isAuto: false,
      loading: false,            // 列表加载
      downloading: false,        // 导出加载
      colFactor: [],             // 列表因子列

      year: '',                  // 年报表日期控件绑定的值
      period: '',                // 年报表选定期限 上半年，下半年，全年
      yearPeriod: [              // 年份期限
        { label: '上半年', value: 1 },
        { label: '下半年', value: 2 },
        { label: '全半年', value: 3 },
      ],
      select: {                  // 选择框查询条件
        portList: [],            // 站点列表
        factorList: [],          // 因子列表
      },
      factorList: [],            // 选中的因子
      queryForm: {               // 列表查询条件
        key: '',                 // 关键字
        isAll: true,             // 是否选中所有站点
        portIds: [],             // 下拉框站点
        factorList: [],          // 因子下拉框
        reportType: 'dayReport', // 数据类型
        fromDate: '',            // 开始时间
        toDate: '',              // 结束时间
      },
      itemList: [],              // 列表数据
      pickerOption: {            // 年月日
        disabledDate: val => val.getTime() > new Date().getTime(),
      },
    };
  },
  computed: {
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
    factorList: {
      handler(val) {
        const selectList = this.select.factorList.filter(v => val.includes(v.factorShowCode));
        this.queryForm.factorList = selectList.map(v => ({
          factorShowName: v.factorShowName,
          factorShowCode: v.factorShowCode,
          factorName: v.factorName,
          unitCou: v.unitCou || v.unit,
        }));
      },
      deep: true,
      immediate: true,
    },

    /** 以下代码用于监控数据类型变化导致的日期变化
     * --------------------------------------
     */
    'queryForm.reportType': {
      handler(val) {
        const date = new Date();
        const y = date.getFullYear().toString();
        let m = date.getMonth() + 1;
        const starDay = `0${new Date(y, m, 1).getDate()}`; // 月开始时间，尾数为1 格林日志时间月份为传入月份 + 1
        const endDay = new Date(y, m, 0).getDate();  // 月结束时间，尾数为0 格林日志时间月份为传入月份
        if (m < 10) {
          m = `0${m}`;
        }
        let d = date.getDate();
        if (d < 10) {
          d = `0${d}`;
        }
        let start = '';
        let to = '';
        if (val === 'dayReport') {
          start = getDay(-1, false);
          to = getDay(-1, false);
        } else if (val === 'monthReport') {
          start = `${y}-${m}-${starDay}`;
          to = `${y}-${m}-${endDay}`;
        } else if (val === 'yearReport') {
          start = `${y}-01-01`;
          to = `${y}-12-31`;
          this.period = 3;
          this.year = y;
        }
        this.queryForm.fromDate = start;
        this.queryForm.toDate = to;
      },
      deep: true,
    },
    year(val) {
      const start = `${val}-01-01`;
      const to = `${val}-12-31`;
      this.queryForm.fromDate = start;
      this.queryForm.toDate = to;
    },
    // period(val) {
    //   if (this.year) {
    //     let start = '';
    //     let to = '';
    //     if (val === 1) {
    //       start = `${this.year}-01-01`;
    //       to = `${this.year}-06-30`;
    //     } else if (val === 2) {
    //       start = `${this.year}-07-01`;
    //       to = `${this.year}-12-31`;
    //     } else if (val === 3) {
    //       start = `${this.year}-01-01`;
    //       to = `${this.year}-12-31`;
    //     }
    //     this.queryForm.fromDate = start;
    //     this.queryForm.toDate = to;
    //   }
    // },
    // year(val) {
    //   if (this.period) {
    //     let start = '';
    //     let to = '';
    //     if (this.period === 1) {
    //       start = `${val}-01-01`;
    //       to = `${val}-06-30`;
    //     } else if (this.period === 2) {
    //       start = `${val}-07-01`;
    //       to = `${val}-12-31`;
    //     } else if (this.period === 3) {
    //       start = `${val}-01-01`;
    //       to = `${val}-12-31`;
    //     }
    //     this.queryForm.fromDate = start;
    //     this.queryForm.toDate = to;
    //   }
    // },
  },
  created() {
    this.queryForm.fromDate = getDay(-1, false);
    this.queryForm.toDate = getDay(-1, false);
    this.getPortList();
    this.getFactorList();
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
      this.queryForm.isAll = portIds.length === 0;
      this.onQueryList();
    },

    /** 请求层 */
    getFactorList() {             // 获取因子列表
      this.$http.get('cfg/pageShowItem', {
        params: {
          pageShowMainCode: 'TPECI_DataQueryCou',
          isEnabled: true,
          page: 1,
          rows: 100000,
          sort: 'orderNum-',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.factorList = (response.data.data || []);
          this.factorList = this.select.factorList.filter(v => v.isShow).map(v => v.factorShowCode);
          this.getItemList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList() {               // 查询列表
      this.loading = true;
      this.selectedIds = [];
      this.colFactor = [];
      this.itemList = [];
      const { page, rows } = this.pager;
      this.$http.post(this.url,
        this.queryForm, {
          params: { page, rows, sort: 'regionName+,psName+,portName+,tstamp-' },
        }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.colFactor = this.queryForm.factorList || [];
          this.itemList = response.data.data || [];
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
    getPortList() {               // 获取站点列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          childPortTypes: 5,
          portType: 1,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onDownload() {                 // 下载数据
      this.downloading = true;
      const { page, rows } = this.pager;
      this.$http.post(`${this.url}/export`, {
        ...this.queryForm,
      }, {
        params: { page, rows, sort: 'regionName+,psName+,portName+,tstamp-' },
        responseType: 'blob',
      }).then((response) => {
        const fileName = `排放量统计${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, fileName);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },

    /** 特殊方法 */
    getTableFactorName(item) {    // 自定义表头内容
      // const field = item.valueType === 'Cou' ? 'unitCou' : 'unit';
      // return `${item.factorShowName}<br/>${item[field] ? `（${item[field]}）` : ''}`;
      return `${item.factorShowName}${item.unitCou ? `<br/>（${item.unitCou}）` : ''}`;
    },
    isOut(val) {
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    isRed(val) {
      return typeof val === 'string' ? val.includes('red') : false;
    },
    getLabelLen(item) {           // 设置列表表头的宽度
      // const field = item.valueType === 'Cou' ? 'unitCou' : 'unit';
      const label = tableTitleLen(item.factorShowName);
      // const unit = tableTitleLen(item[field]);
      const unit = tableTitleLen(item.unitCou || '');
      return label > unit ? label : unit;
    },
    getEmptyData() {              // 获取空数据
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
