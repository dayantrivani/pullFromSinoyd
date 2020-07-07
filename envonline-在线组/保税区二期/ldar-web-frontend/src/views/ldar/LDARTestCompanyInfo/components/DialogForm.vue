<template>
  <dialog-modal ref="dialog"
                :title="title"
                maxScrollbar
                size="mini"
                @close="closeDialog">
    <el-form ref="form"
             :rules="rules"
             :model="itemModel"
             label-position="right"
             label-width="120px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="检测机构名称："
                        prop="name">
            <el-input v-model="itemModel.name"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="检测机构短称："
                        prop="shortName">
            <el-input v-model="itemModel.shortName"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="组织机构代码："
                        prop="organizationalCode">
            <el-input v-model="itemModel.organizationalCode"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="联系人："
                        prop="contactMan">
            <el-input v-model="itemModel.contactMan"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="联系电话："
                        prop="contactMobile">
            <el-input v-model="itemModel.contactMobile"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="营业执照：">
            <upload-file :id="objectId"
                         :is-update="isUpdate[0]"
                         :isRequest="isRequest[0]"
                         :size-limilt="0"
                         :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fa fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/libs/mixins';

export default {
  name: 'DialogForm',
  mixins: [
    saveItem,
  ],
  computed: {
    title() {
      const text = '检测机构';
      return this.readOnly ? `${text}信息` : `${this.itemModel.id ? '编辑' : '新增'}${text}`;
    },
  },
  data() {
    const validateTel = (rule, value, callback) => {
      if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    return {
      itemList: [],
      // 表单验证
      isAuto: false,
      url: 'ldar/testingCompanyInfo',
      objectId: '',
      isUpdate: [false],
      isRequest: [false],
      readOnly: false,
      itemModel: this.getEmptyItem(),
      rules: {
        name: [{ required: true, message: '请输入检测机构名称', trigger: ['blur', 'change'] }],
        organizationalCode: [{ required: true, message: '请输入组织机构代码', trigger: ['blur', 'change'] }],
        contactMan: [{ required: true, message: '请输入联系人', trigger: ['blur', 'change'] }],
        shortName: [{ required: true, message: '请输入检测机构短称', trigger: ['blur', 'change'] }],
        contactMobile: [
          { required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
          { validator: validateTel, trigger: ['blur', 'change'] }],
      },
    };
  },
  methods: {
    // 保存数据后回调
    saveCallback() {
      this.objectId = this.itemModel.id;
      this.isUpdate = [true];
      this.$nextTick(() => {
        this.$refs.dialog.closeDialog();
      });
    },
    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 获取空对象
    getEmptyItem() {
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
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = this.itemModel.id;
        this.isRequest = [true];
      }
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.isUpdate = [false];
      this.isRequest = [false];
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
