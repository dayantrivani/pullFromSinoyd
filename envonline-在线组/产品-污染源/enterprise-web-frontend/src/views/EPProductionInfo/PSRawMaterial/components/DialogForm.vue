<template>
  <dialog-modal type="title"
                ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${itemModel.id ? '编辑' : '新增'}原辅料`"
                @close="closeDialog">
    <el-form ref="form"
             :rules="formRules"
             label-width="100px"
             :model="itemModel"
             class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="企业名称："
                    prop="psId"
                    hint-down>
        <select-table v-model="itemModel.psId"
                      :label="psName"></select-table>
      </el-form-item>
      <el-form-item label="原辅料名称："
                    prop="rawMaterialName">
        <el-input v-model="itemModel.rawMaterialName"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="CAS编号：">
        <el-input v-model="itemModel.casCode"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="生产量(t)：">
        <el-input-number style="width: 100%;"
                         v-model="itemModel.consumption"
                         clearable
                         controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="物理状态：">
        <el-select v-model="itemModel.shape">
          <el-option v-for="(item, index) in $enum.shape"
                     :key="index"
                     :label="item"
                     :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原辅料类别：">
        <el-select v-model="itemModel.rawMaterialType">
          <el-option v-for="(item, index) in $enum.rawMaterialType"
                     :key="index"
                     :label="item"
                     :value="index"></el-option>
        </el-select>
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
      saveLoading: false,
      url: 'bas/psRawMaterial',  // 必须, 接口地址
      psName: '',
      itemModel: {
        psId: '',
        rawMaterialName: '',
        casCode: '',
        consumption: '',
        shape: '1',
        rawMaterialType: '',
        remark: '',
      },          // 表单对象
      formRules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        rawMaterialName: [
          { required: true, message: '请输入原辅料名称', trigger: ['blur', 'change'] },
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
        rawMaterialName: '',
        casCode: '',
        consumption: '',
        shape: '1',
        remark: '',
      };
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        this.psName = row.psName;
        this.itemModel.shape = `${row.shape}`;
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
