<template>
  <dialog-modal ref="dialog" title="编辑特种设备" @close="closeDialog" size="small">
    <el-form ref="form" :model="itemModel" :rules="rules" label-width="103px" class="mar-x-sm mar-t-xs">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="设备名称：" prop="equipmentName">
            <el-input v-model="itemModel.equipmentName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备编号：">
            <el-input v-model="itemModel.equipmentNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="维保单位：">
            <el-input v-model="itemModel.maintenanceCompany"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备使用地点：">
            <el-input v-model="itemModel.equipmentUsePlace"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="出厂编号：">
            <el-input v-model="itemModel.factoryNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制造日期：" prop="manufactureDate">
            <el-date-picker
              v-model="itemModel.manufactureDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="设备数量：">
            <el-input-number v-model="itemModel.equipmentQty" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备状态：" prop="equipmentStatus">
            <el-select v-model="itemModel.equipmentStatus" @blur="$refs.form.validateField('factoryNumber')">
              <el-option :value="1" label="完好"></el-option>
              <el-option :value="0" label="损坏"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="规格型号：">
            <el-input v-model="itemModel.specificationType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制造单位：">
            <el-input v-model="itemModel.manufactureCompany"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="设备类型：">
            <el-select v-model="itemModel.equipmentTypeCodeId" @blur="$refs.form.validateField('equipmentTypeCodeId')">
              <el-option
                v-for="(item, key) in dict.SpecialEquipmentTypes"
                :key="key"
                :value="item.rowGuid"
                :label="item.dictName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验类型：">
            <el-select
              v-model="itemModel.inspectionTypeCodeId"
              @blur="$refs.form.validateField('inspectionTypeCodeId')"
            >
              <el-option
                v-for="(item, key) in dict.SpecialEquipmentInspectionTypes"
                :key="key"
                :value="item.rowGuid"
                :label="item.dictName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="投用日期：" prop="useDate">
            <el-date-picker
              v-model="itemModel.useDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效日期：" prop="validDate">
            <el-date-picker
              v-model="validDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="检验日期：" prop="inspectionDate">
            <el-date-picker
              v-model="itemModel.inspectionDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到期日期：" prop="expiryDate">
            <el-date-picker
              v-model="itemModel.expiryDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="检验结论：">
            <el-input v-model="itemModel.inspectionConclusion" type="textarea" :autosize="{ minRows: 2 }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="备注：">
            <el-input v-model="itemModel.remark" type="textarea" :autosize="{ minRows: 2 }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(refreshData)"
      >保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';

export default {
  name: 'DialogForm',
  mixins: [saveItem],
  components: {},
  data() {
    return {
      url: 'bas/specEquipInfo',
      itemModel: {
        equipmentName: '',
        equipmentNumber: '',
        maintenanceCompany: '',
        equipmentUsePlace: '',
        factoryNumber: '',
        manufactureDate: '',
        equipmentQty: '',
        equipmentStatus: '',
        specificationType: '',
        manufactureCompany: '',
        equipmentTypeCodeId: '',
        inspectionTypeCodeId: '',
        useDate: '',
        validDate: '',
        inspectionDate: '',
        expiryDate: '',
        inspectionConclusion: '',
        remark: '',
      },
      rules: {
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        manufactureDate: [{ required: true, message: '请选择制造日期', trigger: ['blur', 'change'] }],
        equipmentTypeCodeId: [{ required: true, message: '请选择设备类型', trigger: ['blur', 'change'] }],
        useDate: [{ required: true, message: '请选择投用日期', trigger: ['blur', 'change'] }],
        inspectionDate: [{ required: true, message: '请选择检验日期', trigger: ['blur', 'change'] }],
        expiryDate: [{ required: true, message: '请选择到期日期', trigger: ['blur', 'change'] }],
        equipmentStatus: [{ required: true, message: '请选择设备状态', trigger: ['blur', 'change'] }],
      },
      dict: {
        SpecialEquipmentTypes: [],
        SpecialEquipmentInspectionTypes: [],
      },
    };
  },
  computed: {
    validDate: {
      get() {
        return this.itemModel.validDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.validDate;
      },
      set(val) {
        this.itemModel.validDate = val || '1900-01-01 00:00:00';
      },
    },
  },
  created() {
    this.getDictList();
  },
  watch: {},
  methods: {
    openDialog(item) {
      this.itemModel = Object.assign(this.getItemEmpty(), item);
      this.$refs.dialog.openDialog(item);
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
      this.$refs.form.resetFields();
    },
    refreshData() {
      this.$emit('query');
      this.closeDialog();
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    getItemEmpty() {
      return {
        equipmentName: '',
        equipmentNumber: '',
        maintenanceCompany: '',
        equipmentUsePlace: '',
        factoryNumber: '',
        manufactureDate: '',
        equipmentQty: '',
        equipmentStatus: '',
        specificationType: '',
        manufactureCompany: '',
        equipmentTypeCodeId: '',
        inspectionTypeCodeId: '',
        useDate: '',
        validDate: '',
        inspectionDate: '',
        expiryDate: '',
        inspectionConclusion: '',
        remark: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
