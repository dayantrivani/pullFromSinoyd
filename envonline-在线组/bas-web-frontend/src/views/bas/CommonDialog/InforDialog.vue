<template>
  <!-- <el-dialog class="inforDialog" :visible.sync="dialogVisible"
    title="仪器详细信息" width="95%" top="5vh" @close = "onCloseFullDialog"> -->
  <dialog-modal title="编辑仪器详细信息" size="large" ref="dialog" @close="onCloseFullDialog">
    <!-- tab-click 被选中时触发 -->
    <el-tabs fill v-model="activeName" type="border-card" @tab-click="selectTabClick">
      <el-tab-pane label="基本信息" name="first">
        <basic-message @onCloseDialog = "onCloseDialog"
          ref="basicMessage" :basicFormData="basicFormData">
        </basic-message>
      </el-tab-pane>
      <el-tab-pane label="监测因子" name="second">
        <survey-factor ref="surveyFactor" :basicFormData="basicFormData"></survey-factor>
      </el-tab-pane>
    </el-tabs>
  </dialog-modal>
  <!-- </el-dialog> -->
</template>

<script>
import BasicMessage from '@/components/widgets/InstruManagement/BasicMessage';
import SurveyFactor from '@/components/widgets/InstruManagement/SurveyFactor';

export default {
  name: 'inforDialog',
  props: ['basicFormData'],
  data() {
    return {
      activeName: 'first', // 选中某个标签页
      // dialogVisible: false, // dialog框显示隐藏
    };
  },
  components: {
    BasicMessage,
    SurveyFactor,
  },
  methods: {
    selectTabClick() { // tab被选中时触发
    },
    openDialog() { // 父组件打开子组件dialog框
      // this.dialogVisible = true;
      this.$refs.dialog.openDialog();
    },
    onCloseDialog() { // 子组件关闭父组件dialog框
      this.$emit('onSearchQuery');
      // this.dialogVisible = false;
      this.$refs.dialog.closeDialog();
    },
    onCloseFullDialog() { // 关闭前的回调
      // 1. 清空监测因子的数据
      this.$refs.surveyFactor.keyWord = '';
      this.$refs.surveyFactor.selection = [];
      this.$refs.surveyFactor.pageSize = 15;
      this.$refs.surveyFactor.currentPage = 1;
      this.$refs.surveyFactor.clearSelection();
      // 2. 清空基本信息的数据
      this.$refs.basicMessage.onCloseDialog('basicMessageForm', true);
      // 3. 修改标签页默认项
      this.activeName = 'first';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
