<template>
  <!-- 突变或负值报警 -- 参数配置（新增或编辑弹框） -->
  <dialog-modal ref="dialog" size="mini" :title="`${isEdit ? '编辑' : '新增'}参数`" @close="closeDialog">
    <el-form ref="form" class="item-space mar-x-sm" :model="itemForm" :rules="rules" label-width="90px">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="名称：" prop="name">
            <el-input v-model="itemForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标识：" prop="code">
            <!-- <el-input v-model="itemForm.code"></el-input> -->
            <el-select v-model="itemForm.code">
              <el-option
                v-for="(item, index) in $enum.alarmCode"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="校验规则：" prop="verification">
            <el-input v-model="itemForm.verification"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序值：" prop="orderNum">
            <!-- 正整数 -->
            <el-input-number
              v-model="itemForm.orderNum"
              controls-position="right"
              :min="0"
              :max="2147483647"
              :precision="0"
              style="width: 100%;"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
            <el-input v-model="itemForm.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" v-loading="saveLoading" @click="onSaveItem">保 存</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  props: {
    alarmType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: 'alarm/alarmRuleParams',
      saveLoading: false,
      itemForm: {
        alarmTypeId: '',    // id值
        name: '',           // 参数姓名
        code: '',           // 标识
        verification: '',   // 校验规则
        orderNum: 0,       // 排序值
        remark: '',         // 备注
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: ['change', 'blur'] }],
        code: [{ required: true, message: '请输入标识', trigger: ['change', 'blur'] }],
        verification: [{ required: true, message: '请配置校验规则', trigger: ['change', 'blur'] }],
        orderNum: [{ required: true, message: '请输入排序值', trigger: ['change', 'blur'] }],
        // remark: [{ required: true, message: '请添加备注', trigger: ['change', 'blur'] }],
      },
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemForm.id;
    },
  },
  methods: {
    openDialog(item) {
      this.$set(this.itemForm, 'alarmTypeId', this.alarmType.id);
      this.itemForm = item ? Object.assign({}, item) : this.itemForm;
      this.$refs.dialog.openDialog();
    },
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const { id } = this.itemForm;
        this.$http[id ? 'put' : 'post'](this.url, this.itemForm)
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.$message.success({
                message: '操作成功',
                duration: 3000,
                showClose: true,
              });
              this.$refs.dialog.closeDialog();
              this.$emit('query');
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
    closeDialog() {
      this.itemForm = this.getItemEmpty();
      this.$refs.form.clearValidate();
    },

    /** 特殊方法 */
    getItemEmpty() {
      return {
        alarmTypeId: '',    // id值
        name: '',           // 参数姓名
        code: '',           // 标识
        verification: '',   // 校验规则
        orderNum: 0,       // 排序值
        remark: '',         // 备注
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
