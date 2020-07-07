<template>
  <dialog-modal v-loading="loading" ref="dialog" title="人员发送配置" :before-close="beforeClose" size="mini">
    <el-form :rules="rules" :model="formItem" ref="form" label-width="100px" class="item-space pad-x-sm">
      <el-form-item label="系统用户：" prop="isSystemUser">
        <el-switch v-model="formItem.isSystemUser" disabled></el-switch>
      </el-form-item>
      <el-form-item label="组织架构：" prop="orgId">
        <el-select v-model="formItem.orgId" @change="onChangeOrg" style="width: 100%">
          <el-option
            v-for="(item, index) in orgTypeList" :key="index"
            :label="item.orgName"
            :value="item.rowGuid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：" prop="userId" v-if="formItem.isSystemUser">
        <el-select v-model="formItem.userId" @change="onChangeUser" style="width: 100%">
          <el-option
            v-for="(item, index) in userList" :key="index"
            :label="item.userName"
            :value="item.rowGuid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：" prop="userName" v-else>
        <el-input v-model="formItem.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="telephone">
        <el-input v-model="formItem.telephone"></el-input>
        <!-- <el-select v-model="formItem.telephone" style="width: 100%">
          <el-option
            v-for="(item, index) in userList" :key="index"
            :label="item.telephone"
            :value="item.telephone"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="发送方案：" prop="alarmSendConfigs">
        <el-select multiple v-model="alarmSendConfigs" style="width: 100%">
          <el-option
            v-for="(item, index) in alarmSendConfigList" :key="index"
            :label="item.configName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="formItem.email"></el-input>
      </el-form-item>
      <el-form-item label="职位：" prop="headShip">
        <el-input v-model="formItem.headShip"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSaveItem" icon="fas fa-save">保 存</el-button>
      <el-button @click="beforeClose" icon="fa fa-times">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'EditDialog',
  data() {
    const validateTel = (rule, value, callback) => {
      if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      formItem: {},
      alarmSendConfigs: [], // 发送方案rowGuid数组集合
      // alarmSendConfigList: [], // 发送方案下拉菜单
      // orgTypeList: [], // 组织架构下拉菜单
      // userList: [], // 人员数据下拉菜单
      rules: {
        isSystemUser: [
          { required: true, message: '请选择系统用户', trigger: 'blur' },
        ],
        orgId: [
          { required: true, message: '请选择组织架构', trigger: 'change' },
        ],
        userId: [
          { required: true, message: '请选择用户姓名', trigger: 'change' },
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: validateTel, trigger: ['blur', 'change'] },
        ],
        alarmSendConfigs: [
          { required: true, message: '请选择发送方案', trigger: 'change' },
        ],
      },
    };
  },
  watch: {
    alarmSendConfigs(value) {
      this.formItem.alarmSendConfigs = this.alarmSendConfigList.filter(n => value.includes(n.id));
    },
  },
  computed: {
    ...mapState({
      alarmSendConfigList: state => state.sample.alarmSendConfigList, // 发送方案下拉菜单
      orgTypeList: state => state.sample.orgTypeList, // 组织架构下拉菜单
      userList: state => state.sample.userList, // 人员数据下拉菜单
    }),
  },
  methods: {
    openDialog(id) {
      if (this.orgTypeList.length === 0) {
        this.getOrgTypeList();
      }
      if (this.alarmSendConfigList.length === 0) {
        this.getAlarmSendConfigList();
      }
      this.getItemList(id);
      this.$refs.dialog.openDialog();
    },
    beforeClose() {
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    onChangeOrg(rowGuid) { // 改变组织架构的值
      const orgType = this.orgTypeList.filter(n => n.rowGuid === rowGuid);
      this.formItem.orgName = orgType[0].orgName;
      this.formItem.orgId = orgType[0].rowGuid;
      this.getUserList(rowGuid);
      this.onChangeUser(rowGuid);
    },
    onChangeUser(rowGuid) { // 改变用户的值
      const user = this.userList.filter(n => n.rowGuid === rowGuid);
      if (user.length !== 0) {
        this.formItem.userName = user[0].userName;
        this.formItem.telephone = user[0].telephone;
        this.formItem.email = user[0].email;
      } else {
        this.formItem.userName = '';
        this.formItem.userId = '';
        this.formItem.telephone = '';
        this.formItem.email = '';
      }
    },
    getOrgTypeList() { // 获取组织架构数据
      this.$http.get('sys/org?orgTypeCodes=hb').then((response) => {
        if (response.data.success) {
          const data = response.data.rows || response.data.data || response.data;
          this.$store.commit('sample/setOrgTypeList', data);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    getUserList(id) { // 获取人员列表数据
      this.$http.get(`sys/user/guid/${id}`).then((response) => {
        const data = response.data.rows || response.data.data || response.data || [];
        this.$store.commit('sample/setUserList', data);
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    getAlarmSendConfigList() { // 获取发送方案列表数据
      this.$http.get('alarm/alarmSendConfig?page=1&rows=1000000').then((response) => {
        if (response.data.success) {
          const data = response.data.rows || response.data.data || response.data;
          this.$store.commit('sample/setAlarmSendConfigList', data);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    getItemList(id) {
      this.$http.get(`alarm/alarmUserInfo/${id}`).then((response) => {
        if (response.data.success) {
          this.formItem = response.data.rows || response.data.data || response.data;
          this.getUserList(this.formItem.orgId);
          this.alarmSendConfigs = this.formItem.alarmSendConfigs.map(n => n.id);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    onSaveItem() { // 点击保存
      // this.formItem.alarmSendConfigs = this.alarmSendConfigList
      //   .filter(n => this.alarmSendConfigs.includes(n.rowGuid));
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.$http.put('alarm/alarmUserInfo', {
          ...this.formItem,
        }).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
            this.beforeClose();
            this.$emit('onQueryList');
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, (response) => {
          this.$hp.resp(response);
        });
      });
    },
  },
};
</script>

<style>

</style>
