<template>
  <!-- 充值记录 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>

        <el-form-item label="年度：" prop="depositYear">
          <el-date-picker
            v-model="queryForm.depositYear"
            type="year"
            format="yyyy"
            value-format="yyyy"
            :clearable="false"
            :editable="false"
            style="width: 100px"
          ></el-date-picker>
        </el-form-item>

        <!-- <el-form-item label="因子：">
          <el-select
            v-model="queryForm.factorCodeList"
            v-loading="floading"
            multiple
            collapse-tags
            filterable
            style="width: 200px"
            clearable
          >
            <el-option v-for="item in select.factorList" :key="item.factorCode"
              :label="item.factorName" :value="item.factorCode"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="站点：">
          <select-port
            v-loading="ploading"
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
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>

      </el-form>
    </template>

    <!-- 操作按钮 -->
    <!-- <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div> -->

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 32px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="90">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickRecord(scope.row)">充值记录</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="本年度核定量" prop="approvedEmissons" min-width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <p v-for="(item,index) in row.approvedEmissons.split(';')" :key="index">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column label="本年度已充值量" prop="depositEmissions" min-width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <p v-for="(item,index) in row.depositEmissions.split(';')" :key="index">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column label="本年度可充值量" prop="surplusEmissions" min-width="150" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <p v-for="(item,index) in row.surplusEmissions.split(';')" :key="index">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column label="本年度充值次数" prop="count" min-width="140" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-item ref="dialog" @query="getItemList"/>
    <Transfer-port ref="port" @getQueryData="getPortIdsList"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';
import DialogItem from './components/DialogItem';


export default {
  name: 'SewageApproval',
  mixins: [queryList, deleteItem],
  components: {
    DialogItem,
    SelectPort,
    TransferPort,
  },
  data() {
    return {
      url: 'tpeci/iCCardDepositRecord/record',
      isAuto: false,
      loading: false,
      floading: false,
      ploading: false,
      queryForm: {                  // 检索表单项
        portIds: [],                // 站点ids
        isAll: true,                // 全选站点
        depositYear: '',            // 核定年份
      },
      select: {                     // 查询条件选择框
        portList: [],
      },
      itemList: [],
    };
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
  created() {
    this.queryForm.depositYear = new Date().getFullYear().toString();
    this.onQueryList();
    this.getPortList();
  },
  methods: {
    onChangeCheck(val) {            // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    openTransfer() {                // 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortIdsList(portIds) {       // 关闭穿梭框时触发
      this.queryForm.portIds = portIds || [];
      this.queryForm.isAll = portIds.length === 0;
      this.onQueryList();
    },
    onClickRecord(row) {              // 编辑按钮
      this.$refs.dialog.openDialog(row);
    },

    /** 请求层 */
    getPortList() {                 // 获取站点列表
      this.select.portList = [];
      this.ploading = true;
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 1000000,
          childPortType: 5,
          portType: 1,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data || [];
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
        this.ploading = false;
      });
    },
    getItemList() {
      this.loading = true;
      this.selectedIds = [];
      const { page, rows } = this.pager;
      this.$http.post(this.url, this.queryForm, {
        params: { page, rows },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
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
  },
};
</script>

<style lang="scss" scoped>
</style>
