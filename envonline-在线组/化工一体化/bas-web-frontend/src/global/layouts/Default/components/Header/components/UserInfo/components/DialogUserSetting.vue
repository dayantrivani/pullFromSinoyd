<template>
  <dialog-modal ref="dialog" append-to-body size="mini" title="修改密码">
    <el-form
      ref="form"
      class="item-space"
      label-position="right"
      label-width="99px"
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
      <el-button type="primary" icon="fas fa-save" @click="onClickSave">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </template>
  </dialog-modal>
</template>

<script>
// 引入混合 - 保存记录方法
import { mapState } from 'vuex';

export default {
  computed: mapState('auth', ['user']),
  data() {
    return {
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
    // 获取空对象
    getEmptyItem() {
      return {
        psName: '',                   // 企业名称
        psType: 1,                   // 企业类型
        psShortName: '',              // 企业简称
      };
    },
    onClickSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem();
      });
    },
    onSaveItem() {
      const { oldPwd, newPwd } = this.itemModel;
      this.$http.put('sinoyd-frame/sys/users/updatepwd', {}, {
        params: { loginID: this.user.loginID, oldPwd, newPwd },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '成功修改密码，之后请使用新密码登录系统',
            duration: 3000,
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
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.$refs.form.$el[0].focus();
      });

      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
