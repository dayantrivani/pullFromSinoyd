<!-- 报警记录 -->
<template>
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="数据时间：">
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
          @change="onQueryList"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
          @change="onQueryList"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="queryForm.alarmTypeIds"
          multiple
          collapse-tags
          clearable
          placeholder="请选择报警类型"
          style="width: 160px;">
          <el-option
            v-for="(item,index) in alarmTypeList"
            :key="index"
            :value="item.id"
            :label="item.alarmTypeName">
          </el-option>
        </el-select>
      </el-form-item>

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
      <!-- <el-form-item>
        <el-button
          type="primary"
          icon="fas fa-download"
          :loading="downloading"
          @click="onDownload"
        >导 出</el-button>
      </el-form-item> -->
    </el-form>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 30px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index" fixed></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="180" show-overflow-tooltip fixed></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="160" show-overflow-tooltip fixed></el-table-column>
      <el-table-column label="报警时间" prop="alarmTstamp" min-width="160" show-overflow-tooltip fixed></el-table-column>
      <el-table-column label="报警类型" prop="alarmTypeName" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="污染物名称" prop="factorName" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警内容" prop="alarmContent" min-width="220" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <Transfer-port ref="port" @getQueryData="getQueryData"></Transfer-port>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import SelectPort from '@/components/select-port';
import TransferPort from '@/components/transfer-port';

export default {
  name: 'DataQuery',
  mixins: [queryList],
  components: { SelectPort, TransferPort },
  data() {
    return {
      url: 'alarm/alarmRecord',
      isAuto: false,
      queryForm: {
        fromDate: getDay(-29, false, false),
        toDate: getDay(0, false, false),
        portIds: [],
        isAll: true,
        alarmTypeIds: [],
        portType: 5,
      },
      itemList: [],
      portList: [], // 站点数据组
      alarmTypeList: [],
      downloading: false,
    };
  },
  created() {
    this.getPortList();
    this.getAlarmTypeList();
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
  },
  methods: {
    // 站点选择事件
    onChangeCheck(val) { // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    getQueryData(portIds) {
      this.queryForm.portIds = portIds || [];
      this.queryForm.isAll = portIds.length === 0;
      this.onQueryList();
    },
    // 站点选择
    selectPort() {
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    /* 接口方法 */
    getAlarmTypeList() {           // 获取报警类型列表
      this.$http.post('alarm/alarmType/code?page=1&rows=1000000', {
        alarmTypeCodes: ['AlarmRainOverProof', 'AlarmRainLow', 'AlarmRainFunction'],
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.alarmTypeList = response.data.data || [];
          this.getItemList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority/', {
        params: {
          page: 1,
          rows: 100000,
          portType: 5,
          key: '',
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
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post(this.url, { ...this.queryForm }, {
        params: { page, rows, sort: 'alarmTstamp-, regionName+, psName+, portName+, alarmLevel+, factorName+' },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
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
    // 下载数据
    onDownload() {
      this.downloading = true;
      this.$http.post(`${this.url}/export`, { ...this.queryForm }, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `数据查询${new Date().toLocaleDateString()}.xls`;
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
