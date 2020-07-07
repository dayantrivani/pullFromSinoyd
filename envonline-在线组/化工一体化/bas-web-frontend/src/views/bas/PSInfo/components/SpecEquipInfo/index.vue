<template>
  <el-card type="title">
    <template slot="header">特种设备列表</template>
    <div class="mar-y-xs mar-l-sm">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem(getItemList)"
      >删 除</el-button>
    </div>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width=70>
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" prop="equipmentName" show-overflow-tooltip></el-table-column>
      <el-table-column label="设备编号" prop="equipmentNumber" show-overflow-tooltip></el-table-column>
      <el-table-column label="设备类型" prop="equipmentTypeName" show-overflow-tooltip></el-table-column>
      <el-table-column label="检验日期" prop="inspectionDate" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-show="scope.row.inspectionDate !== '1900-01-01 00:00:00'">
            {{ scope.row.inspectionDate | date }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="检验到期日期" prop="expiryDate" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-show="scope.row.expiryDate !== '1900-01-01 00:00:00'">
            {{ scope.row.expiryDate | date }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <dialog-form ref="dialog" @query="getItemList"></dialog-form>
  </el-card>
</template>

<script>
// import { analyzeResp } from '@/libs/util';
import { mapState } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';

export default {
  name: 'SpecEquipInfo',
  mixins: [queryList, deleteItem],
  components: { DialogForm },
  data() {
    return {
      url: 'bas/specEquipInfo',
      itemList: [],
      queryForm: {
        psId: JSON.parse(sessionStorage.getItem('psInfo')).id,
      },
    };
  },
  created() {},
  watch: {},
  computed: {
    // 企业信息
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  methods: {
    onClickAdd() {
      const data = { psId: this.psInfo.id };
      this.$refs.dialog.openDialog(data);
    },
    onClickEdit(item) {
      this.$refs.dialog.openDialog(item);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
