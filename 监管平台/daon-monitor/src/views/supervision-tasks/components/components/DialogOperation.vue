<template>
  <a-modal
    class="modal-alarm"
    :title="operation"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-form :form="form">
      <a-form-item label="理由：" :labelCol="{span:4}" :wrapperCol="{span:20}">
        <a-textarea :placeholder="`请输入${operation}理由`" :autosize="{ minRows: 3, maxRows: 5 }" v-decorator="['reason']" />
      </a-form-item>
    </a-form>
    <div slot="footer">
      <a-button type="primary" icon="save" @click="onSave">确 定</a-button>
      <a-button icon="close" @click="closeDialog">取 消</a-button>
    </div>
  </a-modal>
</template>

<script>
import { backTask, closeTask } from '@/api/modules/supervision-tasks.js';

export default {
  data() {
    return {
      isVisible: false,
      operation: '',
      reason: '',
      taskId: '',
    };
  },
  methods: {
    openDialog(item, id) {
      this.operation = item;
      this.taskId = id;
      this.isVisible = true;
    },
    closeDialog() {
      this.isVisible = false;
      this.operation = '';
      this.taskId = '';
      this.reason = '';
    },
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.reason = fieldsValue.reason ? fieldsValue.reason : '';
        if (this.operation === '任务退回') {
          backTask(this.reason, this.taskId).then((response) => {
            if (response.data.code === 200) {
              this.$message.success('操作成功', 3);
              this.closeDialog();
              this.$emit('refresh');
            } else {
              this.$message.warning(response.data.message || response.data.msg, 3);
            }
          });
        } else {
          closeTask(this.reason, this.taskId).then((response) => {
            if (response.data.code === 200) {
              this.$message.success('操作成功', 3);
              this.closeDialog();
              this.$emit('refresh');
            } else {
              this.$message.warning(response.data.message || response.data.msg, 3);
            }
          });
        }
      });
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
};
</script>

<style lang="scss">

</style>
