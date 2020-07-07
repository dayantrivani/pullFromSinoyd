<template>
  <a-modal
    class="enter-dialog"
    width="1040px"
    :title="`${row.id ? '编辑' : '新增'}运维单位`"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-form :form="form">
        <a-row>
          <a-col :span="12">
            <a-form-item label="运维单位名称：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input placeholder="请输入运维单位名称" v-decorator="[
                'name',
                {
                  rules: [
                    {required: true, message: '请输入运维单位名称！',}
                  ],
                }]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="社会信用代码：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input placeholder="请输入社会信用代码(18位数字或字母)" v-decorator="[
                'uscc',
                {
                  rules: [
                    {required: true, message: '请输入社会信用代码！',}
                  ],
                }]">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input v-decorator="['contactName']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input v-decorator="['contactPhone']"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <div slot="footer">
      <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import {
  emptyForm, create, update, getOne,
} from '@/api/modules/maintain-company/maintain-management.js';

export default {
  name: '',
  components: {},
  data() {
    return {
      isVisible: false,           // 弹框显示隐藏
      row: {},
      spinning: false,
      itemModel: emptyForm(),     // 表单
      loading: false,
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
    // 表单赋值
    setOneData(data) {
      this.form.setFieldsValue({
        'name': data.name,
        'uscc': data.uscc,
        'contactName': data.contactName,
        'contactPhone': data.contactPhone,
      });
    },
    // 验证其他表单项
    validateImfomation() {
      return new Promise((resolve) => {
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          const setValue = {
            'name': fieldsValue.name,
            'uscc': fieldsValue.uscc,
            'contactName': fieldsValue.contactName,
            'contactPhone': fieldsValue.contactPhone,
          };
          resolve(setValue);
        });
      });
    },
    // 保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'name': fieldsValue.name,
          'uscc': fieldsValue.uscc,
          'contactName': fieldsValue.contactName,
          'contactPhone': fieldsValue.contactPhone,
        };
        Object.assign(this.itemModel, setValue);
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
  created() {
  },
};
</script>
<style lang="scss" scoped>
</style>
