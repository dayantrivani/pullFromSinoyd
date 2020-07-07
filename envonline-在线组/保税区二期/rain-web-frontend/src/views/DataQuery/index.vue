<!-- 排放量数据查询 -->
<template>
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm fn-no-wrap">
      <el-form-item label="数据时间：">
        <el-date-picker style="width: 140px;" v-model="queryForm.fromDate" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :clearable="false" :editable="false" @change="onQueryList"></el-date-picker>&nbsp;~
        <el-date-picker style="width: 140px;" v-model="queryForm.toDate" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :clearable="false" :editable="false" @change="onQueryList"></el-date-picker>
      </el-form-item>
      <el-form-item label="数据类型：">
        <el-select placeholder="选择类型" style="width:120px;" v-model="queryForm.dataType">
          <el-option v-for="(item, key) in $enum.get('DATA_TYPE')" :key="key" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="站点：">
        <select-port v-model="queryForm.portIds" filterable :options="portList" :field="[
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
    <el-table border highlight-current-row height="calc(100% - 30px)" v-loading="loading" :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
      <!-- 应付检查后期放开 -->
      <!-- <el-table-column label="雨水泵"
                       prop="rainPumpState"
                       min-width="65"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="液位"
                       prop="waterHeightState"
                       min-width="50"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="超标泵"
                       prop="overProofPumpState"
                       min-width="65"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="申请授权状态"
                       prop="askAuthorizeState"
                       min-width="120"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="授权状态"
                       prop="authorizeState"
                       min-width="80"
                       show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="w01018-Avg" align="center" min-width="110">
        <template slot="header" slot-scope="{ row }">
          <p>化学需氧量平均值</p>
          <p>(毫克/升)</p>
          <span v-show="false">{{ row }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="w01001-Avg" align="center" min-width="110">
        <template slot="header" slot-scope="{ row }">
          <p>pH平均值</p>
          <p>(无量纲)</p>
          <span v-show="false">{{ row }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="w00000-Avg" align="center" min-width="110">
        <template slot="header" slot-scope="{ row }">
          <p>雨水平均值</p>
          <p>(升/秒)</p>
          <span v-show="false">{{ row }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="w00000-Cou" align="center" min-width="110">
        <template slot="header" slot-scope="{ row }">
          <p>雨水外排量</p>
          <p>(立方米)</p>
          <span v-show="false">{{ row }}</span>
        </template>
      </el-table-column>
      <!-- 应付检查后期放开 -->
      <!-- <el-table-column label="超标状态"
                       prop="overAlarmStateName"
                       min-width="80"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="PLC状态"
                       prop="plcState"
                       min-width="80"
                       show-overflow-tooltip></el-table-column> -->
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
      url: 'rain/historyData/temp',
      isAuto: false,
      queryForm: {
        portIds: [],
        isAll: true,
        fromDate: getDay(-29, false, false),
        toDate: getDay(0, false, false),
        portType: 5,
        dataType: 'Hour', // 后期删除
        factorCodes: ['w01001-Avg', 'w01018-Avg', 'w00000-Avg', 'w00000-Cou'], // 后期删除
        sort: 'Tstamp-',
      },
      itemList: [],
      portList: [], // 站点数据组
      downloading: false,
    };
  },
  created() {
    this.getPortList();
    this.onQueryList();
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
        params: { page, rows },
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
