<template>
  <a-modal
    :visible="isVisible"
    :title="`${row.id ? '编辑' : '新增'}角色`"
    :maskClosable="false"
    @cancel="closeDialog">
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-form :form="form">
        <a-form-item label="角色名称：" :labelCol="{span:4}" :wrapperCol="{span:20}">
          <a-input :readOnly="row.id === 3 || row.id === 8" placeholder="请输入角色名称" v-decorator="[
            'roleName',
            {
              rules: [
                {required: true, message: '请输入角色名称！',}
              ],
            }
          ]" />
        </a-form-item>
        <a-form-item label="角色编号：" :labelCol="{span:4}" :wrapperCol="{span:20}">
          <a-input :readOnly="row.id === 3 || row.id === 8" placeholder="请输入角色编号" v-decorator="[
            'roleCode',
            {
              rules: [
                {required: true, message: '请输入角色编号！',}
              ],
            }
          ]" />
        </a-form-item>
      </a-form>
    </a-spin>
    <div slot="footer">
      <a-button v-if="row.id !== 3 && row.id !== 8" type="primary" icon="save" @click="onSave">保 存</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import {
  create, update, emptyForm, getOne,
} from '@/api/modules/role-management.js';

export default {
  name: '',
  components: {},
  data() {
    return {
      isVisible: false,
      spinning: false,
      itemModel: emptyForm(),
      row: {},
      selectedGroup: 1,
    };
  },
  methods: {
    // 弹框显示
    openDialog(row) {
      if (row) {
        this.row = row;
        this.spinning = true;
        getOne(row.id).then((response) => {
          this.setOneData(response.data.data);
          this.spinning = false;
        });
      }
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.itemModel = emptyForm();
      this.form.resetFields();
    },
    // 表单项赋值
    setOneData(data) {
      this.form.setFieldsValue({
        'roleName': data.roleName,
        'roleCode': data.roleCode,
      });
    },
    // 保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'roleName': fieldsValue.roleName,
          'roleCode': fieldsValue.roleCode,
        };
        Object.assign(this.itemModel, setValue);
        this.itemModel.roleGroup = this.selectedGroup;
        if (err) {
          return;
        }
        const saveMethod = this.row ? update : create;
        saveMethod(this.itemModel, this.row).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeDialog();
            this.$emit('refreshList');
          } else {
            this.$message.warning(response.data.msg, 3);
          }
        });
      });
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  created() {},
};
</script>
<style lang="scss" scoped>
</style>
