<template>
  <dialog-modal class="testCompany"
                ref="dialog"
                maxScrollbar
                title="资质认证"
                size="middle"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="150px"
             :rules="rules"
             :model="certificationQualification">
      <span class="testCopany-font">认证资质</span>
      <el-switch style="float:right;"
                 v-model="testingCompanyInfo.isCertificationQualified"
                 active-text="通过"></el-switch>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="证书类型："
                        prop="certificateType">
            <el-input v-model="certificationQualification.certificateType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发证机构："
                        prop="licenseInstitutions">
            <el-input v-model="certificationQualification.licenseInstitutions"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="有效开始："
                        prop="startDate">
            <el-date-picker v-model="certificationQualification.startDate"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效截止："
                        prop="endDate">
            <el-date-picker v-model="certificationQualification.endDate"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="资格认证：">
            <upload-file :id="objectId"
                         :is-update="isUpdate"
                         :isRequest="isRequest"
                         :size-limilt="0"
                         :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-switch style="float:right;"
                 v-model="testingCompanyInfo.isDataTransmission"
                 active-text="通过"></el-switch>
      <span class="testCopany-font">数据传输</span>
      <el-divider></el-divider>
      <el-row>
        <li style="height: 30px;margin-left: 80px;margin-right: 130px;"
            v-for="(item, key) in LDARDataTransmissionAuth"
            :key="key">
          {{ item.itemName }}
          <el-switch style="float:right;"
                     v-model="item.isPassed"
                     active-text="通过"></el-switch>
        </li>
      </el-row>
      <span class="testCopany-font">信用评价</span>
      <el-switch style="float:right;"
                 v-model="testingCompanyInfo.isCreditEvaluation"
                 active-text="通过"></el-switch>
      <el-divider></el-divider>
      <el-radio-group v-model="selectValue"
                      v-for="(item, index) in LDARCreditEvaluation"
                      :key="index">
        <div>
          <el-radio :label="index">{{item.itemName}}</el-radio>
        </div>
      </el-radio-group>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fa fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck">保存</el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog">关闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/libs/util';

