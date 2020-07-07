<template>
  <!-- 自动审核日志 -->
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="数据时间：">
        <el-date-picker
          style="width:160px"
          v-model="queryForm.fromTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:160px"
          v-model="queryForm.toTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="站点：">
        <select-port
          v-model="queryForm.portIds"
          filterable
          :options="stationList"
          :field="[
              { name: 'psName', key: 'psId' },
              { name: 'portName', key: 'id' }
            ]"
          @query="getStation()"
        ></select-port>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="fas fa-download"
          :loading="downloading"
          @click="onDownload"
        >导 出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." min-width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="区域" prop="regionName" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="修约原因" prop="checkReason" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核时间" prop="auditTstamp" width="155" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import SelectPort from '@/components/widget/select-port';
import { getDay } from '@/libs/tools';
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'AutomaticAuditLog',
  mixins: [queryList],
  components: { SelectPort },
  data() {
    return {
      queryForm: {
        fromTime: getDay(-7, true, false),
        portIds: [],
        toTime: getDay(0, true, false),
        portType: '',
        isAll: true, // 所有站点，如果portIds非空则为false
        key: '',
      },
      stationList: [], // 站点信息
      itemList: [], // 列表数据
      downloading: false,
    };
  },
  created() {
    this.getStation();
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  watch: {},
  methods: {
    // 获取站点
    getStation() {
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
        if (response.data.success) {
          this.stationList = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 查询按钮
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      const sort = 'tstamp-,portName+,dataTime+';
      const url = 'audit/autoHourLog';
      const queryForm = { ...this.queryForm };
      queryForm.isAll = queryForm.portIds.length === 0;
      queryForm.portType = this.amcsType;
      this.$http.post(url, queryForm, {
        params: { page, rows, sort },
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
    onDownload() {
      this.downloading = true;
      const queryForm = { ...this.queryForm };
      queryForm.isAll = queryForm.portIds.length === 0;
      queryForm.portType = this.amcsType;
      this.$http.post('audit/autoHourLog/export', queryForm, {
        'responseType': 'blob',
        params: {},
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}自动审核日志${new Date().toLocaleDateString()}.xls`;
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
