
<template>
  <dialog-modal ref="dialog" size="middle" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}人员信息`" @close="closeDialog">
    <div class="el-box">
      <el-form class="mar-t-xs pad-x-sm item-space" ref="form" label-position="right" label-width="120px"
        v-loading="loading" :model="itemModel" :rules="formRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="itemModel.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="itemModel.sex">
                <el-option v-for="(item, index) in $enum.sex" :key="index" :label="item" :value="+index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="企业名称：" prop="orgId" hint-down>
              <select-info-table v-model="itemModel.psName" :isPsId="false" type="ps" title="选择企业"
                :label="itemModel.psName" @selectRow='pSselectRow' />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车间名称：" prop="workshopId" hint-down>
              <select-info-table v-model="itemModel.workshopName" :isPsId="false" type="ws" title="选择车间"
                :label="itemModel.workshopName" @selectRow='wsSelected' />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="部门名称：" prop="deptId" hint-down>
              <select-info-table v-model="itemModel.deptName" :isPsId="false" type="dp" title="选择部门"
                :label="itemModel.deptName" @selectRow='deptSelected' />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位名称：" prop="jobId" hint-down>
              <select-info-table v-model="itemModel.jobName" :isPsId="false" type="job" title="选择岗位"
                :label="itemModel.jobName" @selectRow='jobSelected' />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职级职位：">
              <el-input v-model="itemModel.jobLevel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="mobilePhone">
              <el-input v-model="itemModel.mobilePhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="itemModel.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期：" prop="birthDay">
              <el-date-picker v-model="itemModel.birthDay" type="date" placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="紧急联络人：" prop="emergentLinkMan">
              <el-input v-model="itemModel.emergentLinkMan"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联络人电话：" prop="emergentPhone">
              <el-input v-model="itemModel.emergentPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态：" prop="status">
              <el-select v-model="itemModel.status">
                <el-option v-for="(item, index) in $enum.EnumPersonStatus" :key="index" :label="item" :value="+index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="身份证：" prop="idCard">
              <el-input v-model="itemModel.idCard"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="名族：" prop="volk">
              <el-input v-model="itemModel.volk"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯：" prop="nativePlace">
              <el-input v-model="itemModel.nativePlace"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学历：" prop="degree">
              <el-select v-model="itemModel.degree">
                <el-option v-for="(item, index) in $enum.EnumPersonStatus" :key="index" :label="item" :value="+index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业：" prop="specialty">
              <el-input v-model="itemModel.specialty"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="学校：" prop="school">
            <el-input v-model="itemModel.school"></el-input>
          </el-form-item>
        </el-row> -->
      </el-form>
    </div>

    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [saveItem],
  data() {
    return {
      url: 'bas/personInfo',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      saveLoading: false,           // 保存按钮加载状态
      psName: '',                   // 企业名称
      deptmentName: '',
      formRules: {                  // 表单验证
        orgId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        jobId: [
          { required: true, message: '请选择岗位名称', trigger: ['blur', 'change'] },
        ],
        deptId: [
          { required: true, message: '请选择部门名称', trigger: ['blur', 'change'] },
        ],
        mobilePhone: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确格式的联系方式',
            trigger: 'blur',
          },
        ],
        emergentLinkMan: [
          { required: true, message: '请输入紧急联系人', trigger: ['blur', 'change'] },
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: ['blur', 'change'] },
        ],
        status: [
          { required: true, message: '请选择在职状态', trigger: ['blur', 'change'] },
        ],
        emergentPhone: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确格式的联系方式',
            trigger: 'blur',
          },
        ],
      },
      departmentList: [],           // 车间/部门数据集合
      itemModel: {                  // 表单对象
        orgId: '',                  // 企业id
        deptId: '',                 // 部门id
        deptName: '',               // 所属部门名称（框架）
        name: '',                   // 姓名
        sex: '',                    // 性别（1男，2女）
        email: '',                  // 邮箱
        mobilePhone: '',            // 手机号码
        jobLevel: '',               // 职级职位
        jobId: '', // 岗位
        jobName: '', // 岗位名称
        workshopId: '', // 车间ID（TB_BAS_PSDepartment表ID）
        workshopName: '',
        birthDay: '', // 生日
        status: '', // 状态（枚举EnumPersonStatus:1代表在职 2代表离职 3代表休假）
        idCard: '', // 身份证
        politicalFace: '', // 政治面貌
        volk: '', // 民族
        nativePlace: '', // 籍贯
        degree: '', // 学历（常量（Guid）：Degree：大专、本科、硕士研究生、博士研究生）
        school: '', // 毕业院校
        specialty: '', // 专业
        emergentLinkMan: '', // 紧急联络人
        emergentPhone: '', // 紧急联络人电话
        userId: '', // 用户ID（框架）建了员工后，可以建登录用户账号
      },
    };
  },
  computed: {
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
    birthDay: {
      get() {
        return this.itemModel.birthDay === '1753-01-01 00:00:00'
          ? ''
          : this.itemModel.birthDay;
      },
      set(val) {
        this.itemModel.birthDay = val || '1753-01-01 00:00:00';
      },
    },
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
      }
      this.$refs.dialog.openDialog();
    },
    closeDialog() {       // 关闭对话框
      this.departmentList = [];
      this.itemModel = this.getEmptyItem();
      this.$refs.form.clearValidate();
      this.$refs.dialog.closeDialog();
    },

    /** 特殊方法 */
    saveCallback() {         // 保存数据成功后的回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    getEmptyItem() {         // 获取空对象
      return {
        orgId: '',                  // 企业id
        deptId: '',                 // 部门id
        deptName: '',               // 所属部门名称（框架）
        name: '',                   // 姓名
        sex: '',                    // 性别（1男，2女）
        email: '',                  // 邮箱
        mobilePhone: '',            // 手机号码
        jobLevel: '',               // 职级职位
        jobId: '', // 岗位
        jobName: '', // 岗位名称
        workshopId: '', // 车间ID（TB_BAS_PSDepartment表ID）
        workshopName: '',
        birthDay: '', // 生日
        status: '', // 状态（枚举EnumPersonStatus:1代表在职 2代表离职 3代表休假）
        idCard: '', // 身份证
        politicalFace: '', // 政治面貌
        volk: '', // 民族
        nativePlace: '', // 籍贯
        degree: '', // 学历（常量（Guid）：Degree：大专、本科、硕士研究生、博士研究生）
        school: '', // 毕业院校
        specialty: '', // 专业
        emergentLinkMan: '', // 紧急联络人
        emergentPhone: '', // 紧急联络人电话
        userId: '', // 用户ID（框架）建了员工后，可以建登录用户账号
      };
    },
    pSselectRow(row) {
      this.itemModel.orgId = row.id;
    },
    wsSelected(row) {
      this.itemModel.workshopId = row.id;
    },
    deptSelected(row) {
      this.itemModel.deptId = row.rowGuid;
    },
    jobSelected(row) {
      this.itemModel.jobId = row.rowGuid;
    },
  },
};
</script>
