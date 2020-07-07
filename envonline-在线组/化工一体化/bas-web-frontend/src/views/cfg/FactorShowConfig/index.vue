<template>
  <el-card fill>
    <!-- 因子显示配置 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="配置名称：">
          <el-input  v-model="queryForm.pageName" clearable></el-input>
        </el-form-item>
        <el-form-item label="配置编号：">
          <el-input v-model="queryForm.pageCode" clearable></el-input>
        </el-form-item>
        <el-form-item label="模块名称：">
          <el-input v-model="queryForm.modelName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>
    <el-table
      height="calc(100% - 76px)"
      border
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="36">
      </el-table-column>
      <el-table-column align="center" label="No." width="50" type="index">
      </el-table-column>
      <el-table-column align="center" label="操作" width="116">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-eye" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickConfig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
      <el-table-column label="配置名称" prop="pageName" show-overflow-tooltip></el-table-column>
      <el-table-column label="配置编号" prop="pageCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="模块名称" prop="modelName" show-overflow-tooltip> </el-table-column>
      <el-table-column label="是否启用" prop="isEnabled" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.isEnabled ? "启用" : "停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="orderNum" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <add-or-edit-dialog ref="dialog" :title="title" @query="getItemList"/>
    <config-dialog ref="configDialog" @query="getItemList"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
// import { queryList, deleteItem } from '@/global/libs/mixins';
import AddOrEditDialog from './components/AddOrEditDialog.vue';
import ConfigDialog from './components/ConfigDialog';

export default {
  name: 'FactorShowConfig',
  // mixins: [queryList, deleteItem],
  components: {
    AddOrEditDialog,
    ConfigDialog,
  },
  data() {
    return {
      loading: false,
      url: 'cfg/pageShowMain',          // 已选择的数据 id 数组
      queryForm: {                 // 查询数据内容。
        pageName: '',    // 配置名称
        pageCode: '',    // 配置编号
        modelName: '',   // 模块名称
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
  created() {
    this.onQueryList();
  },
  methods: {
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
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
    // 点击新增按钮
    onClickAdd() {
      this.title = '新增';
      this.$refs.dialog.openDialog();
    },
    // 点击编辑按钮
    onClickEdit(val) {
      this.title = '编辑';
      this.$refs.dialog.openDialog(val);
    },
    // 点击配置按钮
    onClickConfig(val) {
      this.$refs.configDialog.openDialog(val);
    },
  },
};
</script>
