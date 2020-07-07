<template>
  <dialog-modal ref="dialog" title="编辑超标规则" @close="closeDialog" size="mini">
    <el-form
      ref="form"
      :model="itemModel"
      :rules="rules"
      label-width="57px"
      class="item-space mar-t-sm mar-x-sm pad-b-sm"
    >
      <el-form-item label="上限：" prop="alertUpper">
        <!-- <el-input-number
          style="width:100%"
          v-model="itemModel.alertUpper"
          controls-position="right"
          :max="100"
        ></el-input-number> -->
        <el-input v-model="itemModel.alertUpper"></el-input>
      </el-form-item>
      <el-form-item label="下限：">
        <!-- <el-input-number
          style="width:100%"
          v-model="itemModel.alertLow"
          controls-position="right"
          :min="0"
        ></el-input-number> -->
        <el-input v-model="itemModel.alertLow"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" @click="onClickSave" :loading="loading">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'EditForm',
  mixins: [],
  components: {},
  data() {
    return {
      loading: false,
      itemModel: {
        alertUpper: '',
        alertLow: '',
      },
      rules: {
        alertUpper: [
          { required: true, message: '请输入上限值', trigger: 'blur' },
        ],
      },
    };
  },
  created() {},
  watch: {},
  methods: {
    openDialog(row) {
      this.itemModel = Object.assign(this.getItemEmpty(), row);
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onClickSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.$http.put('alarm/alarmRuleForOverProofPort', this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.itemModel = response.data.data;
              this.$message({
                type: 'success',
                showClose: true,
                message: response.data.msg,
              });
              this.$emit('query');
              this.closeDialog();
            } else {
              this.$message({
                type: 'warning',
                showClose: true,
                message: response.data.msg,
              });
            }
          }, ({ response }) => {
            analyzeResp(response);
          }).finally(() => {
            this.loading = false;
          });
      });
    },
    getItemEmpty() {
      return {
        alertUpper: '',
        alertLow: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
