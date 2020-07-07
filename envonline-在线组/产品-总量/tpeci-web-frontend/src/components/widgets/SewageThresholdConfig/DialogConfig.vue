<template>
  <dialog-modal title="配置方案详情" scrollbar size="middle" ref="dialog" @close="onCloseDialog">
    <el-tabs
      style="margin: 0 -10px;"
      fill
      v-model="activeName"
      type="border-card"
      @tab-click="onTabClick"
    >
      <el-tab-pane label="配置站点列表" name="first">
        <port-list-config ref="first" :mainrow="mainrow"/>
      </el-tab-pane>
      <el-tab-pane label="总量阈值" name="second">
        <total-threshold ref="second" :mainrow="mainrow"/>
      </el-tab-pane>
      <el-tab-pane label="浓度阈值" name="three">
        <concentration-threshold ref="three" :mainrow="mainrow"/>
      </el-tab-pane>
    </el-tabs>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import ConcentrationThreshold from './ConcentrationThreshold';
import TotalThreshold from './TotalThreshold';
import PortListConfig from './PortListConfig';

export default {
  components: {
    ConcentrationThreshold,
    TotalThreshold,
    PortListConfig,
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
    onCloseDialog() {     // 关闭弹窗触发
      this.activeName = 'first';
      this.$refs.first.closeDialog();
      this.$refs.second.closeDialog();
      this.$refs.three.closeDialog();
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
