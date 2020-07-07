<template>
  <el-form
    v-loading="loading"
    ref="form"
    label-suffix="："
    :model="formModel"
    :rules="formRules"
    :disabled="readonly || saveLoading"
  >
    <el-form-item v-if="showIcon">
      <select-icon v-model="formModel.icon" />
    </el-form-item>
    <el-form-item label="检测类型名称" prop="typeName">
      <el-input v-model="formModel.typeName"></el-input>
    </el-form-item>
    <el-form-item label="检测类型简介">
      <el-input v-model="formModel.shortName"></el-input>
    </el-form-item>
    <el-form-item label="排序值" prop="orderNum">
      <el-input-number
        v-model="formModel.orderNum"
        controls-position="right"
        :min="0"
        class="fill-w"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="formModel.remark" type="textarea" :rows="2"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="fill-w"
        :loading="saveLoading"
        @click="onSave();"
      >保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import SelectIcon from '@/components/SelectIcon';
import { emptyForm, getSampleType, saveSampleType } from '../request';

export default {
  components: {
    SelectIcon,
  },
  data() {
    return {
      loading: false,
      saveLoading: false,
      showIcon: false,
      readonly: true,
      formModel: emptyForm(),
      formRules: {
        typeName: [
          { required: true, message: '请输入检测类型名称', trigger: 'blur' },
        ],
        orderNum: [
          { required: true, message: '请输入排序值', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    init({ data, level }) {
      this.showIcon = level === 1;
      this.readonly = !level;
      if (level) {
        this.getDetail(data.id)
          .then((data) => {
            this.formModel = data;
            this.$nextTick(() => {
              this.$refs.form.clearValidate();
            });
          });
      } else {
        this.formModel = emptyForm();
      }
    },
    getDetail(id) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        getSampleType(id)
          .then((response) => {
            const { success, data, msg } = response.data;
            if (success) {
              resolve(data);
              this.formModel = data;
            } else {
              this.$message.warning(msg);
              reject();
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    onSave() {
      this.saveLoading = true;
      saveSampleType(this.formModel)
        .then((response) => {
          const { success, data, msg } = response.data;
          this.$message[success ? 'success' : 'warning'](msg);
          if (success) {
            this.formModel = data;
            this.$emit('query');
          } else {
            this.$message.warning(msg);
          }
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
  },
};
</script>
