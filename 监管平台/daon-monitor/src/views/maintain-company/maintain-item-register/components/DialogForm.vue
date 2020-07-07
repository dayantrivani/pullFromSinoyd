<template>
  <a-modal
    width="520px"
    :title="`${row.id ? '编辑' : '新增'}重大事项`"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-form :form="form">
        <a-form-item label="运维单位名称：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-select
            showSearch
            placeholder="请选择"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            :filterOption="filterOption"
            v-decorator="[
              'corpId',
              {
                rules: [
                  {required: true, message: '请选择运维单位！',}
                ],
              }]">
            <a-select-option v-for="(item, index) in companyList" :key="index" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年度：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-input readOnly v-decorator="[
            'year',
            {
              initialValue: initialYear,
            }]">
          </a-input>
        </a-form-item>
        <a-form-item label="得分周期：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-input readOnly v-decorator="[
            'periodIndex',
            {
              initialValue: initialPeriod,
            }]"></a-input>
        </a-form-item>
        <a-form-item label="登记日期：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-date-picker format="MM-DD" :allowClear="false" :open="false" v-decorator="[
          'updatedAt',
          {initialValue: initialDate}
        ]"></a-date-picker>
        </a-form-item>
        <a-form-item label="手动计分规则：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-select
            placeholder="请选择"
            showSearch
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            :filterOption="filterOption"
            v-decorator="[
              'ruleId',
              {
                rules: [
                  {required: true, message: '请选择计分规则！',}
                ],
              }]">
            <a-select-option v-for="(item, index) in ruleList" :key="index" :value="item.id">{{item.ruleName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="扣分：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-input placeholder="请输入扣分值" v-decorator="[
            'minusPoints',
            {
              rules: [
                {required: true, message: '请输入扣分值！',}
              ],
            }]">
          </a-input>
        </a-form-item>
        <a-form-item label="登记人：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-select
            placeholder="请选择"
            showSearch
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            :filterOption="filterOption"
            v-decorator="[
              'userId',
              {
                rules: [
                  {required: true, message: '请选择记录人！',}
                ],
              }]">
            <a-select-option v-for="(item, index) in userList" :key="index" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="扣分内容：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-textarea :rows="3" v-decorator="[
            'remark',
            {
              rules: [
                {required: true, message: '请输入扣分内容！',}
              ],
            }]">
          </a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
    <div slot="footer">
      <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment';
import {
  emptyForm, getCompany, getRule, getUser, create, update, getOne, getPeriod,
} from '@/api/modules/maintain-company/maintain-item-register.js';

export default {
  name: '',
  components: {},
  data() {
    return {
      companyList: [],
      ruleList: [],
      userList: [],
      isVisible: false,           // 弹框显示隐藏
      row: {},
      spinning: false,
      itemModel: emptyForm(),     // 表单
      initialYear: Number(moment().format('l').slice(0, 4)),
      initialDate: moment(),
      initialPeriod: '',
    };
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 弹框显示
    openDialog(row) {
      this.getCompanyList();
      this.getRuleList();
      this.getUserList();
      this.getDefaultPeriod();
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
        'corpId': data.corpId,
        'year': data.year,
        'updatedAt': data.updatedAt,
        'ruleId': data.ruleId,
        'minusPoints': data.minusPoints,
        'userId': data.userId,
        'remark': data.remark,
      });
      if (data.updatedAt) {
        this.form.setFieldsValue({ 'updatedAt': moment(data.updatedAt) });
      }
      if (data.periodIndex) {
        this.form.setFieldsValue({ 'periodIndex': `第${data.periodIndex}周期` });
      }
    },
    // 保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'corpId': fieldsValue.corpId,
          'year': fieldsValue.year,
          'updatedAt': fieldsValue.updatedAt ? fieldsValue.updatedAt.format('YYYY-MM-DD 00:00:00') : '',
          'ruleId': fieldsValue.ruleId,
          'minusPoints': fieldsValue.minusPoints,
          'userId': fieldsValue.userId,
          'remark': fieldsValue.remark,
        };
        Object.assign(this.itemModel, setValue);
        this.companyList.forEach((el) => {
          if (el.id === this.itemModel.corpId) {
            this.$set(this.itemModel, 'corpName', el.name);
          }
        });
        this.userList.forEach((el) => {
          if (el.id === this.itemModel.userId) {
            this.$set(this.itemModel, 'userName', el.name);
          }
        });
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
    // 获取记录人列表
    getUserList() {
      getUser().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.userList = response.data.data;
        }
      });
    },
    // 获取手动规则列表
    getRuleList() {
      getRule().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.ruleList = response.data.data;
        }
      });
    },
    // 获取企业列表
    getCompanyList() {
      getCompany().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.companyList = response.data.data;
        }
      });
    },
    getDefaultPeriod() {
      getPeriod().then((response) => {
        this.initialPeriod = response.data.data;
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
