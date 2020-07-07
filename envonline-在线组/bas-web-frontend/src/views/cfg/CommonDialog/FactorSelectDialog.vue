<template>
  <!-- 污染源因子选择弹框 -->
  <dialog-modal ref="dialog" title="选择中文名称" size="large">
  <!-- 查询表单 -->
    <div class="mar-l-sm mar-y-xs">
      <el-form inline :model="queryForm">
        <el-form-item label="因子名称：">
          <el-input v-model="queryForm.factorName" clearable style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
  <!-- 因子列表 -->
    <el-table
      border
      height="calc(100% - 79px)"
      v-loading="loading"
      highlight-current-row
      :data="itemList">
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="76">
        <template slot-scope="scope">
          <el-button type="success" icon="fas fa-check" @click="onClickCheck(scope.row)">确认</el-button>
        </template>
      </el-table-column>
      <el-table-column property="factorName" label="因子名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorCode" label="因子编号" show-overflow-tooltip></el-table-column>
      <el-table-column property="variableName" label="变量值" show-overflow-tooltip></el-table-column>
      <el-table-column property="orderNum" label="排序值" show-overflow-tooltip></el-table-column>
      <el-table-column property="phonetic" label="因子拼音" show-overflow-tooltip></el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import { queryList } from '@/plugins/mixins';

export default {
  mixins: [queryList],
  name: 'FactorSelectDialog',
  data() {
    return {
      loading: false,         // 表格数据加载状态
      itemModel: {},          // 编辑表单绑定变量
      itemList: [],           // 数据项列表
      queryForm: {            // 查询表单绑定变量
        factorName: '',         // 中文名称
      },
      pager: {
        pags: 1,
        rows: 15,
        total: 0,
      },
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 父组件调用弹框
    openDialog() {
      this.$refs.dialog.openDialog();
    },
    // 单击查询数据项
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 选择项
    onClickCheck(row) {
      this.$emit('selected', row);
      this.$refs.dialog.closeDialog();
    },
    // 获取产品数据列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('cfg/factorsMain', {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.total = response.data.count;
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
    // 编辑表单弹框关闭回调
    onCloseDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
    },
  },
};
</script>
