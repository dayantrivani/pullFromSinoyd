<template>
  <!-- 处理记录 -->
  <dialog-modal
    title="监测污染物"
    scrollbar
    view
    size="middle"
    ref="dialog"
    @close="closeDialog"
  >
    <!-- <div class="mar-y-xs mar-x-xs">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button
        icon="fas fa-times"
        @click="$refs.dialog.closeDialog()">关 闭
      </el-button>
    </div> -->

    <el-table
      border
      highlight-current-row
      height="100%"
      :data="itemList"
    >
      <el-table-column fixed align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column label="监测因子名称" prop="factorName" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="监测因子编码" prop="factorCode" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="unit" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="上限" prop="alertUpper" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="下限" prop="alertLow" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="排序" prop="orderNum" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.getLabel('FACTOR_STATUS', row.status || 0)}}
        </template>
      </el-table-column>
    </el-table>
    <!-- <paging-query :pager="pager" @query="getItemList"/> -->
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
// import { queryList } from '@/global/libs/mixins';

export default {
  name: 'DialogItem',
  // mixins: [queryList],
  data() {
    return {
      // url: '',
      itemList: [],
    };
  },
  methods: {
    openDialog(row) {
      if (row) {
        this.itemList = _.cloneDeep(row.dtoPumpStation2FactorList);
      }
      this.$refs.dialog.openDialog();
    },

    /* 特殊方法 */
    closeDialog() {
      this.itemList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
