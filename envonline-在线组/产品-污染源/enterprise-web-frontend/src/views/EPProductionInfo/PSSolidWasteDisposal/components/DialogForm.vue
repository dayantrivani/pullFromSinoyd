<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${itemModel.id ? '编辑' : '新增'}固废处置`"
    @close="closeDialog">
    <el-form
      ref="form"
      :rules="formRules"
      label-width="115px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="企业名称：" prop="psId" hint-down>
        <select-table v-model="itemModel.psId" :label="psName"></select-table>
      </el-form-item>
      <el-form-item label="危险废物名称：" prop="solidWasteName">
        <el-input
          v-model="itemModel.solidWasteName"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="危险废物类别：">
        <el-select
          v-model="itemModel.solidWasteCode"
          clearable
          filterable
        >
          <el-option
            v-for="(item, index) in SolidWasteCategory"
            :key="index"
            :label="item.dictName"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主要危险成分：">
        <el-input
          v-model="itemModel.majorDangerousIngredient"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="物理状态：">
        <el-select v-model="itemModel.shape">
            <el-option
              v-for="(item, index) in $enum.shape"
              :key="index"
              :label="item"
              :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="包装方式：">
        <el-input
          v-model="itemModel.packing"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="环评产生量(t/a)：">
        <el-input-number
          style="width: 100%;"
          v-model="itemModel.eiaProduction"
          clearable
          controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="危险废物编号：">
        <el-input
          v-model="itemModel.solidWasteNum"
          clearable></el-input>
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
import { saveItem } from '@/global/libs/mixins';
import SelectTable from '@/components/select-table';

export default {
  mixins: [saveItem],                     // 使用混合
  components: { SelectTable },
  props: ['SolidWasteCategory'],
  data() {
    return {
      url: 'bas/psSolidWasteDisposal',  // 必须, 接口地址
      psName: '',
      itemModel: {
        psId: '',
        solidWasteName: '',
        solidWasteCategory: '',
        solidWasteCode: '',
        majorDangerousIngredient: '',
        shape: '',
        packing: '',
        eiaProduction: '',
        solidWasteNum: '',
        remark: '',
      },          // 表单对象
      formRules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        solidWasteName: [
          { required: true, message: '请输入废水源名称', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  watch: {
    // eslint-disable-next-line
    'itemModel.solidWasteCode'(val) {
      const SolidWasteCategory = this.SolidWasteCategory.filter(n => n.dictCode === val)[0];
      this.itemModel.solidWasteCategory = SolidWasteCategory ? SolidWasteCategory.dictName : '';
    },
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
        solidWasteName: '',
        solidWasteCategory: '',
        solidWasteCode: '',
        majorDangerousIngredient: '',
        shape: '',
        packing: '',
        eiaProduction: '',
        solidWasteNum: '',
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
