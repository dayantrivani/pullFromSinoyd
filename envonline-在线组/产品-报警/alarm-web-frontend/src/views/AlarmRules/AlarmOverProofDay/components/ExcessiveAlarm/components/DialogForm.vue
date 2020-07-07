<template>
  <dialog-modal ref="dialog" :title="`${isEdit ? '编辑' : '新增'}报警级别`" @close="closeDialog" size="mini">
    <el-form
      ref="form"
      :model="itemModel"
      :rules="rules"
      label-width="121px"
      class="mar-x-sm item-space mar-t-sm pad-b-sm"
    >
      <el-form-item label="报警级别：" prop="alarmLevel">
        <el-select v-model="itemModel.alarmLevel">
          <el-option
            v-for="item in $enum.alarmLevel"
            :key="item.value"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="超标率上限(%)：">
        <el-input-number
          style="width:100%"
          v-model="itemModel.rateUpper"
          controls-position="right"
          :min="0"
          :max="100"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="超标率下限(%)：" prop="rateLow">
        <el-input-number
          style="width:100%"
          v-model="itemModel.rateLow"
          controls-position="right"
          :min="0"
          :max="100"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        :loading="saveLoading"
        type="primary"
        icon="fas fa-save"
        @click="onSaveCheck(refreshData)"
      >保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'DialogForm',
  mixins: [saveItem],
  components: {},
  data() {
    return {
      url: 'alarm/alarmRuleForOverProof',
      itemModel: {
        alarmLevel: '',
        rateLow: '',
        rateUpper: '',
      },
      rules: {
        alarmLevel: [
          { required: true, message: '请选择报警级别', trigger: ['blur', 'change'] },
        ],
        rateLow: [
          { required: true, message: '请输入超标率下限', trigger: 'blur' },
        ],
      },
    };
  },
  created() {},
  watch: {},
  computed: {
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    refreshData() {
      this.$emit('query');
      this.closeDialog();
    },
    openDialog(row) {
      this.itemModel = Object.assign(this.getItemEmpty(), row);
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const { id } = this.itemModel;
        this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.$message.success({
                message: '操作成功',
                duration: 3000,
                showClose: true,
              });
              this.itemModel = response.data.data;
              if (callback) {
                callback(response.data.data);
              } else {
                this.$emit('query');
              }
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
            }
          }, ({ response }) => {
            analyzeResp(response);
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    getItemEmpty() {
      return {
        alarmLevel: '',
        rateLow: '',
        rateUpper: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
