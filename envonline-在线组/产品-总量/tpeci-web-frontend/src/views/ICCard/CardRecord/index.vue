<template>
  <!-- IC卡管理 - 管理卡刷卡记录管理 -->
  <el-card class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="卡号：">
        <el-input
          v-model="queryForm.cardCode"
          clearable
          style="width:180px"
          placeholder="请输入卡号"
          @keyup.enter.native="onQueryList()">
        </el-input>
      </el-form-item>

      <el-form-item label="卡类型：">
        <el-select v-model="queryForm.cardType">
          <el-option label="全部" :value="''"></el-option>
          <el-option
            v-for="(item,index) in $enum.get('IC_CARD_TYPE')"
            :key="index"
            :value="item.value"
            :label="item.label">
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
      <el-table-column align="center" label="No." min-width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="刷卡时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="卡类型" prop="cardTypeValue" min-width="80" show-overflow-tooltip>
        <!-- <template slot-scope="{ row }">
          {{$enum.getLabel('IC_CARD_TYPE', row.cardType)}}
        </template> -->
      </el-table-column>
      <el-table-column label="IC卡卡号" prop="cardCode" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="持卡人" prop="optionName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="卡状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span :class="{ 'text-danger': row.cardStatus === -1 }">{{row.cardContent}}</span>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <Transfer-port ref="port" @getQueryData="getPortIdsList" />
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';

export default {
  name: 'CardRecord',
  mixins: [queryList],
  components: {
    SelectPort,
    TransferPort,
  },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      isAuto: true,
      url: 'tpeci/tPECIWaterCardCheck',               // 用户卡列表接口地址
      queryForm: {
        psId,
        isAll: true,
        cardId: '',
        cardType: '',
        portIds: [],
        sort: 'Tstamp-',
      },
      itemList: [],
      select: {
        portList: [],
      },
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
  mounted() {
    this.getPortList();
  },
  methods: {
    onTabClick() {
      this.getPortList();
      this.onQueryList();
    },
    /* 站点方法 */
    onChangeCheck(val) {        // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    openTransfer() {            // 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortIdsList(portIds) {   // 获取站点id的合集
      this.queryForm.portIds = portIds || [];
      this.queryForm.isAll = portIds.length === 0;
      this.onQueryList();
    },

    /** 请求层 */
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          childPortType: 5,
          page: 1,
          rows: 100000,
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
    getItemList() {              // 获取记录列表
      this.loading = true;
      this.selectedIndexs = [];
      const { page, rows } = this.pager;
      const body = { ...this.queryForm };
      this.$http.post(this.url, body, {
        params: {
          page,
          rows,
        },
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
