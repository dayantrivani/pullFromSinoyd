<template>
  <!-- 逾期记录 -->
  <div class="fill-h">
    <el-table
      border
      height="calc(100% - 32px)"
      highlight-current-row
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="处理部门" prop="processDept" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="签收时间" prop="acceptTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="应签收时间" prop="acceptEndTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理人" prop="processPerson" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理时间" prop="processTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="应处理时间" prop="processEndTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理意见" prop="processOpinion" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </div>
</template>

<script>
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'processingDept',
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
      url: 'petition/processingDept',
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
