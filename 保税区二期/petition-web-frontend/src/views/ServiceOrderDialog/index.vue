  <!-- 服务工单详情 -->
<template>
  <el-dialog
    ref="dialog"
    v-drag="true"
    :visible.sync="dialogVisible"
    width="80%"
    top="7vh"
    @close="onCloseDialog">
    <!-- 标题 -->
    <template slot="title">
      <span class="el-dialog__title">
        <i class="icon icon-dialog mar-r-xs"></i>
        <span><slot name="title">服务工单详情</slot></span>
      </span>
    </template>
    <el-tabs type="border-card" v-model="activeName" class="fill-tab" @tab-click="onTabClick">
      <el-tab-pane label="基本信息" name="itemInfo" lazy style="overflow: auto;">
        <item-info :item="item"></item-info>
      </el-tab-pane>
      <el-tab-pane label="下级部门处理" name="dataCurve" lazy>
        <processing-dept></processing-dept>
      </el-tab-pane>
      <el-tab-pane label="补充反馈信息" name="alarmRecord" lazy>
        <supplementary-info></supplementary-info>
      </el-tab-pane>
      <el-tab-pane label="申请延时记录" name="station" lazy>
        <apply-delay></apply-delay>
      </el-tab-pane>
      <el-tab-pane label="办理跟踪" name="remoteControl" lazy>
        <processing-detail></processing-detail>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import itemInfo from './components/itemInfo';
import processingDept from './components/processingDept';
import supplementaryInfo from './components/supplementaryInfo';
import applyDelay from './components/applyDelay';
import processingDetail from './components/processingDetail';

export default {
  name: 'RealTimeMonitorDetails',
  components: {
    itemInfo,
    processingDept,
    supplementaryInfo,
    applyDelay,
    processingDetail,
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'itemInfo',
      item: {},
    };
  },
  watch: {},
  methods: {
    // 打开对话框
    openDialog(item) {
      this.item = item;
      this.dialogVisible = true;
    },
    onCloseDialog() {
      this.activeName = 'itemInfo';
    },
    onTabClick(tab) {
      this.$nextTick(() => {
        if (tab.$children[0].queryForm) {
          tab.$children[0].queryForm.petitionInfoId = this.item.petitionInfoId || this.item.id;
          tab.$children[0].getItemList();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fill-tab {
  height: calc(100vh - 150px);
}
</style>
