<template>
  <dialog-modal
    title="项目详情"
    scrollbar
    view
    size="middle"
    ref="dialog"
    @close="closeDialog">
    <el-tabs
      style="margin: 0 -10px;"
      fill
      v-model="activeName"
      type="border-card"
      @tab-click="onTabClick"
    >
      <el-tab-pane label="基本信息" name="first">
        <base-info ref="first" :mainrow="mainrow" @query="closeDialog"/>
      </el-tab-pane>
      <el-tab-pane label="数据详情" name="second">
        <details-data ref="second" :mainrow="mainrow"/>
      </el-tab-pane>
      <el-tab-pane label="走航结果" name="three">
        <Navigation-Results ref="three" :mainrow="mainrow" @query="closeDialog"/>
      </el-tab-pane>
    </el-tabs>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import BaseInfo from './TabPanes/BaseInfo';
import DetailsData from './TabPanes/DetailsData';
import NavigationResults from './TabPanes/NavigationResults';

export default {
  components: {
    BaseInfo,
    DetailsData,
    NavigationResults,
  },
  data() {
    return {
      activeName: 'first', // 选中某个标签页
      mainrow: {},         // 主列表选中的对象
    };
  },
  methods: {
    openDialog(row) {        // 打开对话框
      this.$refs.dialog.openDialog();
      this.mainrow = _.cloneDeep(row);
      this.$nextTick(() => {
        this.$refs.first.openDialog();
      });
    },
    onTabClick(val) {    // 标签页被选中时触发
      this.$refs[val.name].openDialog();
    },
    closeDialog(val) {     // 关闭弹窗触发
      this.activeName = 'first';
      this.$refs.first.closeDialog();
      this.$refs.second.closeDialog();
      this.$refs.three.closeDialog();
      this.$refs.dialog.closeDialog();
      if (val) {
        this.$emit('query');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
