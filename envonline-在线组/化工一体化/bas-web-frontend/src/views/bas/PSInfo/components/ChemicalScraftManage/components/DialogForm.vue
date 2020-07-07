<template>
  <dialog-modal
    ref="dialog"
    size="small"
    :title="`${itemModel.id ? '编辑' : '新增'}危险化学品及高危工艺`"
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="257px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules">
      <el-form-item label="企业名称：" prop="psName" hint-down>
        <el-input v-model="itemModel.psName" disabled></el-input>
      </el-form-item>
      <el-form-item label="首批60种重点监管危险化学品名称：">
        <el-select
          multiple
          filterable
          v-model="keyChemicalsNameCodeCpt">
          <el-option
            v-for="(item, index) in dict.SixtyKeyHazardousChemicals"
            :key="index"
            :label="item.dictName"
            :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="首批15种重点监管危险工艺：">
        <el-select
          multiple
          v-model="keyTechnologiesCodeIdsCpt">
          <el-option
            v-for="(item, index) in dict.FifteenKeyHazardousProcesses"
            :key="index"
            :label="item.dictName"
            :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="危险化学品从业单位类型：">
        <el-checkbox-group v-model="industryTypeCodeIdsCpt">
          <el-checkbox
            v-for="(item, index) in dict.HazardousChemicalsProducingTypes"
            :key="index"
            :label="item.rowGuid">{{ item.dictName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="许可证编号：">
        <el-input v-model="itemModel.licenseNumber"></el-input>
      </el-form-item>
      <el-form-item label="许可证有效日期：">
        <el-date-picker
          v-model="licenseValidityDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd 00:00:00"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="许可范围：">
        <el-input v-model="itemModel.limitedLicense" type="textarea"  :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
      <el-form-item label="是否通过定期安全评价：">
        <el-tooltip :content="itemModel.isPassSafeEvaluation ? '是' : '否'" placement="top">
          <el-switch v-model="itemModel.isPassSafeEvaluation"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="危险化学品输送管道：">
        <el-input v-model="itemModel.chemicalsPipeline"></el-input>
      </el-form-item>
      <el-form-item label="危险化学品生产、存储建设项目概况表：">
        <upload-file
          v-if="uploadfileShow"
          ref="uploadfile"
          :col="4"
          :isUpdate="isUpdate"
          :isRequest="isRequest"
          :id="objectId"
          @update-success="updateSuccess"
          @update-recover="updateRecover"/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="formLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>


<script>
// 引入混合 - 保存记录方法
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  // 传入参数项
  props: {
    title: String,
  },
  data() {
    return {
      uploadfileShow: true, // 通过v-if注销上传组件，清空组件缓存
      url: 'bas/dangChemInfo',  // 必须, 接口地址
      itemModel: this.getEmptyItem(),
      // 表单验证
      rules: {
        psName: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        // keyChemicalsNameCodeIds: [
        //   { required: true, message: '请选择首批60种重点监管危险化学品名称', trigger: ['blur', 'change'] },
        // ],
        // keyTechnologiesCodeIds: [
        //   { required: true, message: '请选择首批15种重点监管危险工艺', trigger: ['blur', 'change'] },
        // ],
      },
      // 字典表
      dict: {
        SixtyKeyHazardousChemicals: [],       // 首批60种重点监管危险化学品名称
        FifteenKeyHazardousProcesses: [],     // 首批15种重点监管危险工艺
        HazardousChemicalsProducingTypes: [], // 化学品从业单位类型
      },
      // 企业基本信息列表
      psBaseList: [],
      // 上传组件属性
      // 是否调用上传的请求接口
      isUpdate: false,
      // 是否调用获取上传附件的接口
      isRequest: false,
      objectId: '',
    };
  },
  computed: {
    licenseValidityDate: {
      get() {
        return this.itemModel.licenseValidityDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.licenseValidityDate;
      },
      set(val) {
        this.itemModel.licenseValidityDate = val || '1900-01-01 00:00:00';
      },
    },
    keyChemicalsNameCodeCpt: {
      get() {
        return this.itemModel.keyChemicalsNameCodeIds
          ? this.itemModel.keyChemicalsNameCodeIds.split(',')
          : [];
      },
      set(val) { this.itemModel.keyChemicalsNameCodeIds = val.join(','); },
    },
    keyTechnologiesCodeIdsCpt: {
      get() {
        return this.itemModel.keyTechnologiesCodeIds
          ? this.itemModel.keyTechnologiesCodeIds.split(',')
          : [];
      },
      set(val) { this.itemModel.keyTechnologiesCodeIds = val.join(','); },
    },
    industryTypeCodeIdsCpt: {
      get() {
        return this.itemModel.industryTypeCodeIds
          ? this.itemModel.industryTypeCodeIds.split(',')
          : [];
      },
      set(val) { this.itemModel.industryTypeCodeIds = val.join(','); },
    },
  },
  created() {
    this.getPsBaseList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: JSON.parse(sessionStorage.getItem('psInfo')).id,
        psName: JSON.parse(sessionStorage.getItem('psInfo')).psName,
        chemicalsName: '',            // 化学品名称
        keyChemicalsNameCodeIds: '',  // 首批60种化学品名称
        keyTechnologiesCodeIds: '',   // 首批15种危险工艺名称
        industryTypeCodeIds: '',      // 危险化学品从业单位类型
        licenseNumber: '',            // 许可证编号
        licenseValidityDate: '',      // 许可证有效日期
        limitedLicense: '',           // 许可范围
        isPassSafeEvaluation: false,  // 是否通过定期安全评价
        chemicalsPipeline: '',        // 危险化学品输送管道
        // 危险化学品生产
        // 存储建设项目概况表
      };
    },
    // 保存数据后回调
    saveCallback(response) {
      this.$set(this, 'objectId', response.id);
      this.$set(this, 'isUpdate', true);
    },
    // 打开对话框
    openDialog(row) {
      this.uploadfileShow = true;
      this.objectId = row ? row.id : '';
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();

      // 是否获取单条记录
      // this.getItemOne(row);

      // 获取附件
      if (this.objectId) this.$set(this, 'isRequest', true);

      // 是否需要获取字典表
      this.getDictList();

      // 显示编辑表单
      this.$refs.dialog.openDialog();

      // 聚焦输入框
      this.$nextTick(() => { this.$refs.form.$el[0].focus(); });
    },
    // 关闭对话框
    closeDialog() {
      this.$set(this, 'isUpdate', false);
      this.$set(this, 'isRequest', false);
      this.$refs.form.resetFields();
      this.uploadfileShow = false;
      this.$refs.dialog.closeDialog();
    },
    // 获取企业列表
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, psType: -1 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
        }
      });
    },
    // 上传方法
    // 请求成功或者失败都会执行
    updateRecover() {
      this.$set(this, 'isUpdate', false);
      this.$set(this, 'isRequest', false);
    },
    // 请求成功后回调
    updateSuccess(flag) {
      if (flag) {
        this.$emit('query');
        this.closeDialog();
      }
    },
  },
};
</script>
