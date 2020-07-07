<template>
  <div class="registered">
    <div class="reg-class">
      <img class="imgUrl" v-show="imgType === 'Normal'" :src="imgNormal" style="width: 120px;height: 95px;"/>
      <img class="imgUrl" v-show="imgType === 'Greeting'" :src="imgGreeting" style="width: 120px;height: 113px;"/>
      <img class="imgUrl" v-show="imgType === 'Blindfold'" :src="imgBlindfold" style="width: 102px;height: 83px;"/>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="登录名" v-bind="formItemLayout">
          <a-input
            placeholder="登录名"
            type="text"
            v-decorator="['loginName',
              {
                rules: [{
                  required: true, message: '请输入登录名',
                }]
              }
            ]"
            @focus="imgType = 'Greeting'"
            @blur="inputBlur"
          />
        </a-form-item>
        <a-form-item
          label="登录密码"
          v-bind="formItemLayout"
        >
          <a-input
            placeholder="登录密码"
            v-decorator="[
              'loginPassword',
              {
                rules: [{
                  required: true, message: '请输入登录密码',
                }, {
                  validator: validateToNextPassword,
                }],
              }
            ]"
            :type="password "
            @focus="passwordFocus"
            @blur="inputBlur"
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          v-bind="formItemLayout"
          has-feedback
        >
          <a-input
            placeholder="确认密码"
            v-decorator="[
              'conPassword',
              {
                validateTrigger: 'blur',
                rules: [
                  { required: true, message: '请再次输入密码'},
                  { validator: compareToFirstPassword }
                ],
              }
            ]"
            :type="repeatPassword"
            @focus="repeatPasswordFoucs"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item
          label="邮箱地址"
          v-bind="formItemLayout"
          has-feedback>
          <a-input
            placeholder="邮箱地址"
            v-decorator="[
              'email',
              {
                validateTrigger: 'blur',
                rules: [
                { type: 'email', message: '请输入正确格式的邮箱地址'}]
              }
            ]"
            @focus="imgType = 'Greeting'"
            @blur="emailBlur"
          />
        </a-form-item>
        <a-form-item
          label="用户姓名"
          v-bind="formItemLayout"
        >
          <a-input
            placeholder="用户姓名"
            v-decorator="[
              'userName',
              {rules: [{ required: true, message: '请输入用户姓名' }]}
            ]"
            @focus="imgType = 'Greeting'"
            @blur="inputBlur"
          />
        </a-form-item>
        <a-form-item label="手机号" v-bind="formItemLayout" has-feedback>
          <a-input
            placeholder="手机号"
            v-decorator="[
              'mobilePhone',
              {
                validateTrigger: 'blur',
                rules: [
                  { required: true, message: '请输入手机号', trigger: 'onBlur', },
                  { validator: validateToPhone, trigger: 'onBlur', },
                ],
              }
            ]"
            @focus="imgType = 'Greeting'"
            @blur="inputBlur"
            style="width: 100%">
          </a-input>
        </a-form-item>
        <a-form-item label="短信验证码" v-bind="formItemLayout">
          <a-row :gutter="8">
            <a-col :span="12">
              <a-input
                placeholder="短信验证码"
                v-decorator="[
                  'verifiCode',
                  {rules: [{ required: true, message: '请输入短信验证码' }]}
                ]"
                @focus="imgType = 'Greeting'"
                @blur="inputBlur"
              />
            </a-col>
            <a-col :span="12">
              <a-button @click="getCode" :disabled="isObtain || !form.getFieldValue('mobilePhone')">{{obtainLabel}}</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout" style="margin-top: 10px;">
          <a-button class="regBtn" type="primary" html-type="submit">注册</a-button>
          <span class="spn-class" @click="$router.push('/login')">使用已有账户登录</span>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getCode, toReg } from '@/api/auth';

export default {
  name: 'registered',
  data() {
    return {
      isObtain: false,
      obtainLabel: '获取短信验证码',
      imgHeight: '95px',
      imgWidth: '120px',
      imgType: 'Normal',
      /* eslint-disable */
      imgNormal: require('@/assets/img/normal.png'),
      imgBlindfold: require('@/assets/img/blindfold.png'),
      imgGreeting: require('@/assets/img/greeting.png'),
      password: 'text',
      repeatPassword: 'text',
      confirmDirty: false,
      residences: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 6 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 18 },
          sm: { span: 18 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 24,
            offset: 0,
          },
        },
      },
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    // 密码框聚焦事件
    passwordFocus() {
      this.password = 'password';
      this.imgType = 'Blindfold';
    },
    // 重复输入密码框聚焦事件
    repeatPasswordFoucs() {
      this.repeatPassword = 'password';
      this.imgType = 'Blindfold';
    },
    // 设置input失焦图片恢复
    inputBlur() {
      this.imgType = 'Normal';
    },
    emailBlur() {
      this.imgType = 'Normal';
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const data = {
            code: this.form.getFieldValue('verifiCode'),
            email: this.form.getFieldValue('email'),
            mobile: this.form.getFieldValue('mobilePhone'),
            name: this.form.getFieldValue('userName'),
            password: this.form.getFieldValue('loginPassword'),
            userName: this.form.getFieldValue('loginName'),
          };
          toReg(data).then((res) => {
            if (res.data.code === 200 && res.data.success) {
              this.$message.success(res.data.msg);
              const _that = this;
              this.$confirm({
                title: '注册成功，是否返回登录页',
                onOk() {
                  _that.$router.push('/login');
                },
                onCancel() {
                  _that.form.resetFields();
                },
                class: 'test',
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    handleConfirmBlur(e) {
      const { value } = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
      this.inputBlur();
    },
    compareToFirstPassword(rule, value, callback) {
      const Toform = this.form;
      if (value && value !== Toform.getFieldValue('loginPassword')) {
        callback('两次密码不一致');
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const Toform = this.form;
      if (value && this.confirmDirty) {
        Toform.validateFields(['conPassword'], { force: true });
      }
      callback();
    },
    validateToPhone(rule, value, callback) {
      const reg1 = /^(1)[\d]{10}$/;
      if (value && !reg1.test(value)) {
        callback('请输入正确的手机号');
      }
      callback();
    },
    // 获取验证码
    getCode() {
      const phone = this.form.getFieldValue('mobilePhone');
      if (phone) {
        getCode(phone).then((res) => {
          if (res.data.code === 200 && res.data.success) {
            let num = 60;
            const times = setInterval(() => {
              num--;
              this.obtainLabel = `${num}s后获取验证码`;
              this.isObtain = true;
              if (num === 0) {
                clearInterval(times);
                this.obtainLabel = '获取短信验证码';
                this.isObtain = false;
              }
            }, 1000);
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .registered{
    width: 100%;
    height: 100%;
    position: relative;
    .reg-class{
      width: 400px;
      height: 550px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      padding: 50px 20px 20px 20px;
      border-radius: 10px;
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
      >.imgUrl{
        position: absolute;
        top: -70px;
        left: 0;
        right: 0;
        margin: auto;
      }
      >.ant-form{
        >.ant-form-item{
          margin-bottom: 0;
          height: 54px;
        }
      }
    }
  }
  .regBtn{
    padding: 0px 50px;
    height: 40px;
  }
  .spn-class{
    color: #1890ff;
    margin-left: 15px;
    cursor: pointer;
  }
</style>
