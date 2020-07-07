<template>
  <!-- 人员短信发送配置 -->
  <el-card class="title-card" type="title">
    <!-- <div slot="header"><span>人员短信发送配置</span></div> -->
    <!-- 查询表单 -->
    <el-form inline :model="queryForm" class="mar-t-xs mar-l-xs fn-no-wrap">
      <el-form-item label="姓名：">
        <el-input
          clearable
          v-model="queryForm.userName"
          placeholder="请输入姓名"
          @keyup.enter.native="onQueryList">
        </el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input
          clearable
          v-model="queryForm.telephone"
          placeholder="请输入手机号"
          @keyup.enter.native="onQueryList">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <hr/>
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDelItem">删 除
      </el-button>
    </div>
    <el-table
      border
      height="calc(100% - 73px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" prop="waterStorageStatus" min-width="127px" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-file-invoice"
            @click="onClickEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button
            type="primary"
            icon="fas fa-cog"
            @click="onClickPort(scope.row)">
            排口
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="userName" label="姓名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="telephone" label="手机号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="email" label="邮箱" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="orgName" label="部门名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="headShip" label="职位" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="configNames" label="发送方案" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <add-dialog ref="addDialog" @onQueryList="onQueryList"></add-dialog>
    <edit-dialog ref="editDialog" @onQueryList="onQueryList"></edit-dialog>
    <port-dialog ref="portDialog"></port-dialog>
  </el-card>
</template>

<script>
import AddDialog from './components/AddDialog';
import EditDialog from './components/EditDialog';
import PortDialog from './components/PortDialog';

export default {
  name: 'AlarmUser',
  components: {
    AddDialog,
    EditDialog,
    PortDialog,
  },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      loading: false,
      queryForm: {
        psId,
        userName: '',
        telephone: '',
      },
      selectedIds: [],
      pager: {
        rows: 15,
        page: 1,
        count: 1,
      },
      itemList: [],
    };
  },
  created() {
    this.getItemList();
  },
  computed: {},
  methods: {
    // 页面基本方法
    index(index) { // 表格索引衔接
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    _rowClassName({ row }) { // 勾选样式修改
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    // 表格
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    onClickAdd() { // 新增事件
      this.$refs.addDialog.openDialog();
    },
    onClickEdit(id) { // 编辑事件
      this.$refs.editDialog.openDialog(id);
    },
    onClickPort(row) { // 点击排口事件
      this.$refs.portDialog.openDialog(row);
    },
    getItemList() {
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.get('alarm/alarmUserInfo', {
        params: {
          rows,
          page,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    onDelItem() { // 删除计划
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('alarm/alarmUserInfo', { data: this.selectedIds })
      )).then((response) => {
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
        this.$hp.resp(response);
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
