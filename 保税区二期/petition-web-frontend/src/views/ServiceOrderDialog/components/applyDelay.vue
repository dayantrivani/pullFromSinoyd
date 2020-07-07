<template>
  <!-- 逾期记录 -->
  <div style="height: 100%">
    <el-table
      border
      height="calc(100% - 32px)"
      highlight-current-row
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="申请人" prop="applicant" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="申请时间" prop="applyTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核人" prop="approver" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核时间" prop="approveTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="申请延时时间" prop="applyDelayTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="实际延时时限" prop="actualDelayTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="应处理时限" prop="mustDealTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核状态" prop="approveStatus" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </div>
</template>

<script>
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'applyDelay',
  mixins: [                   // 混合
    queryList,
  ],
  props: {
    petitionInfoId: {
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      isAuto: false,
      url: 'petition/applyDelay',
      queryForm: {
        workNo: '', // 服务工单编号
        petitionInfoId: '', // 信访主键id
        sort: 'serialNo+',
      },
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
      itemList: [],
    };
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
  },
};
</script>

<style>

</style>
