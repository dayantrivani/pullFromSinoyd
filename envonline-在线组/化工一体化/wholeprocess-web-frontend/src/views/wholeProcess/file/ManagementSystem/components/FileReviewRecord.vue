<template>
<!-- 评审附件列表 -->
  <dialog-modal
    type="title"
    ref="dialog"
    size="middle"
    maxScrollbar
    :title="title"
    @close="closeDialog">
    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-cloud-upload-alt"
        @click="onClickAdd">上 传</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(85vh - 125px)"
      v-loading="loading"
      :data="itemList">
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="76">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="fas fa-eye" @click="onClickSee(row)">查 看</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column property="operatorName" label="评审人" min-width="80" show-overflow-tooltip></el-table-column> -->
      <el-table-column property="operateTime" label="最新评审时间" min-width="160" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <file-review-dialog ref="fileDialog" title="评审记录" @query="getItemList"></file-review-dialog>
  </dialog-modal>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import FileReviewDialog from './FileReviewDialog';

export default {
  name: 'FileReviewRecord',
  mixins: [queryList],
  components: {
    FileReviewDialog,
  },
  props: {
    title: {
      default: '',
    },
  },
  data() {
    return {
      // 评审记录列表
      isAuto: false,
      url: 'wholeprocess/fileReviewRecord',
      itemList: [],
      queryForm: {
        fileId: '',
        sort: 'createDate-',
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
    // 新增评审记录
    onClickAdd() {
      this.$refs.fileDialog.openDialog({ fileId: this.queryForm.fileId });
    },
    onClickSee(row) {
      this.$refs.fileDialog.openDialog(row);
    },
  },
};
</script>

<style>
</style>
