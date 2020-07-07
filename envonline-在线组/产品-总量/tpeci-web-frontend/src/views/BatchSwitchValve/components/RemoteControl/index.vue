<!-- 远程控制 -->
<template>
<!-- table-dialog table-fill-h dialog-body-fill-h 弹窗里嵌套表格，无法自适应高度，需要高度百分百 -->
  <dialog-modal
    class="table-dialog table-fill-h dialog-body-fill-h"
    scrollbar
    type="title"
    ref="dialog"
    size="large"
    title="开关阀详情"
  >
    <el-row :gutter="$config.space" v-resize class="fill-h pad-b-sm">

      <el-col :span="16" class="pad-r-0">
        <remote-record ref="remoteRecord" :portId="portId"/>
      </el-col>

      <el-col :span="8">
        <control-config @onQueryList="onQueryList" :portId="portId"></control-config>
      </el-col>

    </el-row>
  </dialog-modal>
</template>

<script>
import RemoteRecord from './components/RemoteRecord';
import ControlConfig from './components/ControlConfig';

export default {
  name: 'RemoteControl',
  components: { RemoteRecord, ControlConfig },
  data() {
    return {
      portId: '',
    };
  },
  methods: {
    openDialog(row) {
      this.portId = row.portId;
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.onQueryList();
      });
    },
    onQueryList() {
      this.$refs.remoteRecord.onQueryList();
    },
  },
};
</script>

<style lang="scss">
  .table-dialog.table-fill-h.dialog-body-fill-h {
    .el-scrollbar__view {
      height: 100%;
      div.pad-x-sm {
        height: 100%;
      }
    }
  }
</style>
