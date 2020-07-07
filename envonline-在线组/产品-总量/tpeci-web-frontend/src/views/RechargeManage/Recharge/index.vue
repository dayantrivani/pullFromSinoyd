<template>
  <!-- 充值 -->
  <el-tabs fill v-model="activeName" type="border-card" @tab-click="onTabClick">
    <el-tab-pane label="远程充值" name="first">
      <remote-recharge ref="first"/>
    </el-tab-pane>
    <el-tab-pane label="IC卡充值" name="second">
      <I-c-card-recharge ref="second"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ICCardRecharge from './components/ICCardRecharge';
import RemoteRecharge from './components/RemoteRecharge';

export default {
  components: {
    ICCardRecharge,
    RemoteRecharge,
  },
  data() {
    return {
      activeName: 'first', // 选中某个标签页
      mainrow: {},         // 主列表选中的对象
    };
  },
  mounted() {
    this.openDialog();
  },
  methods: {
    openDialog() {     // 打开对话框
      this.$nextTick(() => {
        this.$refs.first.openDialog();
      });
    },
    onTabClick(val) {     // 标签页被选中时触发
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
