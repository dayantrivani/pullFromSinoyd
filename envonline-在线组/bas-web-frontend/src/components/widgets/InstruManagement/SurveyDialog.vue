<template>
  <dialog-modal
    ref="dialog"
    title="污染物批量配置"
    @close="onCloseDialog"
    size="large"
    :append-to-body="true">
    <div class="mar-y-xs">
      <el-form inline :model="queryForm">
        <el-form-item>
          <el-input v-model="queryForm.factorCode" placeholder="请输入编码" style="width: 190px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.oldFactorCode" placeholder="请输入原编码" style="width: 190px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.factorName" placeholder="请输入中文名称" style="width: 190px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
          <el-button
            type="success"
            icon="fas fa-check"
            :disabled="!selection.length"
            @click="onClickAdd">确 认
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      height="calc(100% - 79px)"
      v-loading="tableLoading"
      :data="tableData"
      highlight-current-row
      :row-class-name="_rowClassName"
      ref="surveyTableDialog"
      @selection-change="onSelectionChange">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="factorCode" label="编码"
        min-width="120">
      </el-table-column>
      <el-table-column property="factorName" label="中文名称"
        min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="oldFactorCode" label="原编码"
        min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="unit" label="单位(浓度)"
        min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="unitCou" label="单位(排放量)"
        min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="defaultDataType" label="缺省数据类型"
        min-width="120" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- <div class="surveyDialog mar-t-sm" style="text-align: right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 15, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div> -->
    <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      queryForm: { // 查询条件
        factorCode: '', // 编码
        factorsType: '',
        oldFactorCode: '', // 原编码
        factorName: '', // 中文名称
      },
      tableData: [ // 表格数据
        /*
        {
          factorCode: '',
          factorsName: '',
          oldFactorCode: '',
          unit: '',
          unitCou: '',
          defaultDataType: '',
        },
        */
      ],
      selection: [], // 记录勾选的数据
      // currentPage: 1, // 页码数
      // pageSize: 15, // 每页条数
      // total: 0, // 分页总条数
      pager: {
        total: 0,
        page: 1,
        rows: 15,
      },
      tableLoading: false, // 表格加载
    };
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selection.includes(row) ? className : '';
    },
    openDialog(val) { // 打开弹框
      this.queryForm.category = val;
      this.$refs.dialog.openDialog();
      this.selection = [];
      this.getItemList();
    },
    getItemList() { // 查询按钮
      this.tableLoading = true;
      // const { page, rows } = { // 分页条件
      //   rows: this.pageSize,
      //   page: this.currentPage,
      // };
      const { page, rows } = this.pager;
      const { queryForm } = this;
      this.$http.get('cfg/factors/', {
        params: { page, rows, ...queryForm },
      }).then((response) => {
        if (response.data.success) {
          this.tableData = response.data.data;
          // this.total = response.data.total;
          this.pager.total = response.data.count;
          // 修复分页存在的bug
          // if (!this.tableData.length && this.total) {
          //   this.currentPage--;
          //   this.onSearchQuery();
          // }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
        this.tableLoading = false;
      });
    },
    onClickAdd() { // 确认按钮
      if (!this.selection.length) {
        this.$message.warning({
          message: '请选择需要确认的数据',
          duration: 1500,
        });
        return;
      }
      this.$emit('fillTableData', {
        selection: this.selection,
      });
      this.$refs.dialog.closeDialog();
    },
    onSelectionChange(val) { // 数据选中状态修改时
      this.selection = val;
    },
    // handleSizeChange(val) { // pageSize改变时
    //   this.pageSize = val;
    //   this.tableLoading = true;
    //   this.getItemList();
    // },
    // handleCurrentChange(val) { // currentPage改变时
    //   this.currentPage = val;
    //   this.tableLoading = true;
    //   this.getItemList();
    // },
    onCloseDialog() { // dialog框关闭前的回调
      this.queryForm = {
        code: '', // 编码
        oldCode: '', // 原编码
        chineseName: '', // 中文名称
      };
      this.$refs.surveyTableDialog.clearSelection();
    },
    // 请求方法
  },
  created() {
    this.getItemList();
  },
};
</script>

<style lang="scss" scoped>
</style>
