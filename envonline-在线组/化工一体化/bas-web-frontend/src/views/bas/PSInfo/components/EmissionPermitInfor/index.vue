<template>
  <el-card type="title">
    <template slot="header">排污许可信息</template>
    <el-form :model="queryForm" inline class="mar-l-sm mar-t-xs">
      <el-form-item>
        <el-input v-model="queryForm.permitCode" placeholder="排污许可证编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <hr>
    <el-button type="primary" icon="fas fa-plus" @click="onClickAdd" class="mar-l-sm mar-y-xs">新 增</el-button>
    <el-button
      type="danger"
      icon="fas fa-trash-alt"
      :disabled="!selectedIds.length"
      @click="onDeleteItem(getItemList)"
    >删除</el-button>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 109px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="76">
        <template slot-scope="scope">
          <!-- <el-button type="primary" icon="fas fa-file-invoice" @click="onClickCheck(scope.row)">详情</el-button> -->
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <!-- <el-button type="danger" icon="fas fa-trash-alt" @click="onClickDelete(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" show-overflow-tooltip></el-table-column>
      <el-table-column label="排污许可证编号" prop="permitCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="有效日期开始" prop="validStartDate" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-show="scope.row.validStartDate !== '1900-01-01 00:00:00'">
            {{ scope.row.validStartDate | date }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="有效日期截止" prop="validEndDate" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-show="scope.row.validEndDate !== '1900-01-01 00:00:00'">
            {{ scope.row.validEndDate | date }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <dialog-form ref="dialog" @query="getItemList"></dialog-form>
  </el-card>
</template>

<script>
// import { analyzeResp } from '@/global/libs/util';
import { mapState } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';

export default {
  name: 'EmissionPermitInfor',
  mixins: [queryList, deleteItem],
  components: { DialogForm },
  data() {
    return {
      url: 'bas/pollutantDischargePermit',
      queryForm: {
        permitCode: '',
        psId: JSON.parse(sessionStorage.getItem('psInfo')).id,
      },
    };
  },
  computed: {
    // 企业信息
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  created() {},
  watch: {},
  methods: {
    onClickAdd() {
      this.$refs.dialog.isCheck = false;
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {
      this.$refs.dialog.isCheck = false;
      this.$refs.dialog.openDialog(row);
    },
    // onClickCheck(row) {
    //   this.$refs.dialog.isCheck = true;
    //   this.$refs.dialog.openDialog(row);
    // },
    // onClickDelete(row) {
    //   this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(() => {
    //     this.$http.delete('bas/pollutantDischargePermit', { data: [row.id] })
    //       .then((response) => {
    //         this.getItemList();
    //         this.$message({
    //           showClose: true,
    //           type: response.data.success ? 'success' : 'warning',
    //           message: response.data.msg,
    //         });
    //       }, ({ response }) => {
    //         analyzeResp(response);
    //       });
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>

</style>
