<template>
<!-- 新增或编辑按钮弹框 -->
  <dialog-modal
    ref="dialog"
    size="mini"
    :title="`${title}`"
    @close="onCloseDialog">
    <el-form ref="form" label-width="100px" :model="dialogModel" :rules="rules">
      <el-form-item label="配置名称：" prop="pageName">
        <el-input v-model="dialogModel.pageName"></el-input>
      </el-form-item>
      <el-form-item label="配置编号：" prop="pageCode">
        <el-input v-model="dialogModel.pageCode"></el-input>
      </el-form-item>
      <el-form-item label="模块名称：" prop="modelName">
        <el-input v-model="dialogModel.modelName"></el-input>
      </el-form-item>
      <el-form-item label="是否启用：" prop="isEnabled">
        <el-tooltip :content="dialogModel.isEnabled ? '启用' : '停用'" placement="top">
          <el-switch v-model="dialogModel.isEnabled"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="排序：" prop="orderNum">
        <el-input-number
          v-model="dialogModel.orderNum"
          controls-position="right"
          style="width: 100%;"
          :min="0"
          :max="2147483647"
          :precision="0">
        </el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onClickSave">保 存</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </span>
  </dialog-modal>
</template>

<script>
export default {
  name: 'AddOrEditDialog',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      saveLoading: false,
      url: 'cfg/pageShowMain', // 接口地
      dialogModel: {
        pageName: '',         // 配置名称
        pageCode: '',         // 配置编号
        modelName: '',        // 模块名称
        isEnabled: false,     // 是否启用
        orderNum: 1,          // 排序
      },
      rules: {
        pageName: [
          { required: true, message: '请输入配置名称', trigger: 'blur' },
        ],
        pageCode: [
          { required: true, message: '请输入配置编号', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    // 父组件调用子组件方法打开对话框
    openDialog(val) {
      if (val) this.dialogModel = val;
      this.$refs.dialog.openDialog();
    },
    // 保存按钮
    onClickSave() {
      const { id } = this.dialogModel;
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http[id ? 'put' : 'post'](this.url, this.dialogModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '编辑' : '新增'}成功`,
                duration: 3000,
                showClose: true,
              });
              this.$emit('query');
              this.$refs.dialog.closeDialog();
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 弹窗关闭前触发
    onCloseDialog() {
      this.dialogModel = {
        pageName: '',         // 配置名称
        pageCode: '',         // 配置编号
        modelName: '',        // 模块名称
        isEnabled: false,     // 是否启用
        orderNum: 1,          // 排序
      };
      this.$refs.form.resetFields();
    },
  },
};
</script>
