<template>
  <div>
    <dialog-modal ref="dialog" size="middle" title="通道详情" @close="closeDialog">
      <div class="mar-y-xs">
        <el-button type="primary" icon="fas fa-plus" @click="openChannelDialog()">新 增</el-button>
        <el-button
          type="danger"
          icon="fas fa-trash-alt"
          :disabled="!selectedIds.length"
          @click="onDeleteItem()"
        >删 除</el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        height="55vh"
        class="mar-t-sm"
        :data="itemList"
        highlight-current-row
        @selection-change="changeSelected"
      >
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="fas fa-pencil-alt"
              @click="openChannelDialog(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="devCode" label="设备编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="channelCode" label="通道编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="channelNum" label="通道数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="channelName" label="通道名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="channelRtmp" label="rtmp的配置信息" show-overflow-tooltip></el-table-column>
        <el-table-column prop="channelConfig" label="完整的配置信息" show-overflow-tooltip></el-table-column>
      </el-table>
      <paging-query :pager="pager" @query="getItemList" />
    </dialog-modal>
    <vedio-channel-dialog ref="channelDialog" @query="getItemList" />
  </div>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import VedioChannelDialog from './VedioChannelDialog';

export default {
  name: 'VedioChannel',
  mixins: [queryList, deleteItem],
  components: {
    VedioChannelDialog,
  },
  data() {
    return {
      url: 'cfg/videoChannel',
      mainId: '',
      queryForm: {
        devId: '',
      },
    };
  },
  methods: {
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    // 打开此弹窗
    openDialog(row) {
      this.queryForm.devId = row.id;
      this.mainId = row.id;
      this.$refs.dialog.openDialog();
      this.onQueryList();
    },
    // 新增编辑弹窗
    openChannelDialog(row) {
      this.$refs.channelDialog.openDialog(row, this.mainId);
    },
    // 弹框关闭前的回调
    closeDialog() {
      this.selectedIndex = [];
      this.selectedIds = [];
    },
  },
};
</script>