export default {
  name: 'CheckDialog',
  created() {
    this.getDictList();
  },
  data() {
    const validaDate = (rule, value, callback) => {
      if (this.certificationQualification.startDate && this.certificationQualification.endDate) {
        if (this.certificationQualification.startDate > this.certificationQualification.endDate) {
          callback(new Error('结束日期需大于开始日期'));
        } else {
          callback();
        }
      }
    };
    return {
      loading: false,
      saveLoading: false,
      selectValue: 0,
      testingCompanyInfo: this.getTestCompanyEmpty(),
      isUpdate: false,
      isRequest: false,
      readOnly: false,
      certificationQualification: this.getCertificationEmpty(),
      objectId: '',
      LDARDataTransmissionAuth: [],
      LDARCreditEvaluation: [],
      dict: {
        LDARDataTransmissionAuth: [],
        LDARCreditEvaluation: [],
      },
      rules: {
        certificateType: [{ required: true, message: '请输入证书类型', trigger: ['blur', 'change'] }],
        licenseInstitutions: [{ required: true, message: '请输入发证机构', trigger: ['blur', 'change'] }],
        startDate: [
          { required: true, message: '请输入开始时间', trigger: ['blur', 'change'] },
        ],
        endDate: [
          { required: true, message: '请输入结束时间', trigger: ['blur', 'change'] },
          { validator: validaDate, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  methods: {
    getItemEmpty() {
      this.testingCompanyInfo = this.getTestCompanyEmpty();
      this.certificationQualification = this.getCertificationEmpty();
      this.selectValue = 0;
      this.dickListDispose();
    },
    getCertificationEmpty() {
      return {
        certificateType: '',
        licenseInstitutions: '',
        startDate: '',
        endDate: '',
        companyId: '',
      };
    },
    getTestCompanyEmpty() {
      return {
        name: '',
        shortName: '',
        organizationalCode: '',
        contactMan: '',
        contactMobile: '',
        status: '',
        isCertificationQualified: false,
        isDataTransmission: false,
        isCreditEvaluation: false,
      };
    },
    // 数据字典处理
    dickListDispose() {
      this.LDARDataTransmissionAuth = [];
      this.LDARCreditEvaluation = [];
      this.dict.LDARDataTransmissionAuth.forEach((val) => {
        const checkItem = {
          itemName: '',
          itemType: 1,
          itemId: '',
          isPassed: false,
        };
        checkItem.itemName = val.dictName;
        checkItem.itemId = val.rowGuid;
        this.LDARDataTransmissionAuth.push(checkItem);
      });
      this.dict.LDARCreditEvaluation.forEach((val) => {
        const checkItem = {
          itemName: '',
          itemType: 2,
          itemId: '',
          isPassed: false,
        };
        checkItem.itemName = val.dictName;
        checkItem.itemId = val.rowGuid;
        this.LDARCreditEvaluation.push(checkItem);
      });
    },
    // 获取数据字典
    getDictList() { // 获取字典表数据
      // 页面无需字典表时不执行
      if (Object.keys(this.dict).length === 0) { return; }
      const dictList = Object.keys(this.dict);
      // 循环请求字典表
      dictList.forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => { this.dict[key] = val; });
      }));
    },
    // 开
    openDialog(row) {
      this.dickListDispose();
      this.isUpdate = false;
      this.isRequest = false;
      this.testingCompanyInfo = Object.assign(this.getTestCompanyEmpty(), row);
      this.getCertification(this.testingCompanyInfo.id);
      this.getCheckItems(this.testingCompanyInfo.id);
      this.$refs.dialog.openDialog();
    },
    // 关
    closeDialog() {
      this.getItemEmpty();
      this.isUpdate = false;
      this.$refs.dialog.closeDialog();
    },
    /** 特殊方法 */
    onSaveCheck() {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveCallback();
      });
    },
    saveCallback() {
      // 检测机构认证资质
      this.certificationQualification.companyId = this.testingCompanyInfo.id;
      // 信用评价
      const checkItems = [];
      this.LDARDataTransmissionAuth.forEach((val) => {
        const checkItem = {};
        checkItem.companyId = this.testingCompanyInfo.id;
        checkItem.itemId = val.itemId;
        checkItem.itemName = val.itemName;
        checkItem.itemType = 1;
        checkItem.isPassed = val.isPassed;
        checkItems.push(checkItem);
      });
      const arr = this.LDARCreditEvaluation[this.selectValue];
      const checkItem = {};
      checkItem.companyId = this.testingCompanyInfo.id;
      checkItem.itemId = arr.itemId;
      checkItem.itemName = arr.itemName;
      checkItem.itemType = 2;
      checkItem.isPassed = arr.isPassed;
      checkItems.push(checkItem);
      // 发送保存记录请求
      this.saveLoading = true;
      const { id } = this.certificationQualification;
      this.$http[id ? 'put' : 'post']('ldar/certificationQualification',
        this.certificationQualification)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.objectId = response.data.data.id;
            this.isUpdate = true;
            this.saveTestCompanyInfo();
            this.saveCheckItems(checkItems);
            this.$emit('query');
            this.$nextTick(() => {
              this.$refs.dialog.closeDialog();
            });
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
    },
    saveTestCompanyInfo() {
      this.$http.put('ldar/testingCompanyInfo', this.testingCompanyInfo)
        .then((response) => {
          if (response.status !== 200 || !response.data.success) {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        });
    },
    saveCheckItems(checkItems) {
      this.$http.post('ldar/checkItems', checkItems)
        .then((response) => {
          if (response.status !== 200 || !response.data.success) {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        });
    },
    // 获取认证资质
    getCertification(companyId) {
      this.$http.get('ldar/certificationQualification', {
        params: { companyId },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          if (response.data.data) {
            this.certificationQualification = response.data.data;
            this.objectId = response.data.data.id;
            this.isRequest = true;
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    // 获取数据传输信用评价
    getCheckItems(companyId) {
      this.$http.get('ldar/checkItems', {
        params: { companyId },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          if (response.data.data.length > 0) {
            const val = response.data.data.find(item => item.itemType === 2);
            const index = this.dict.LDARCreditEvaluation.findIndex(item => item.dictName === val.itemName);
            this.selectValue = index;
            const arr = response.data.data.filter(item => item.itemType === 1);
            this.LDARDataTransmissionAuth = arr;
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>

<style>
#AlarmRule div {
  padding: 10;
}
.testCompany .el-divider {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 2px;
}
.testCopany-font {
  font-size: 16px;
  color: #409eff;
}
.testCompany .el-radio {
  height: 30px;
  width: 800px;
  margin-left: 80px;
}
</style>
