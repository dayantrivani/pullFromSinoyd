<template>
  <el-form
    ref="form"
    class="form-container sign-in-container"
    size="large"
    label-position="top"
    :model="formModel"
    :rules="formRules"
    :readonly="loading"
  >
    <h1 class="pad-y-lg">登录</h1>
    <select-account
      v-model="formModel.uid"
      class="mar-b-md"
      @change="toggleUser"
    />
    <el-form-item class="fill-w" prop="uid">
      <el-input v-model="formModel.uid" class="simple" placeholder="用户名">
        <icon slot="prefix" name="el-icon-user" scale="1.3" />
      </el-input>
    </el-form-item>
    <el-form-item class="fill-w" prop="pid">
      <el-input
        v-model="formModel.pid"
        class="simple"
        type="password"
        placeholder="密码"
        @keyup.enter.native="onSubmit()"
      >
        <icon slot="prefix" name="el-icon-key" scale="1.4" />
      </el-input>
    </el-form-item>
    <el-form-item class="fill-w text-left">
      <el-checkbox v-model="remember">保持登录</el-checkbox>
    </el-form-item>
    <el-form-item class="fill-w">
      <el-button
        round
        type="primary"
        size="large"
        class="fill-w"
        :loading="loading"
        @click="onSubmit()"
      >{{ loading ? '正在登录...' : '登录'}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex';
import { getLocalStorage, setLocalStorage } from '@/libs/tools';
import { resetRouter } from '@/routes';

import config from '@/config/app.config';

const emptyForm = () => ({
  uid: '',
  pid: '',
});

export default {
  components: {
    SelectAccount: () => import('./SelectAccount'),
  },
  data() {
    return {
      loading: false,
      remember: getLocalStorage(config.localKey.remember),
      formModel: emptyForm(),
      formRules: {
        uid: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
        ],
        pid: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  watch: {
    // 是否保持登录
    remember(val) {
      setLocalStorage(config.localKey.remember, val);
    },
  },
  methods: {
    ...mapActions('auth', ['Login', 'RefreshToken']),
    // dev: 切换账户
    toggleUser({ uid, pid }) {
      this.formModel.uid = uid;
      this.formModel.pid = pid;
    },
    // 登录提交
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.Login(this.formModel)
          .then(({ success, data }) => {
            if (success && data) {
              if (data.orgs) {
                this.$emit('load', data.orgs);
                this.$message.success('登录成功，请选择机构或企业！');
              } else {
                this.toHome();
              }
            }
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
    toHome() {
      this.loading = true;
      this.RefreshToken()
        .then(() => {
          resetRouter();
        })
        .finally(() => {
          this.loading = false;
          this.$nextTick(() => {
            this.$router.replace({ name: this.$config.app.home });
          });
        });
    },
  },
};
</script>
