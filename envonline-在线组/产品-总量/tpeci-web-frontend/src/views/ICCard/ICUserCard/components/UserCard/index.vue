<template>
  <!-- IC卡管理 - 用户卡管理 -->
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="MN号：">
        <el-input
          v-model="queryForm.mn"
          clearable
          style="width:180px"
          placeholder="请输入MN号"
          @keyup.enter.native="onQueryList()">
        </el-input>
      </el-form-item>

      <el-form-item label="卡号：">
        <el-input
          v-model="queryForm.cardCode"
          clearable
          style="width:180px"
          placeholder="请输入卡号"
          @keyup.enter.native="onQueryList()">
        </el-input>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="queryForm.cardStatus">
          <el-option label="全部" :value="''"></el-option>
          <el-option
            v-for="(item,index) in $enum.get('IC_CARD_STATUS')"
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

    <hr class="mar-b-xs"/>

    <!-- 头部 -->
    <div class="mar-l-xs mar-b-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
    </div>

    <el-table
      border
      highlight-current-row
      height="calc(100% - 110px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." min-width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.cardStatus === 2"
            type="danger"
            icon="fas fa-sign-out-alt"
            @click="onClickDel(scope.row)">注销</el-button>
          <el-button
            :disabled="scope.row.cardStatus === 2"
            type="primary"
            icon="fas fa-pencil-alt"
            @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点MN号" prop="mn" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="IC卡卡号" prop="cardCode" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="持卡人" prop="optionName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="联系电话" prop="telephone" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="卡状态" prop="cardStatus" min-width="80" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.getLabel('IC_CARD_STATUS', row.cardStatus)}}
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <Transfer-port ref="port" @getQueryData="getPortIdsList" />
    <dialog-form ref="dialog" @query="getItemList"/>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';
import DialogForm from './components/DialogForm';

export default {
  name: 'UserCard',
  mixins: [queryList],
  components: {
    SelectPort,
    TransferPort,
    DialogForm,
  },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      isAuto: false,
      url: 'tpeci/iCUserCard',               // 用户卡列表接口地址
      queryForm: {
        psId,
        isAll: true,
        mn: '',
        cardStatus: '',
        cardCode: '',
        portIds: [],
      },
      itemModel: {},
      itemList: [],
      select: {
        portList: [],
      },
      delLoading: false,
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
    onClickAdd() {                  // 新增按钮
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {              // 编辑按钮
      this.$refs.dialog.openDialog(row);
    },
    onClickDel(row) {
      const h = this.$createElement;
      this.$msgbox({
        title: '警告     注销后无法恢复',
        message: h('div', null, [
          h('p', null, [
            h('span', { style: 'width: 60px; display: inline-block' }, '卡类型'),
            h('span', null, '：'),
            h('i', { style: 'color: teal', class: 'mar-l-sm' }, '用户卡'),
          ]),
          h('p', null, [
            h('span', { style: 'width: 60px; display: inline-block' }, '持卡企业'),
            h('span', null, '：'),
            h('i', { style: 'color: teal', class: 'mar-l-sm' }, row.psName),
          ]),
          h('p', null, [
            h('span', { style: 'width: 60px; display: inline-block' }, '卡号'),
            h('span', null, '：'),
            h('i', { style: 'color: teal', class: 'mar-l-sm' }, row.cardCode),
          ]),
        ]),
        type: 'warning',
        showCancelButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => (
        this.$http.delete(this.url, { data: [row.id] })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '注销成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
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
      this.$http.post(`${this.url}/find`, body, {
        params: {
          page,
          rows,
          sort: 'modifyDate-,psName+,portName',
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
