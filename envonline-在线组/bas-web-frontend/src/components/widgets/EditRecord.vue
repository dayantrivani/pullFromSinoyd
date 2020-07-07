<template>
  <!-- 修改记录 -->
  <dialog-modal type="title" ref="dialog" size="large" title="修改记录" @close="closeDialog">

    <!-- 表单 -->
    <el-form inline :model="queryForm" class="mar-l-sm">
      <el-form-item label="修改时间：">
        <el-date-picker
          style="width:220px;"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd"
          v-model="dateRange"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table
      v-loading="loading"
      height="calc(100% - 67px)"
      border
      :data="itemList">
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column property="createTime" label="修改时间" width="151" show-overflow-tooltip></el-table-column>
      <el-table-column property="creatorName" label="修改人" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="columnEN" label="修改字段名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="oldValue" label="原始值" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column property="newValue" label="修改值" min-width="140" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

  </dialog-modal>
</template>

<script>
import { queryList } from '@/plugins/mixins';

export default {
  mixins: [queryList],
  data() {
    return {
      url: 'bas/psBaseInfoLogs/',
      isAuto: false,
      type: 'get',
      queryForm: {
        psId: '',
        fromDate: '',
        toDate: '',
        sort: 'createTime-',
      },
      itemList: [],
    };
  },
  computed: {
    dateRange: {
      get() {
        return (!this.queryForm.fromDate && !this.queryForm.toDate)
          ? ''
          : [this.queryForm.fromDate, this.queryForm.toDate];
      },
      set(val) {
        [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
      },
    },
  },
  methods: {
    openDialog(row) {
      this.queryForm.psId = row.id;
      const newTime = new Date();
      this.queryForm.toDate = this.$hp.dateFormat(newTime, 'Y-m-d H:i:s');
      this.queryForm.fromDate = this.$hp.formatDate(this.queryForm.toDate, -30);
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
