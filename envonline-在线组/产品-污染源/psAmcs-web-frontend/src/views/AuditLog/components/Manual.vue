<template>
  <!-- 人工审核日志 -->
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
      <el-form-item label="因子选择：">
        <el-select style="width:190px;" v-model="queryForm.factorCode" clearable filterable>
          <el-option
            v-for="(item, key) in factorList"
            :key="key"
            :value="item.factorCode"
            :label="item.factorName"
          ></el-option>
        </el-select>
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
      <el-table-column label="数据时间" prop="dataTime" width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核因子值类型" prop="factorName" min-width="120" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{ (scope.row.factorName?scope.row.factorName:"") + getFactorVaueTypeName(scope.row.valueType) }}</template>
      </el-table-column>
      <el-table-column label="审核操作" prop="checkAction" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="原始值" prop="oldData" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="更正值" prop="checkData" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="修约原因" prop="checkReason" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核时间" prop="tstamp" width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核人员" prop="auditName" min-width="100" show-overflow-tooltip></el-table-column>
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
  name: 'ManualAuditLog',
  mixins: [queryList],
  components: { SelectPort },
  data() {
    return {
      isAuto: false,
      queryForm: {
        fromTime: getDay(-7, true, false),
        portIds: [],
        toTime: getDay(0, true, false),
        factorCode: '',
        portType: '',
        isAll: true, // 所有站点，如果portIds非空则为false
        key: '',
      },
      stationList: [], // 站点信息
      factorList: [], // 因子信息
      itemList: [], // 列表数据
      downloading: false,
      factorVaueType: [], // 因子值类型
    };
  },
  created() {
    this.getStation();
    this.getFactorList();
    this.getFactorValueType();
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
    // 获取因子数据(需要获取系统的水气类型)
    getFactorList() {
      this.$http.get('cfg/factors', {
        params: {
          page: 1,
          rows: 1000,
          factorsType: 1, // 1检测因子
          category: this.amcsType, // 1水2气
          sort: 'factorName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.factorList = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
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
      const url = 'audit/hourLog';
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
      const sort = 'regionName+,psName+,portName+';
      const queryForm = { ...this.queryForm };
      queryForm.isAll = queryForm.portIds.length === 0;
      queryForm.portType = this.amcsType;
      this.$http.post('audit/hourLog/export', queryForm, {
        'responseType': 'blob',
        params: { sort },
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}人工审核日志${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 获取因子值类型
    getFactorValueType() {
      // 调取接口
      this.$http.get('sys/enumCode', {
        params: {
          codeValue: `FactorValueType${this.$enum.getLabel('LABEL_CODE', this.amcsType)}`,
        },
      }).then((response) => {
        this.factorVaueType = response.data;
        this.onQueryList();
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取值类型中文
    getFactorVaueTypeName(value) {
      let str = '';
      const temp = this.factorVaueType.find(p => p.dictValue === value);
      if (temp) {
        str = temp.dictName;
      }
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
