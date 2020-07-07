<template>
  <!-- 运营商管理 -->
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="行政区域：">
          <select-tree-lazy v-model="queryForm.regionCodeId" />
        </el-form-item>
        <el-form-item label="企业名称：">
          <el-input v-model="queryForm.psName" placeholder="企业名称" clearable style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
  <!-- 评价标准列表 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDelete">删 除
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      height="calc(100% - 76px)"
      border
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="corporationName" label="法人代表" show-overflow-tooltip></el-table-column>
      <el-table-column property="contactMan" label="联系人" show-overflow-tooltip></el-table-column>
      <el-table-column property="industrialPark" label="所在区域" show-overflow-tooltip></el-table-column>
      <el-table-column property="psAddress" label="地址" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column property="passDate" label="成立日期"  min-width="160" show-overflow-tooltip></el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  <!-- 公共弹框 -->
    <PublicBouncedDailog ref="dialog" :dailogData="dailogData" @getData="getItemList"/>
  </el-card>
</template>

<script>
import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';
import PublicBouncedDailog from '@/views/bas/CommonDialog/PublicBouncedDailog';

export default {
  // name: 'EnterpriseSubconractor',
  name: 'EnterpriseOperator',
  components: {
    SelectTreeLazy,
    PublicBouncedDailog,
  },
  data() {
    return {
      selectedIds: [], // 表格选中的id集合
      width: '200px', // 传递给下拉组件
      loading: false, // 表格数据加载状态
      dailogData: {   // 传递给子组件的数据
        regionName: '', // 传递行政区域
        dialogtitle: '运营商信息',
        type: 128,  // 判断当前企业身份
        editData: {  // 点击编辑传递给组件数据
          id: '',
        },
      },
      queryForm: { // 查询表单绑定变量
        regionCodeId: '',  // 行政区域
        psName: '',        // 企业名称
      },
      // administrativeData: [], // 行政区域数据
      pager: {
        page: 1,
        rows: 15,
        total: 0,
      },
      itemList: [], // 表格数据
    };
  },
  created() {
    // 行政区域数据请求
    // this.$store.dispatch('psInfo/GET_AREA_TYPE', { codeValue: 'RegionCodeIdType' }).then((val) => {
    //   this.administrativeData = val;
    // });
    this.getItemList();
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    // 获取产品数据列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/psBaseInfo', {
        params: {
          page, rows, psTypes: '128',  ...this.queryForm,
        },
      }).then((response) => {
        this.itemList = response.data.data;
        this.pager.total = response.data.count;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 新增
    onClickAdd() {
      // this.dailogData.dialogVisible = true;
      this.$refs.dialog.openDialog();
    },
    // 编辑
    onClickEdit(row) {
      this.dailogData.regionName = row.regionName;
      this.dailogData.editData = row;
      this.$refs.dialog.getEditData();
      // this.dailogData.dialogVisible = true;
      this.$refs.dialog.openDialog();
    },
    onSaveSelected(selection) { // 表格选中的数据id
      this.selectedIds = selection.map(val => val.id);
    },
    // 删除数据项
    onDelete() {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/psBaseInfo/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          // if (this.pager.total <= this.pager.rows * this.pager.page) {
          //   this.pager.page -= 1;
          // }
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
