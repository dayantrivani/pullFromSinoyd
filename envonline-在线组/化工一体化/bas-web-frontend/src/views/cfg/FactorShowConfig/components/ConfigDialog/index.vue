<template>
<!-- 配置按钮弹框 -->
  <dialog-modal ref="dialog" title="因子配置" @close="closeDialog">
      <div class="mar-y-xs">
        <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
        <el-button
          type="danger"
          icon="fas fa-trash-alt"
          :disabled="!selectedIds.length"
          @click="onDeleteItem">删 除
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        height="55vh"
        class="mar-t-sm"
        :data="itemList"
        highlight-current-row
        @selection-change="changeSelected">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
        <el-table-column label="操作" align="center" width="60">
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
import { analyzeResp } from '@/global/libs/util';
// import { queryList, deleteItem } from '@/plugins/mixins';
import FactorDialog from './FactorDialog';

export default {
  name: 'AddOrEditDialog',
  // mixins: [queryList, deleteItem],
  components: {
    FactorDialog,
  },
  data() {
    return {
      loading: false,
      mainId: 0,                // 主页id
      url: 'cfg/pageShowItem',
      queryForm: {
        sort: 'factorCode',
        pageShowMainId: '',
      },
      itemList: [],
      selectedIds: [],
      pager: {   // 修改项
        page: 1,
        rows: 15,
        count: 0,
      },
      title: '新增',
    };
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    // 打开弹窗
    openDialog(val) {
      // 主页面id
      this.queryForm.pageShowMainId = val.id;
      this.mainId = val.id;
      this.$refs.dialog.openDialog();
      this.onQueryList();
    },
    onQueryList() { // 点击查询
      this.pager.page = 1;
      this.getItemList();
    },
    getItemList() { // 获取角色对应排口
      const { rows, page } = this.pager;
      this.loading = true;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    onDeleteItem() { // 点击删除
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.delete(this.url, { data: this.selectedIds }).then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: '删除成功',
              duration: 3000,
              showClose: true,
            });
            this.getItemList();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
            });
          }
        }, (response) => {
          analyzeResp(response);
        });
      });
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
