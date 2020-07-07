<template>
  <dialog-modal ref='dialog' size='small' maxScrollbar title='开通账号信息' @close='closeDialog'>
    <div class='el-box'>
      <el-form ref='form' label-position='right' label-width='80px' :model='itemModel' :rules='formRules'>
        <el-row :gutter='10'>
          <el-col :span='12'>
            <el-form-item label='账号：' prop='loginID' hint-down>
              <el-input v-model='itemModel.loginID'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='密码：' prop='password' hint-down>
              <el-input v-model='itemModel.password'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='10'>
          <el-col :span='12'>
            <el-form-item label='姓名：' prop='displayName'>
              <el-input v-model='itemModel.displayName'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='性别：' prop='sexCode'>
              <el-select v-model='itemModel.sexCode'>
                <el-option v-for='(item, index) in $enum.sex' :key='index' :label='item' :value='+index'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='10'>
          <el-col :span='12'>
            <el-form-item label='生日：' prop='birthday'>
              <el-date-picker v-model='itemModel.birthDay' type='date' placeholder='选择日期'
                value-format='yyyy-MM-dd HH:mm:ss'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='工号：' prop='empNum'>
              <el-input v-model='itemModel.empNum'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter='10'>
          <el-col :span='12'>
            <el-form-item label='手机：' prop='telephone'>
              <el-input v-model='itemModel.telephone'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label='邮箱：' prop='email'>
              <el-input v-model='itemModel.email'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot='footer'>
      <el-button type='primary' icon='fas fa-save' :loading='saveLoading' @click='onSaveCheck(saveCallback)'>保 存
      </el-button>
      <el-button icon='fas fa-times' @click='closeDialog'>关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';

export default {
  data() {
    return {
      saveLoading: false,           // 保存按钮加载状态
      itemModel: {
        'birthday': '',
        'deptGuid': '',
        'deptName': '',
        'displayName': 'test',
        'email': '',
        'empNum': '',
        'extendD1': '',
        'extendD2': '',
        'extendD3': '',
        'extendD4': '',
        'extendF1': '',
        'extendF2': '',
        'extendF3': '',
        'extendF4': '',
        'extendI1': 0,
        'extendI2': 0,
        'extendI3': 0,
        'extendI4': 0,
        'extendS1': 'ent',
        'extendS2': '',
        'extendS3': '',
        'extendS4': '',
        'homeUrl': '',
        'isEnabled': '启用',
        'loginID': '',
        'navGuid': 'D51E20E4- D224 - 4530 - 8C31- 26F1109605B0',
        'note': '',
        'orgGuid': this.$store.state.auth.user.orgGuid,
        'orgName': '',
        'password': '',
        'postGuid': '',
        'rowGuid': '',
        'sexCode': '1',
        'sortNum': 1000,
        'telephone': '',
        'webAppGuid': '',
      },
      formRules: {                  // 表单验证
        loginID: [
          { required: true, message: '请输入账号', trigger: ['blur', 'change'] },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
        ],
        displayName: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] },
        ],
      },
      url: 'sinoyd-frame/sys/users/relation-role',
    };
  },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  methods: {
    openDialog() {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {       // 关闭对话框
      this.$refs.dialog.closeDialog();
    },
    /** 特殊方法 */
    saveCallback() {         // 保存数据成功后的回调
      this.$emit('saveUserId', this.itemModel.loginID);
      this.$refs.dialog.closeDialog();
    },
    getEmptyItem() {         // 获取空对象
      return {
        'birthday': '',
        'deptGuid': '',
        'deptName': '',
        'displayName': '',
        'email': '',
        'empNum': '',
        'extendD1': '',
        'extendD2': '',
        'extendD3': '',
        'extendD4': '',
        'extendF1': '',
        'extendF2': '',
        'extendF3': '',
        'extendF4': '',
        'extendI1': 0,
        'extendI2': 0,
        'extendI3': 0,
        'extendI4': 0,
        'extendS1': 'ent',
        'extendS2': '',
        'extendS3': '',
        'extendS4': '',
        'homeUrl': '',
        'isEnabled': '启用',
        'loginID': '',
        'navGuid': 'D51E20E4- D224 - 4530 - 8C31- 26F1109605B0',
        'note': '',
        'orgGuid': this.$store.state.auth.user.orgGuid,
        'orgName': '',
        'password': '',
        'postGuid': '',
        'rowGuid': '',
        'sexCode': '',
        'sortNum': 1000,
        'telephone': '',
        'webAppGuid': '',
      };
    },
    onSaveCheck(callback) {
      // 表单是否需要验证
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    onSaveItem(callback) {
      this.saveLoading = true;
      const data = [];
      data.push(this.itemModel);
      this.$http.post(this.url, data)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            if (callback) {
              this.saveCallback(this.itemModel);
            } else {
              this.$emit('query');
            }
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
  },
};
</script>
