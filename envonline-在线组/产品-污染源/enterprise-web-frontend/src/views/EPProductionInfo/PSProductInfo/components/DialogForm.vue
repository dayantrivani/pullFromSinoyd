<template>
  <dialog-modal type="title"
                ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${itemModel.id ? '编辑' : '新增'}产品`"
                @close="closeDialog">
    <el-form ref="form"
             :rules="formRules"
             label-width="85px"
             :model="itemModel"
             class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="企业名称："
                    prop="psId"
                    hint-down>
        <select-table v-model="itemModel.psId"
                      :label="psName"></select-table>
      </el-form-item>
      <el-form-item label="产品名称："
                    prop="productName">
        <el-input v-model="itemModel.productName"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="CAS编号：">
        <el-input v-model="itemModel.casCode"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="生产量(t)：">
        <el-input-number style="width: 100%;"
                         v-model="itemModel.productQuantity"
                         :max="2147483647"
                         :min="0"
                         clearable
                         controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="物理状态：">
        <el-select v-model="itemModel.physicalState">
          <el-option v-for="(item, index) in $enum.shape"
                     :key="index"
                     :label="item"
                     :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品类型：">
        <el-input v-model="itemModel.productType"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="用途：">
        <el-input v-model="itemModel.purpose"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea"
                  v-model="itemModel.remark"
                  :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
import SelectTable from '@/components/select-table';

export default {
  mixins: [saveItem],                     // 使用混合
  components: { SelectTable },
  data() {
    return {
      url: 'bas/psProductInfo',  // 必须, 接口地址
      psName: '', // 显示企业名称
      itemModel: {
        psId: '',
        productName: '',
        casCode: '',
        productQuantity: '',
        physicalState: '1',
        productType: '',
        purpose: '',
        remark: '',
      },          // 表单对象
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
      return {
        psId: '',
        productName: '',
        casCode: '',
        productQuantity: '',
        physicalState: '1',
        remark: '',
      };
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        this.psName = row.psName;
        this.itemModel.physicalState = `${row.physicalState}`;
      }

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
