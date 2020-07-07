<template>
  <el-dialog
    append-to-body
    ref="dialog"
    width="400px"
    title="修改密码"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible">
    <el-form
      ref="form"
      label-position="right"
      label-width="106px"
      :model="itemModel"
      :rules="rules">
      <el-form-item label="旧密码：" prop="oldPwd">
        <el-input v-model="itemModel.oldPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPwd">
        <el-input v-model="itemModel.newPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码：" prop="checkPwd">
        <el-input v-model="itemModel.checkPwd" type="password"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" icon="el-icon-check" @click="onClickSave">保 存</el-button>
      <el-button icon="el-icon-close" @click="closeDialog">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
// 引入混合 - 保存记录方法
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      dialogVisible: false,
      itemModel: {
        oldPwd: '',
        newPwd: '',
        checkPwd: '',
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: ['blur', 'change'] },
        ],
        newPwd: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
        ],
        checkPwd: [
          { required: true, message: '请再次输入密码', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (value !== this.itemModel.newPwd) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions('auth', ['SavePass']),
    onClickSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem();
      });
    },
    onSaveItem() {
      const { oldPwd, newPwd } = this.itemModel;
      this.SavePass({ oldPwd, newPwd }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '成功修改密码，之后请使用新密码登录系统',
            duration: 1500,
            showClose: true,
          });
          this.closeDialog();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    // 打开对话框
    openDialog() {
      // 聚焦输入框
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.$refs.form.$el[0].focus();
      });
    },
    // 关闭对话框
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>
