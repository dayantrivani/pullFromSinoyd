<template>
  <!-- 超标统计 -->
  <el-card>
    <!-- <template slot="header"> -->
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">

      <el-form-item label="数据类型：">
        <el-select v-model="queryForm.dataType" style="width: 135px">
          <el-option :value="-1" label="全部"></el-option>
          <el-option v-for="(item, index) in $enum.get('EXCE_DATA_TYPE')" :key="index"
            :value="item.value" :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="时间：">
        <!-- <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          v-model="dateRange"
          :picker-options="pickerOptions"
          :clearable="false"
        ></el-date-picker> -->
        <el-date-picker
          style="width:135px"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:135px"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>

      <date-num v-model="queryForm.ye" :keyPollutant="queryForm.keyPollutant"/>

      <br/>
      <el-form-item label="站点：">
        <select-port
          width="200px"
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
        <el-button class="mar-l-sm" type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
      </el-form-item>

    </el-form>
    <!-- </template> -->

    <el-table
      border
      highlight-current-row
      height="calc(100% - 64px)"
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column  align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="区域" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column  label="污染源名称" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="监管级别" prop="regionName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column  label="站点名称" prop="portName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据类型" prop="dataType" min-width="140" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <!-- dataType -1 全部类型 1 审核小时数据 2 报表日数据-->
          <!-- <span>{{ $enum.ExceDataType[row.dataType] }}</span> -->
          <span>{{ $enum.getLabel('EXCE_DATA_TYPE', +row.dataType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="超标因子" prop="factorName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="因子数值" prop="factorValue" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="标准值" prop="standardLimit" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="超标倍数" prop="overProofTimes" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="标准来源" prop="evaluationName" min-width="90" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />

    <Transfer-port ref="port" @getQueryData="getPortIdsList" />
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import { analyzeResp } from '@/global/libs/util';
import SelectPort from '@/components/widget/select-port';
import TransferPort from '@/components/widget/transfer-port';
import DateNum from '@/components/widget/date-num';

export default {
  name: 'ExcessiveStatistics',
  mixins: [queryList],
  props: ['portType'],
  provide() {                       // 仅用于监管级别date-num组件
    return { app: this };
  },
  components: {
    SelectPort,
    TransferPort,
    DateNum,
  },
  data() {
    return {
      url: 'amcs/overProofReport',            // 列表接口地址
      isAuto: false,                          // 混合queryList不会默认在created调用查询
      queryForm: {                            // 查询条件
        isAll: true,                          // 是否选择全部
        dataType: -1,                         // -1 全部 1 审核小时数据 2 报表日数据
        fromDate: getDay(-366, false, false), // 开始时间
        toDate: getDay(-1, false, false),      // 结束时间
        portIds: [],                          // 排口ID
        portType: 1,                          // 排口类型
        keyPollutant: -1,                     // 1 重点 0 非重点 -1 全部
        ye: -1,                               // 年份
      },
      loading: false,                         // 加载状态
      downloading: false,                     // 站点加载状态
      portList: [],                           // 站点数据源
      pickerOneDate: '',                      // 日期控件定义变量
      pickerOptions: {                        // 日期控件方法
        onPick: ({ maxDate, minDate }) => {
          this.pickerOneDate = minDate.getTime();
          if (maxDate) {
            this.pickerOneDate = '';
          }
        },
        disabledDate: (time) => {
          if (this.pickerOneDate !== '') {
            let date = '';
            let max = '';
            let min = '';
            if (this.queryForm.dataType === 1) {
              date = 30 * 24 * 3600000;
            } else {
              date = 365 * 24 * 3600000;
            }
            max = this.pickerOneDate + date;
            min = this.pickerOneDate - date;
            return time.getTime() > max || time.getTime() < min || time.getTime() > +new Date();
          }
          return time.getTime() > +new Date();
        },
      },
    };
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
  },
  created() {
    this.getPortList();
    this.getItemList();
  },
  watch: {
    queryForm: {                       // 监控站点
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this.queryForm, 'isAll', false);
        } else {
          this.$set(this.queryForm, 'isAll', true);
        }
      },
      deep: true,
    },
    'queryForm.dataType': {            // 监控数据类型
      handler(val) {
        /** 数据类型为 审核小时数据       默认间隔2天
         *  数据类型为 报表日数据 | 全部  默认间隔365天
         */
        if (val === 2) {
          this.queryForm.fromDate = getDay(-365, false, false);
          this.queryForm.toDate = getDay(0, false, false);
        } else {
          this.queryForm.fromDate = getDay(-30, false, false);
          this.queryForm.toDate = getDay(0, false, false);
        }
        this.pickerOneDate = '';
      },
    },
  },
  methods: {
    onChangeCheck(val) {         // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    openTransfer() {             // 穿梭框方法 -- 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortIdsList(portIds) {    // 站点穿梭框方法 -- 获取已选站点 id 的集合
      /** 穿梭框选择站点确认后触发列表查询 */
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },

    /** 请求层 */
    getPortList() {              // 获取排口点位列表
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
    getItemList() {              // 获取列表内容
      this.loading = true;
      const { page, rows } = this.pager;
      this.queryForm.portType = this.amcsType;
      this.queryForm.childPortTypes = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
      this.$http.post(this.url, this.queryForm, {
        params: {
          page,
          rows,
          sort: 'tstamp-',
        },
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
    onDownload() {               // 下载数据
      this.downloading = true;
      const { page, rows } = this.pager;
      this.queryForm.portType = this.amcsType;
      this.queryForm.childPortTypes = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
      this.$http.post(`${this.url}/export`, this.queryForm, {
        'responseType': 'blob',
        params: { page, rows },
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}超标统计${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
