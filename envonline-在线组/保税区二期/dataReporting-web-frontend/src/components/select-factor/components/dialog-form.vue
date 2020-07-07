<template>
  <dialog-modal
    appendToBody
    ref="dialog"
    size="mini"
    :title="`${itemModel.id ? '编辑' : '新增'}因子`"
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="113px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
      @validate="onValidate">
      <el-form-item label="样品类型：" prop="sampleTypeCodeId">
        <el-select autofocus v-model="itemModel.sampleTypeCodeId">
          <el-option
            v-for="(item, index) in dict.DataReportingSampleType"
            :key="index"
            :label="item.dictName"
            :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="因子名称：" prop="factorName">
        <el-input v-model="itemModel.factorName"></el-input>
      </el-form-item>
      <el-form-item label="因子编码：" prop="factorCode">
        <el-input v-model="itemModel.factorCode"></el-input>
      </el-form-item>
      <el-form-item label="排序值：">
        <el-input-number
          v-model="itemModel.sortNum"
          controls-position="right"
          :precision="0"
          :min="0"
          :max="2147483647"
          style="width: 100%">
        </el-input-number>
      </el-form-item>
      <el-form-item label="量纲：" prop="unit">
        <el-input v-model="itemModel.unit"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="itemModel.remark" :rows="2"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
// 引入混合 - 保存记录方法
import { saveItem } from '@/global/libs/mixins';
import formRules from './rules';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  // 传入参数项
  props: {
    factorType: String,
  },
  data() {
    return {
      url: 'sm/sampleFactor',  // 必须, 接口地址
      itemModel: {},          // 表单对象
      // 表单验证
      rules: formRules,
      // 字典表
      dict: {
        DataReportingSampleType: [], // 样品类型
      },
    };
  },
  created() {
    this.getDictList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        sampleTypeCodeId: this.factorType, // 样品类型
        factorCode: '',       // 因子编号
        factorName: '',       // 因子名称
        sortNum: 0,           // 排序值
        unit: '',             // 单位
        remark: '',           // 备注
      };
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();

      // 显示编辑表单
      this.$refs.dialog.openDialog();

      // 聚焦输入框
      this.$nextTick(() => {
        if (!this.itemModel.id) { this.$refs.form.resetFields(); }
        this.$refs.form.$el[0].focus();
      });
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
