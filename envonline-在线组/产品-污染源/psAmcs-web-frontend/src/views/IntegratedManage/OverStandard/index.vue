<template>
  <!-- 超标率 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>

        <el-form-item label="时间：">
          <!-- <el-date-picker
            style="width:220px"
            v-model="dateRange"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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

        <el-form-item>
          <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 32px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="区域" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="dataTime" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="超标因子" prop="factorName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="小时超标样本数" prop="overCount" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="小时样本个数" prop="count" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column label="小时超标率" prop="overRate" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="日超标样本数" prop="dayOverCount" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column label="日样本数" prop="dayCount" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="日超标率" prop="dayOverRate" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <Transfer-port ref="port" :keyPollutant="queryForm.keyPollutant" @getQueryData="getPortIdsList" />
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { getDay } from '@/libs/tools';
import SelectPort from '@/components/widget/select-port';
import TransferPort from '@/components/widget/transfer-port';
import DateNum from '@/components/widget/date-num';

export default {
  name: 'OverStandard',
  mixins: [queryList],
  provide() {                       // 仅用于监管级别date-num组件
    return { app: this };
  },
  components: { SelectPort, TransferPort, DateNum },
  data() {
    return {
      url: 'amcs/overProofRate',
      isAuto: false,
      queryForm: {                  // 检索表单项
        fromDate: getDay(-7, false, false),  // 开始时间
        toDate: getDay(0, false, false),     // 结束时间
        portIds: [],                         // 站点信息
        isAll: true,                         // 是否选择全部
        portType: 1,                         // 1 废水 2 废气
        childPortTypes: [],                  // 废水传 [1,2,3] 废气传 [1, 2, 3]
        keyPollutant: -1,                    // 1 重点 0 非重点 -1 全部
        ye: -1,                              // 年份
        sort: 'regionName+,psName+,portName+,factorsName+',
      },
      downloading: false,           // 下载按钮加载状态
      portList: [],                 // 站点数据源
    };
  },
  created() {
    this.queryForm.childPortTypes = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
    this.getPortList();
    this.onQueryList();
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
    // dateRange: {
    //   get() {
    //     return (!this.queryForm.fromDate && !this.queryForm.toDate)
    //       ? ''
    //       : [this.queryForm.fromDate, this.queryForm.toDate];
    //   },
    //   set(val) {
    //     [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
    //   },
    // },
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
    // eslint-disable-next-line
    'queryForm.keyPollutant': function () {
      this.getPortList();
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
    getItemList() {              // 获取列表内容
      this.loading = true;
      const { page, rows } = this.pager;
      this.queryForm.portType = this.amcsType;
      this.$http.post(this.url, this.queryForm, {
        params: {
          page,
          rows,
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
      this.$http.post(`${this.url}/export`, this.queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}超标率${new Date().toLocaleDateString()}.xls`;
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
