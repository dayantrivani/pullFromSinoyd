<template>
<!-- 配置按钮弹框 -->
  <dialog-modal ref="dialog" title="因子配置" @close="closeDialog">
      <div class="mar-y-xs">
        <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
        <el-button
          type="danger"
          icon="fas fa-trash-alt"
          :disabled="!selectedIds.length"
          @click="onDeleteItemT">删 除
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        height="55vh"
        class="mar-t-sm"
        highlight-current-row
        :data="itemList"
        @select="_select"
        @select-all="_selectAll"
        :row-class-name="_rowClassName"
        @selection-change="changeSelected">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
        <el-table-column label="操作" align="center" width="70">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="factorName" label="因子名称" show-overflow-tooltip></el-table-column>
        <!-- valueType -->
        <el-table-column prop="valueTypeName" label="值类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isShow" label="是否默认显示" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.isShow ? '显示' : '不显示' }}
          </template>
        </el-table-column>
        <el-table-column prop="isEnabled" label="是否启用" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.isEnabled ? '启用' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" show-overflow-tooltip></el-table-column>
      </el-table>
      <paging-query :pager="pager" @query="getItemList"/>
      <factor-dialog
        ref="formDialog"
        :title="title"
        :mainId="mainId"
        @query="getItemList"/>
    </dialog-modal>
</template>

<script>
import { queryList, deleteItem } from '@/plugins/mixins';
import FactorDialog from './FactorDialog';

export default {
  name: 'AddOrEditDialog',
  mixins: [queryList, deleteItem],
  components: {
    FactorDialog,
  },
  data() {
    return {
      mainId: 0,                // 主页id
      url: 'cfg/pageShowItem',
      selectedIds: [],
      queryForm: {
        sort: 'orderNum-',
        pageShowMainId: '',
      },
      pager: {
        rows: 15,
        total: 0,
        page: 1,
      },
      itemList: [],
      title: '新增',
    };
  },
  methods: {
    // 打开弹窗
    openDialog(val) {
      // 主页面id
      this.queryForm.pageShowMainId = val.id;
      this.mainId = val.id;
      this.$refs.dialog.openDialog();
      this.onQueryList();
    },
    // 新增按钮
    onClickAdd() {
      this.title = '新增';
      this.$refs.formDialog.openDialog();
    },
    // 编辑按钮
    onClickEdit(val) {
      this.title = '编辑';
      this.$refs.formDialog.openDialog(val);
    },
    // 弹框关闭前的回调
    closeDialog() {
      this.selectedIndex = [];
      this.selectedIds = [];
    },
    // 当选择项发生变化时会触发该事件
    // changeSelected(option) {
    //   this.selectedIds = option.map(val => val.factorId);
    // },
  },
};
</script>
