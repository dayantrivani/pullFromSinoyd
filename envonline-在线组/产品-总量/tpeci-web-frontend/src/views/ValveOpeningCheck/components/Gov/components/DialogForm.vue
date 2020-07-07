<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    title="开关阀详情"
  >
    <el-form
      ref="form"
      :rules="formRules"
      :model="itemModel"
      label-width="90px"
      class="item-space pad-a-xs">
      <el-form-item label="审核结果：" prop="status">
        <el-select v-model="itemModel.status">
          <el-option :value="2" label="同意"></el-option>
          <el-option :value="3" label="退回"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="开阀命令：" prop="dealRemark">
        <el-checkbox v-model="itemModel.sendCommand">是否立即开阀</el-checkbox>
      </el-form-item> -->
      <el-form-item label="审核意见：" prop="dealRemark" :required="[3, '3'].includes(this.itemModel.status)">
        <el-input v-model="itemModel.dealRemark" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="success"
        icon="fas fa-cloud-upload-alt"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">确 认</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </span>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';

export default {
  mixins: [saveItem],                     // 使用混合
  data() {
    const dealRemarkRule = (rule, value, callback) => {
      if ([3, '3'].includes(this.itemModel.status)) {
        if (value === '') {
          callback('请输入审核意见');
        } else {
          callback();
        }
      } else {
        callback();
        this.$nextTick(() => {
          this.$refs.form.clearValidate('dealRemark');
        });
      }
    };
    return {
      url: 'tpeci/valveOpenApply/changeStatus',
      itemModel: {
        ids: [],
        status: 2,
        // sendCommand: true,
        dealRemark: '',
      },
      formRules: { // 表单验证规则
        status: [
          { required: true, message: '请选择审核结果', trigger: ['change', 'blur'] },
        ],
        dealRemark: [
          { validator: dealRemarkRule, trigger: ['change', 'blur'] },
        ],
      },
    };
  },
  methods: {
    openDialog(ids) {
      this.itemModel.ids = [...ids];
      this.$refs.dialog.openDialog();
    },
    /* 特殊方法 */
    saveCallback() {             // 保存按钮回调
      this.$message('如需发送开阀命令，请到远程控制页面');
      this.itemModel = {
        ids: [],
        status: 2,
        dealRemark: '',
      };
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
