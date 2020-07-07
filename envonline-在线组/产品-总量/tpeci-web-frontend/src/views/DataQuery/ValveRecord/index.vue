<!-- 排放量数据查询 -->
<template>
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="阀门关闭起止时间：">
        <el-date-picker
          style="width: 160px;"
          v-model="queryForm.fromTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width: 160px;"
          v-model="queryForm.toTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:59:59"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input
          v-model="queryForm.key"
          clearable
          placeholder="请输入企业名称、站点名称"
          style="width: 220px"
          @keyup.enter.native="onQueryList()"
        ></el-input>
      </el-form-item>
      <!-- <Select-port-group v-model="queryForm"></Select-port-group> -->
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
    </el-form>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="行政区域" prop="regionName" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="阀门关闭时间" prop="endTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="阀门开启时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="关闭类型" prop="ctypeValue" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operationName" min-width="160" show-overflow-tooltip>
        <template slot="header">
          <el-tooltip transition offset="-55" placement="top-start">
            <template slot="content">自动关闭操作人为系统管理员</template>
            <span>
              操作人
              <i class="el-icon-info"></i>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <Transfer-port ref="port" @getQueryData="getQueryData"></Transfer-port>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';

export default {
  name: 'ValveRecord',
  mixins: [queryList],
  components: { SelectPort, TransferPort },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      url: 'tpeci/tPECIWaterValveStatus',
      queryForm: {
        psId,
        key: '',
        isAll: true,
        portIds: [],
        // type: ['10', '01'],
        fromTime: getDay(-2),
        toTime: getDay(0, true, true),
        sort: 'Tstamp-,psName+,portName+',
      },
      itemList: [],
      portList: [], // 站点数据组
    };
  },
  created() {
    this.getPortList();
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
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          portType: 1,
          childPortType: 5,
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
  },
};
</script>

<style lang="scss" scoped>
</style>
