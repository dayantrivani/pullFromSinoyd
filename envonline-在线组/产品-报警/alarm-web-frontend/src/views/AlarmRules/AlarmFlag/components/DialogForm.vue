<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}${keyName}标记位规则`"
    @close="closeDialog"
  >
    <el-form
      class="item-space mar-t-sm pad-x-sm"
      ref="form"
      label-position="right"
      label-width="113px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <el-form-item label="标记位：" prop="flag" hint-down>
        <el-input v-model="itemModel.flag" autofocus></el-input>
      </el-form-item>
      <el-form-item label="标记说明：" prop="description">
        <el-input
          type="textarea"
          v-model="itemModel.description"
          :autosize="{ minRows: 2, maxRows: 2}"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否有效：" prop="dataIsValid">
        <el-tooltip :content="itemModel.dataIsValid ? '是' : '否'" placement="top">
          <el-switch
            v-model="itemModel.dataIsValid"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSave"
      >保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
// import { mapState } from 'vuex';
// 引入混合 - 保存记录方法
// import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  // mixins: [
  //   saveItem,
  // ],
  // 传入参数项
  props: {
    ids: { String },
    code: { String },
    names: { String },
  },
  data() {
    return {
      isEdit: false,          // 表单展开状态
      saveLoading: false,     // 按钮加载状态
      formLoading: false,     // 表单加载状态
      keyName: this.names,
      keyCode: this.code,
      keyIds: this.ids,
      itemModel: {            // 表单对象
        flag: '',
        flagName: '正常',
        dataIsValid: false,
        description: '',
      },
      // 表单验证
      rules: {
        flag: [
          { required: true, message: '请输入标记位', trigger: ['blur', 'change'] },
        ],
        description: [
          { required: true, message: '请输入标记说明', trigger: ['blur', 'change'] },
        ],
        dataIsValid: [
          { required: true, message: '请输入是否有效', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    // ...mapState({
    //   alarmType: state => state.sample.alarmType,
    // }),
    alarmType() {
      const [alarmType] = this.$store.state.sample.alarmType.filter(n => n.alarmTypeCode === this.$route.name);
      return alarmType;
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        flag: '',                               // 标记位
        flagName: '正常',
        description: '',                        // 标记说明
        dataIsValid: false,                     // 是否有效
      };
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        // 该状态为编辑
        this.isEdit = true;
        this.itemModel = Object.assign(this.getEmptyItem(), row);
      } else {
        // 该状态为新增
        this.isEdit = false;
        // 新增按钮清空所有数据
        this.itemModel = this.getEmptyItem();
      }
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
      this.$refs.form.resetFields();
    },
    // 保存按钮内容
    onSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.itemModel.alarmTypeId = this.alarmType.id;
        this.itemModel.systemTypeCode = this.code;
        this.itemModel.systemTypeId = this.ids;
        this.$http[this.isEdit ? 'put' : 'post']('alarm/alarmRuleForFlag', this.itemModel).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.closeDialog();
            this.$emit('query');
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
      });
    },
  },
};
</script>
