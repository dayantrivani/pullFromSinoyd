<template>
  <!-- 走航因子 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>
        <el-form-item label="因子名称：">
          <el-input
            v-model="queryForm.factorName"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 69px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="76">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="因子名称" prop="factorName" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="因子编码" prop="factorCode" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="浓度单位" prop="unit" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="上限值" prop="alertUpper" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="上限值单位" prop="alertUpperUnit" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="排序值" prop="orderNum" min-width="90" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-form ref="dialog" @query="getItemList"/>
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';

export default {
  name: 'VoyageFactorInfo',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'voyage/factorInfo',
      isAuto: false,
      loading: false,
      queryForm: {                  // 检索表单项
        factorName: '',             // 因子名称
        sort: 'orderNum-',
      },
      itemList: [],
    };
  },
  computed: {
  },
  created() {
    this.onQueryList();
  },
  methods: {
    onClickAdd() {                  // 新增按钮
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {              // 编辑按钮
      this.$refs.dialog.openDialog(row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
