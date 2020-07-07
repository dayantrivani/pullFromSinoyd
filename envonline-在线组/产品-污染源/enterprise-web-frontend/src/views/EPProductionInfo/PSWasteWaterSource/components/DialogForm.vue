<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}废水源`"
    @close="closeDialog">
    <el-form
      ref="form"
      :rules="formRules"
      label-width="100px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="企业名称：" prop="psId" hint-down>
        <select-table v-model="itemModel.psId" :label="psName"></select-table>
      </el-form-item>
      <el-form-item label="污水源名称：" prop="wasteWaterSourceName">
        <el-input
          v-model="itemModel.wasteWaterSourceName"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="污水源编码：">
        <el-input
          v-model="itemModel.wasteWaterSourceCode"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="废水产生量：">
        <el-input
          v-model="itemModel.productQuantity"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="产生源类别：">
        <el-select v-model="itemModel.sourceCategory">
          <el-option
            v-for="(item, index) in $enum.sourceCategorys"
            :key="index"
            :label="item"
            :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件：">
        <upload-File
          :isRequest="isRequest"
          :id="itemModel.id || ''"
        />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          v-model="itemModel.remark"
          :autosize="{ minRows: 2 }"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button
        icon="fas fa-times"
        @click="closeDialog">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import SelectTable from '@/components/select-table';
import { saveFile } from '@/global/libs/mixins';
import UploadFile from '@/components/upload-file';

export default {
  mixins: [saveFile],                     // 使用混合
  components: { SelectTable, UploadFile },
  data() {
    return {
      saveLoading: false,
      url: 'bas/psWasteWaterSource',  // 必须, 接口地址
      psName: '',
      itemModel: {
        id: '',
        psId: '',
        wasteWaterSourceName: '',
        wasteWaterSourceCode: '',
        productQuantity: '',
        sourceCategory: '',
        remark: '',
      },          // 表单对象
      formRules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        wasteWaterSourceName: [
          { required: true, message: '请输入废水源名称', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  methods: {
    getEmptyItem() {
      return {
        id: '',
        psId: '',
        wasteWaterSourceName: '',
        wasteWaterSourceCode: '',
        productQuantity: '',
        sourceCategory: '',
        remark: '',
      };
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
        this.itemModel.sourceCategory = `${row.sourceCategory}`;
        this.isRequest = true;
      } else {
        this.getAttachGuId();
      }
      this.isEdit = !!row;
      this.psName = row ? row.psName : '';
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
  },
};
</script>
