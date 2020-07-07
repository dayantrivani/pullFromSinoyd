<template>
  <dialog-modal scrollbar title="仪器详细信息" size="middle"
    ref="dialog" @close="closeDialog" :contentClass="''"
  >
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基本信息" name="first">
        <pane-basic-message ref="basicMessage" :row="row" @btn-close="btnClose"/>
      </el-tab-pane>
      <el-tab-pane label="监测因子" name="second">
        <pane-survey-factor ref="sruveyFactor" :row="row"/>
      </el-tab-pane>
    </el-tabs>
  </dialog-modal>
</template>

<script>
import PaneBasicMessage from './PaneBasicMessage';
import PaneSurveyFactor from './PaneSurveyFactor';

export default {
  data() {
    return {
      activeName: 'first',    // 选中某个标签页
      row: {},                // 列表行数据
    };
  },
  components: {
    PaneBasicMessage,
    PaneSurveyFactor,
  },
  methods: {
    openDialog(row) {
      this.row = row;
      this.$refs.dialog.openDialog();
      this.onPaneMethods();
    },
    // 点击保存或关闭按钮触发关闭弹框
    btnClose() {
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {
      this.activeName = 'first';
      // 1. 清空监测因子的数据
      // this.$refs.surveyFactor.keyWord = '';
      // this.$refs.surveyFactor.selection = [];
      // this.$refs.surveyFactor.pageSize = 15;
      // this.$refs.surveyFactor.currentPage = 1;
      // this.$refs.surveyFactor.clearSelection();
      // 2. 清空基本信息的数据
      // this.$refs.basicMessage.onCloseDialog('basicMessageForm', true);
      // 3. 修改标签页默认项
      // this.activeName = 'first';
    },

    /* 特殊 */
    onPaneMethods() {
      this.$nextTick(() => {
        // 在对话框打开时, 基础数据页需要调用的方法
        this.$refs.basicMessage.onPaneQuery();
        // 在对话框打开时, 监测因子需要调用的方法
        this.$refs.sruveyFactor.onPaneQuery();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
