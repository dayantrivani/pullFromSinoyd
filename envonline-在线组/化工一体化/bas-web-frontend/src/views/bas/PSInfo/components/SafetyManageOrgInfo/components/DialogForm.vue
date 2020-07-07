<template>
  <dialog-modal ref="dialog" :title="`${isEdit ? '编辑' : '新增'}人员信息`" @close="closeDialog" size="small">
    <!-- <div>
      <el-button type="primary" icon="fas fa-save">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
    <hr> -->
    <el-form ref="form" class="item-space mar-t-sm mar-x-sm" :model="itemModel" :rules="rules" label-width="145px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="itemModel.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人员类别：" prop="personnelCategoryCodeId">
            <el-select
              v-model="itemModel.personnelCategoryCodeId"
              @blur="$refs.form.validateField('personnelCategoryCodeId')"
            >
              <el-option
                v-for="item in personCategory"
                :key="item.id"
                :value="item.rowGuid"
                :label="item.dictName"
                ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="性别：" prop="sex" @blur="$refs.form.validateField('personnelCategoryCodeId')">
            <el-select v-model="itemModel.sex">
              <el-option :value="1" label="男"></el-option>
              <el-option :value="2" label="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱：">
            <el-input v-model="itemModel.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="身份证号：" prop="idCard">
            <el-input v-model="itemModel.idCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务：" prop="position">
            <el-input v-model="itemModel.position"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="单位电话：" prop="officePhone">
            <el-input v-model="itemModel.officePhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码：" prop="mobilePhone">
            <el-input v-model="itemModel.mobilePhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="是否注册安全工程师：">
            <el-tooltip :content="itemModel.isSafetyEngineer ? '是' : '否'" placement="top">
              <el-switch
                v-model="itemModel.isSafetyEngineer"
                :active-value="true"
                :inactive-value="false">
              </el-switch>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全资格证编号：">
            <el-input v-model="itemModel.safetyCertificateNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="有效期开始时间：">
            <el-date-picker
              v-model="startDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期"
              :picker-options="pickStart">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效期结束时间：">
            <el-date-picker
              v-model="endDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期"
              :picker-options="pickEnd">
            </el-date-picker>
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
// import { analyzeResp } from '@/libs/util';
import { saveItem } from '@/global/libs/mixins';

export default {
  name: 'DialogForm',
  mixins: [saveItem],
  components: {},
  data() {
    return {
      url: 'bas/manageOrgPerson',
      personCategory: [],
      pickStart: {
        disabledDate: (time) => {
          if (!this.itemModel.endDate) {
            return false;
          }
          return time.getTime() > new Date(this.itemModel.endDate).getTime();
        },
      },
      pickEnd: {
        disabledDate: (time) => {
          if (!this.itemModel.startDate) {
            return false;
          }
          return time.getTime() < new Date(this.itemModel.startDate).getTime();
        },
      },
      itemModel: {
        name: '',
        sex: '',
        personnelCategoryCodeId: '',
        idCard: '',
        position: '',
        officePhone: '',
        mobilePhone: '',
        safetyCertificateNumber: '',
        isSafetyEngineer: false,
        startDate: '',
        endDate: '',
        email: '',
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: ['change', 'blur'] }],
        officePhone: [{ required: true, message: '请输入单位电话', trigger: 'blur' }],
        personnelCategoryCodeId: [{ required: true, message: '请选择人员类别', trigger: ['change', 'blur'] }],
        position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
        mobilePhone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getPersonCategory();
  },
  watch: {},
  computed: {
    isEdit() {
      return !!this.itemModel.id;
    },
    startDate: {
      get() {
        return this.itemModel.startDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.startDate;
      },
      set(val) {
        this.itemModel.startDate = val || '1900-01-01 00:00:00';
      },
    },
    endDate: {
      get() {
        return this.itemModel.endDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.endDate;
      },
      set(val) {
        this.itemModel.endDate = val || '1900-01-01 00:00:00';
      },
    },
  },
  methods: {
    openDialog(item) {
      this.itemModel = Object.assign(this.getItemEmpty(), item);
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
      this.$refs.form.resetFields();
    },
    refreshData() {
      this.$emit('query');
      this.closeDialog();
    },
    // 获取人员类别
    getPersonCategory() {
      this.$store.dispatch('dict/GET_SELECT_TYPE', 'SafetyManageOrgPersonnelCategory')
        .then((response) => {
          this.personCategory = response;
        });
    },
    getItemEmpty() {
      return {
        name: '',
        sex: '',
        personnelCategoryCodeId: '',
        idCard: '',
        position: '',
        officePhone: '',
        mobilePhone: '',
        safetyCertificateNumber: '',
        isSafetyEngineer: false,
        startDate: '',
        endDate: '',
        email: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
