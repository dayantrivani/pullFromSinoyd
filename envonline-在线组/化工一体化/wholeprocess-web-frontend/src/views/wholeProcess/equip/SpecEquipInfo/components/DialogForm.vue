<template>
  <dialog-modal type="title" ref="dialog" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}特种设备`" @close="closeDialog">
    <el-form class="mar-t-xs pad-x-sm item-space el-box" ref="form" :rules="formRules" label-position="right" label-width="90px"
      :model="itemModel">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称：" prop="equipmentName" hint-down>
            <el-input v-model="itemModel.equipmentName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备编号：" prop="equipmentNumber" hint-down>
            <el-input v-model="itemModel.equipmentNumber" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备类型：" prop="equipmentTypeCodeId">
            <el-select v-model="itemModel.equipmentTypeCodeId">
              <el-option v-for="(item, index) in dict.EquipmentType" :key="index" :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格型号：" prop="specificationType">
            <el-input v-model="itemModel.specificationType" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="制造日期：">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.manufactureDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂年月：">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.exFactoryDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产厂名：" prop="manufactureCompany">
            <el-input v-model="itemModel.manufactureCompany" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维保单位：" prop="maintenanceCompany">
            <el-input v-model="itemModel.maintenanceCompany" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="出厂编号：" prop="factoryNumber">
            <el-input v-model="itemModel.factoryNumber" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册代码：" prop="registrationCode">
            <el-input v-model="itemModel.registrationCode" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="始用年月：">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.useDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上次审验：">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.inspectionDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="下次审验：">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.nextAuditDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用部门：" prop="deptId">
            <select-info-table
              v-model="itemModel.deptId"
              :isPsId="false"
              type="dp"
              title="选择部门"
              :label="itemModel.deptName"
              @selectRow='dpSelectRow' />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="使用地点：">
            <el-input v-model="itemModel.equipmentUsePlace" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备数量：" prop="equipmentQty">
            <!-- 正整数 -->
            <el-input-number
              v-model="itemModel.equipmentQty"
              controls-position="right"
              :min="0"
              :max="2147483647"
              :precision="0"
              style="width: 100%;"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备状态：" prop="equipmentStatus">
            <el-select v-model="itemModel.equipmentStatus">
              <el-option label="损坏" :value="0"></el-option>
              <el-option label="正常" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
              <el-option label="报废" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验类型：" prop="inspectionTypeCodeId">
            <el-select v-model="itemModel.inspectionTypeCodeId">
              <el-option v-for="(item, index) in dict.inspectionType" :key="index" :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="有效日期：" prop="validDate">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.validDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到期日期：" prop="expiryDate">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.expiryDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :clearable="false"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="安全附件：">
        <upload-file
          :id="itemModel.id"
          :is-update="isUpdate"
          :is-request="isRequest"
          @update-recover="updateRecover" />
          <!-- @update-success="updateSuccess"  -->
      </el-form-item>
      <el-form-item label="检验结论：">
        <el-input type="textarea" v-model="itemModel.inspectionConclusion" :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
      <el-form-item label="相关信息：">
        <el-input type="textarea" v-model="itemModel.otherInfo" :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';

export default {
  mixins: [saveItem], // 使用混合
  data() {
    return {
      url: 'wholeprocess/specEquipInfo', // 必须, 接口地址
      itemModel: {}, // 表单对象
      dict: {
        EquipmentType: [], // 设备类型
        inspectionType: [], // 检验类型
      },
      formRules: {
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: ['blur', 'change'] }],
        equipmentNumber: [{ required: true, message: '请输入设备编号', trigger: ['blur', 'change'] }],
        equipmentTypeCodeId: [{ required: true, message: '请选择设备类型', trigger: ['blur', 'change'] }],
      },
      // 附件上传参数
      isUpdate: false,
      isRequest: false,
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    getEmptyItem() {
      return {
        deptId: '',
        manufactureDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        exFactoryDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        useDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        inspectionDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        nextAuditDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        validDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        expiryDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        equipmentStatus: 1,
      };
    },
    // 打开对话框
    openDialog(row) {
      this.getDictList();
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        this.isRequest = true;
      } else {
        this.itemModel.psId = this.$store.state.auth.user.orgGuid;
      }

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.isUpdate = false;
      this.isRequest = false;
      this.$refs.dialog.closeDialog();
    },
    saveCallback() { // 保存结束后上传附件
      this.isUpdate = true;
    },
    updateRecover() { // 上传附件结束后关闭弹窗
      this.closeDialog();
      this.$emit('query');
    },
    dpSelectRow(item) { // 选择部门
      this.itemModel.deptName = item.deptName;
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },
  },
};
</script>
