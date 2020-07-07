<template>
  <!--
    门禁卡配置 -- 新页面
    Entrance Card Config
  -->
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="卡号：">
          <el-input v-model="queryForm.cardCode" clearable style="width: 150px;" placeholder="请输入卡号"></el-input>
        </el-form-item>
        <el-form-item label="卡类型：">
          <el-select v-model="queryForm.cardType">
            <el-option label="全部" :value="-1"></el-option>
            <el-option v-for="(item, key) in $enum.cardType" :key="key" :label="item" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mar-l-xs mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItemT">删 除
      </el-button>
    </div>
    <!-- 记录列表 -->
    <el-table
      border
      height="calc(100% - 76px)"
      v-loading="loading"
      highlight-current-row
      :data="itemList"
      @select="_select"
      @select-all="_selectAll"
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="cardCode" label="卡号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardTypeName" label="卡类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardHolderName" label="持卡人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardStatusName" label="门禁卡状态" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <e-card-config-dialog ref="dialog" :title="title" @query="getItemList"/>
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/plugins/mixins';
import ECardConfigDialog from './components/ECardConfigDialog.vue';

export default {
  name: 'AccessCardConfig',
  mixins: [queryList, deleteItem],
  components: {
    ECardConfigDialog,
  },
  data() {
    return {
      url: 'cfg/accessCard',
      isAuto: true,
      title: '新增门禁信息',
      queryForm: {
        sort: 'cardCode',
        cardCode: '',      // 卡号
        cardType: '',      // 卡类型
      },
      selectedIds: [],
      options: [
      ],
    };
  },
  created() {
    if (this.isAuto) this.onQueryList();
  },
  methods: {
    // 新增按钮
    onClickAdd() {
      this.title = '新增门禁信息';
      this.$refs.dialog.openDialog();
    },
    // 编辑按钮
    onClickEdit(val) {
      this.title = '编辑门禁信息';
      this.$refs.dialog.openDialog();
      this.$http.get(`cfg/accessCard/${val.id}`).then((response) => {
        if (response.data.success) {
          const data  = response.data.data || {};
          this.$refs.dialog.dialogModel = {
            id: data.id,                          // id
            cardCode: data.cardCode,              // 卡号
            cardType: data.cardType,              // 卡类型
            cardStatus: data.cardStatus,          // 门禁状态
            // cardHolderId: data.cardHolderId,     // 持卡人姓名id
            cardHolderName: data.cardHolderName,  // 持卡人姓名
            psId: data.psId,                      // 企业id
            portId: data.portId,                  // 排口id
          };
          this.$refs.dialog.editOne = true;
        } else {
          this.$message.error({
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>
