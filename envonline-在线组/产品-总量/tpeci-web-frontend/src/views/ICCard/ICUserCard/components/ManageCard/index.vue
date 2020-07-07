<template>
  <!-- IC卡管理 - 管理卡管理 -->
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="单位：">
        <el-input
          v-model="queryForm.affiliationUnit"
          clearable
          style="width:180px"
          placeholder="请输入单位"
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
      <el-table-column label="单位名称" prop="affiliationUnit" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="部门" prop="department" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="卡类型" prop="cardType" min-width="120" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.getLabel('IC_CARD_TYPE', row.cardType)}}
        </template>
      </el-table-column>
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
    <dialog-form ref="dialog" @query="getItemList"/>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';

export default {
  name: 'ManageCard',
  mixins: [queryList],
  components: {
    DialogForm,
  },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      isAuto: false,
      url: 'tpeci/iCManageCard',               // 用户卡列表接口地址
      queryForm: {
        psId,
        affiliationUnit: '',
        cardType: '',
        cardStatus: '',
        cardCode: '',
        sort: 'modifyDate-,affiliationUnit+,department',
      },
      itemModel: {},
      itemList: [],
      delLoading: false,
    };
  },
  methods: {
    onTabClick() {
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
            h('i', { style: 'color: teal', class: 'mar-l-sm' }, this.$enum.getLabel('IC_CARD_TYPE', row.cardType)),
          ]),
          h('p', null, [
            h('span', { style: 'width: 60px; display: inline-block' }, '持卡单位'),
            h('span', null, '：'),
            h('i', { style: 'color: teal', class: 'mar-l-sm' }, row.affiliationUnit),
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
  },
};
</script>
