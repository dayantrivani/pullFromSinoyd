<template>
<!-- 新增或编辑按钮弹框 -->
  <dialog-modal
    ref="dialog"
    size="mini"
    :title="`${title}`"
    @close="onCloseDialog">
    <el-form ref="form" label-width="100px" :model="dialogModel" :rules="rules">
      <el-form-item label="卡号：" prop="cardCode">
        <el-input v-model="dialogModel.cardCode"></el-input>
      </el-form-item>
      <el-form-item label="卡类型：" prop="cardType">
        <el-select v-model="dialogModel.cardType" placeholder="请选择卡类型" clearable style="width: 100%" >
          <el-option v-for="(item, key) in $enum.cardType" :key="key" :label="item" :value="key - 0">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 这里后续可能会修改 cardHolderId 和 cardHolderName都需要-->
      <el-form-item label="持卡人：" prop="cardHolderName">
        <el-input v-model.trim="dialogModel.cardHolderName"></el-input>
      </el-form-item>
      <el-form-item label="门禁状态：" prop="cardStatus">
        <el-select v-model="dialogModel.cardStatus" placeholder="请选择状态" clearable style="width: 100%" >
          <el-option v-for="(item, key) in $enum.cardStatus" :key="key" :label="item" :value="key - 0">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业：" prop="psId">
        <el-select v-model="dialogModel.psId" placeholder="请选择企业" clearable style="width: 100%" >
          <el-option v-for="(item,index) in options.psId" :key="index" :label="item.psName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排口：" prop="portId">
        <el-select v-model="dialogModel.portId" placeholder="请选择排口" clearable style="width: 100%">
          <el-option v-for="(item,index) in options.portId" :key="index" :label="item.portName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onClickSave">保 存</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </span>
  </dialog-modal>
</template>

<script>
export default {
  name: 'ECardConfigDialog',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    const validateCardCode = (rule, value, callback) => {
      const reg = /^\d+$/;
      if (!reg.test(value)) {
        callback(new Error('卡号必须为数字值'));
      } else {
        callback();
      }
    };
    return {
      saveLoading: false,
      url: 'cfg/accessCard', // 接口地
      options: {
        portId: [],       // 排口id
        psId: [],         // 企业id
      },
      dialogModel: {
        cardCode: undefined,         // 卡号
        cardType: '',         // 卡类型
        cardStatus: '',       // 门禁状态
        // cardHolderId: '',     // 持卡人姓名id
        cardHolderName: '',     // 持卡人姓名
        psId: '',             // 企业id
        portId: '',           // 排口id
      },
      rules: {
        cardCode: [
          { required: true, message: '请选择卡号', trigger: 'change' },
          { validator: validateCardCode, trigger: 'change' },
        ],
        cardType: [
          { required: true, message: '请选择卡类型', trigger: 'change' },
        ],
        cardStatus: [
          { required: true, message: '请选择门禁状态', trigger: 'change' },
        ],
        cardHolderName: [
          { required: true, message: '请输入持卡人姓名ID', trigger: 'blur' },
        ],
      },
      editOne: false,         // 是否是点击编辑按钮触发的数据改变
    };
  },
  computed: {
    psId() { return this.dialogModel.psId; },
  },
  watch: {
    psId(val) {
      // 企业改变后，必须清空的数据
      if (!this.editOne) {
        this.options.portId = [];
        this.dialogModel.portId = '';
      }
      this.editOne = false;
      // 如果val 为 null、undefined 或者 ''
      if (!val) return;
      // 如果val不为空
      this.getFactorsData(val);
    },
  },
  methods: {
    // 父组件调用子组件方法打开对话框
    openDialog() {
      this.$refs.dialog.openDialog();
      this.getValueTypeData();
    },
    // 保存按钮
    onClickSave() {
      const { id } = this.dialogModel;
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http[id ? 'put' : 'post'](this.url, this.dialogModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '编辑' : '新增'}成功`,
                duration: 3000,
                showClose: true,
              });
              this.$emit('query');
              this.$refs.dialog.closeDialog();
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 弹窗关闭前触发
    onCloseDialog() {
      this.dialogModel = {
        cardCode: undefined,         // 卡号
        cardType: '',         // 卡类型
        cardStatus: '',       // 门禁状态
        // cardHolderId: '',     // 持卡人姓名id
        cardHolderName: '',     // 持卡人姓名
        psId: '',             // 企业id
        portId: '',           // 排口id
      };
      this.options = {
        portId: [],       // 排口id
        psId: [],         // 企业id
      };
      this.editOne = false;
      this.$refs.form.resetFields();
    },
    // 获取企业接口数据
    getValueTypeData() {
      this.$http.get('bas/psBaseInfo/', {
        params: {
          page: 1,
          rows: 1000000,
          sort: 'psName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.options.psId = response.data.data || [];
        } else {
          this.$message.error({
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    // 获取排口接口数据
    getFactorsData(id) {
      this.$http.get('bas/portInfo/', {
        params: {
          page: 1,
          rows: 1000000,
          psId: id,
          sort: 'portName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.$nextTick(() => {
            this.options.portId = response.data.data || [];
          });
        } else {
          this.$message.error({
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>
