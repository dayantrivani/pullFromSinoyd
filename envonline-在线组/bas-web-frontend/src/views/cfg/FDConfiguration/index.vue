<template>
  <el-card fill>
    <!-- 因子显示配置 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="配置名称：">
          <el-input  v-model="queryForm.pageName" placeholder="配置名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="配置编号：">
          <el-input v-model="queryForm.pageCode" placeholder="配置编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="模块名称：">
          <el-input v-model="queryForm.modelName" placeholder="模块名称" clearable></el-input>
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
        @click="onDeleteItemT">删 除
      </el-button>
    </div>
    <el-table
      height="calc(100% - 76px)"
      border
      v-loading="loading"
      highlight-current-row
      :data="itemList"
      @select="_select"
      @select-all="_selectAll"
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37">
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
import { queryList, deleteItem } from '@/plugins/mixins';
import AddOrEditDialog from './components/AddOrEditDialog.vue';
import ConfigDialog from './components/ConfigDialog';

export default {
  name: 'FDConfiguration',
  mixins: [queryList, deleteItem],
  components: {
    AddOrEditDialog,
    ConfigDialog,
  },
  data() {
    return {
      url: 'cfg/pageShowMain',
      selectedIds: [],             // 已选择的数据 id 数组
      queryForm: {                 // 查询数据内容。
        pageName: '',    // 配置名称
        pageCode: '',    // 配置编号
        modelName: '',   // 模块名称
        sort: 'pageCode',
      },
      title: '新增',
    };
  },
  created() {
    if (this.isAuto) this.onQueryList();
  },
  methods: {
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
