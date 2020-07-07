<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isDisabled ? '查看' : itemModel.id ? '编辑' : '新增'}企业蒸汽使用情况`"
    @close="closeDialog"
  >
    <el-form ref="form"
      :rules="formRules"
      label-width="120px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <el-form-item label="企业名称：">
        <el-input
          v-model="itemModel.psName"
          clearable
          placeholder="企业名称"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="所属年份：">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.belongYear"
          type="year"
          format="yyyy"
          value-format="yyyy"
          :clearable="false"
          :editable="false"
          readonly
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="归属月份：">
        <el-input
          v-model="itemModel.belongMonth"
          clearable
          placeholder="归属月份"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="申报时间：">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.createDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
          :editable="false"
          readonly
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="总蒸汽用量：">
        <!-- 正数 -->
        <input-number-append
          v-model="itemModel.totalPressureQty"
          placeholder="总蒸汽用量"
          :disabled="isDisabled"
          :min="0"
          :max="2147483647"
          style="width: 100%;"
        >
          <template slot="append">吨</template>
        </input-number-append>
      </el-form-item>
      <el-form-item label="高压蒸汽用量：">
        <!-- 正数 -->
        <input-number-append
          v-model="itemModel.highPressureQty"
          placeholder="高压蒸汽用量"
          :disabled="isDisabled"
          :min="0"
          :max="2147483647"
          style="width: 100%;"
        >
          <template slot="append">吨</template>
        </input-number-append>
      </el-form-item>
      <el-form-item label="中压蒸汽用量：">
        <!-- 正数 -->
        <input-number-append
          v-model="itemModel.mediumPressureQty"
          placeholder="中压蒸汽用量"
          :disabled="isDisabled"
          :min="0"
          :max="2147483647"
          style="width: 100%;"
        >
          <template slot="append">吨</template>
        </input-number-append>
      </el-form-item>
      <el-form-item label="低压蒸汽用量：">
        <!-- 正数 -->
        <input-number-append
          v-model="itemModel.lowPressureQty"
          placeholder="低压蒸汽用量"
          :disabled="isDisabled"
          :min="0"
          :max="2147483647"
          style="width: 100%;"
        >
          <template slot="append">吨</template>
        </input-number-append>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          v-model="itemModel.remark"
          :autosize="{ minRows: 2 }"
          :readonly="isDisabled"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="!isDisabled">
      <el-button type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck()"
      >
        保 存
      </el-button>
      <el-button icon="fas fa-times"  @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
import { formatDate } from '@/global/libs/tools';

export default {
  mixins: [saveItem],                     // 使用混合
  data() {
    return {
      isDisabled: false,
      url: 'enterprise/energyConsumptionSteam',  // 必须, 接口地址
      itemModel: {
        createDate: formatDate(new Date(), 'Y-m-d H:i:s'),
      },          // 表单对象
      dialogType: {},
      formRules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        productName: [
          { required: true, message: '请输入产品名称', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.rowGuid;
    },
  },
  methods: {
    getEmptyItem() {
      return {};
    },
    // 打开对话框
    openDialog(row, isDisabled) {
      this.isDisabled = isDisabled;
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        this.itemModel.belongYear = `${row.belongYear}`;
        if (!isDisabled) {
          this.itemModel.createDate = row.createDate || formatDate(new Date(), 'Y-m-d H:i:s');
        }
      }
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onSaveCheck() {                         // 表单验证
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        if (!this.itemModel.id) delete this.itemModel.id;
        this.onSaveItem((res) => {
          this.itemModel.belongYear = `${res.belongYear}`;
          this.closeDialog();
          this.$emit('query');
        });
      });
    },
  },
};
</script>
