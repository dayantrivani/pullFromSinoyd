<template>
<!-- 浏览记录弹窗 -->
  <dialog-modal
    type="title"
    ref="dialog"
    size="middle"
    maxScrollbar
    :title="title"
    @close="closeDialog">

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(85vh - 125px)"
      v-loading="loading"
      :data="itemList">
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="departmentId" label="所属部门" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="userName" label="人员" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column property="createTime" label="最新浏览时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="browseTimes" label="累计次数" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'FileRecordDialog',
  mixins: [queryList],
  props: {
    title: {
      default: '',
    },
  },
  data() {
    return {
      // 评审记录列表
      isAuto: false,
      url: 'wholeprocess/fileBrowseRecord',
      itemList: [],
      queryForm: {
        fileId: '',
        sort: 'createTime-',
      },
    };
  },
  methods: {
    openDialog(item) {
      this.queryForm.fileId = item.id;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>

<style>
</style>
