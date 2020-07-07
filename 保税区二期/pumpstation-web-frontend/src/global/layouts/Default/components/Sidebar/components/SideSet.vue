<template>
  <dialog-modal ref="dialog" title="导航设置" size="mini" append-to-body>
    <el-form
      class="mar-t-xs"
      ref="form"
      label-position="right"
      label-width="140px"
      :model="itemModel">
      <el-form-item label="一键自动展开层级：">
        <el-radio-group v-model="itemModel.level">
          <el-radio :label="1">一级</el-radio>
          <el-radio :label="2">二级</el-radio>
          <el-radio :label="3">全部层级</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" icon="fa fa-save" @click="onSaveSet">保 存</el-button>
      <el-button icon="fa fa-times" @click="close">关 闭</el-button>
    </template>
  </dialog-modal>
</template>

<script>
export default {
  name: 'SideSet',
  data() {
    return {
      itemModel: {
        level: 1,
      },
    };
  },
  methods: {
    open() {
      this.itemModel.level = this.$store.state.auth.level;
      this.$refs.dialog.openDialog();
    },
    close() {
      this.$refs.dialog.closeDialog();
    },
    // 保存设置
    onSaveSet() {
      // TODO 侧栏一键展开层级自定义设置
      this.$store.commit('auth/SetLevel', this.itemModel.level);
      this.close();
    },
  },
};
</script>
