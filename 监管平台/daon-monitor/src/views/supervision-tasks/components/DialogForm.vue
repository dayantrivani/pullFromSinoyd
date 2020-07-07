<template>
  <a-modal
    width="620px"
    title="新增任务"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-form :form="form">
      <a-form-item label="企业名称：" :labelCol="{span:6}" :wrapperCol="{span:18}">
        <a-select
          showSearch
          placeholder="请选择"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
          :filterOption="filterOption"
          @change="changeCompany"
          v-decorator="[
            'companyId',
            {
              rules: [
                {required: true, message: '请选择企业！',}
              ],
            }]"
        >
          <a-select-option
            v-for="(item, index) in companyList"
            :key="index"
            :value="item.id"
          >{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="站点名称：" :labelCol="{span:6}" :wrapperCol="{span:18}">
        <a-select
          showSearch
          placeholder="请选择"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
          :filterOption="filterOption"
          @change="changeStation"
          v-decorator="[
            'stationId',
            {
              rules: [
                {required: true, message: '请选择站点！',}
              ],
            }]"
        >
          <a-select-option
            v-for="(item, index) in stationList"
            :key="index"
            :value="item.id"
          >{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="任务类型：" :labelCol="{span:6}" :wrapperCol="{span:18}">
        <a-select
          placeholder="请选择"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
          :filterOption="filterOption"
          v-decorator="[
            'type',
            {
              rules: [
                {required: true, message: '请选择任务类型！',}
              ],
            }]"
        >
          <a-select-option value="1">例行任务</a-select-option>
          <a-select-option value="2">协同任务</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="表单名称：" :labelCol="{span:6}" :wrapperCol="{span:18}">
        <a-select
          mode="multiple"
          :showArrow="true"
          placeholder="请选择"
          :getPopupContainer="triggerNode => triggerNode.parentNode"
          :filterOption="filterOption"
          v-decorator="[
            'supervisionTaskItems',
            {
              rules: [
                {required: true, message: '请选择表单！',}
              ],
            }]"
        >
          <a-select-option
            v-for="(item, index) in formList"
            :key="index"
            :value="item.id"
          >{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否超标：" :labelCol="{span:6}" :wrapperCol="{span:18}">
        <a-switch v-decorator="['isOver', { valuePropName: 'checked' }]" />
      </a-form-item>
      <a-form-item label="任务说明：" :labelCol="{span:6}" :wrapperCol="{span:18}">
        <a-textarea :rows="3" v-decorator="['remark']"></a-textarea>
      </a-form-item>
    </a-form>
    <div slot="footer">
      <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import {
  emptyForm, getCompanyList, getForm, getStation, save,
} from '@/api/modules/supervision-tasks.js';

export default {
  data() {
    return {
      isVisible: false,
      itemModel: emptyForm(),
      companyList: [],    // 企业列表
      stationList: [],    // 站点列表
      formList: [],       // 表单列表
      lastCompany: null,  // 上一个选中的企业id
      selectedCompany: {},
      selectedStation: {},
    };
  },
  methods: {
    // 弹框显示
    openDialog() {
      // 打开弹框时要获取企业信息
      this.getCompany();
      this.getForm();
      this.isVisible = true;
    },
    // 获取企业列表
    getCompany() {
      getCompanyList().then((response) => {
        this.companyList = response.data.data;
      });
    },
    // 获取表单列表
    getForm() {
      getForm().then((response) => {
        this.formList = response.data.data;
      });
    },
    // 关闭弹框
    closeDialog() {
      this.isVisible = false;
      this.itemModel = emptyForm();
      this.form.resetFields();
      this.companyList = [];
      this.stationList = [];
      this.formList = {};
      this.lastCompany = null;
      this.selectedCompany = {};
      this.selectedStation = {};
    },
    // 企业切换事件
    changeCompany(value) {
      // 切换企业时对比上一次选中的企业，若不同，则重新获取站点信息
      this.selectedCompany = this.companyList.find(el => el.id === value);
      if (!this.lastCompany || value !== this.lastCompany) {
        this.form.setFieldsValue({ 'stationId': undefined });
        getStation(this.selectedCompany.id).then((response) => {
          const tem = response.data.data;
          this.stationList = Object.values(tem);
        });
      }
      this.lastCompany = value;
    },
    // 站点切换事件
    changeStation(value) {
      this.selectedStation = this.stationList.find(el => el.id === value);
    },
    // 保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        const setValue = {
          'companyId': fieldsValue.companyId,
          'stationId': fieldsValue.stationId,
          'type': fieldsValue.type,
          'supervisionTaskItems': fieldsValue.supervisionTaskItems,
          'remark': fieldsValue.remark,
          'isOver': fieldsValue.isOver,
        };
        Object.assign(this.itemModel, setValue);
        const temTaskItem = [];
        this.$set(this.itemModel, 'companyName', this.selectedCompany.name);
        this.$set(this.itemModel, 'companyUscc', this.selectedCompany.creditCode);
        this.$set(this.itemModel, 'stationName', this.selectedStation.name);
        this.$set(this.itemModel, 'stationMn', this.selectedStation.mn);
        this.$set(this.itemModel, 'typeName', this.itemModel.type === '1' ? '例行任务' : '协同任务');
        this.$set(this.itemModel, 'isOver', this.selectedStation.isOver);
        this.itemModel.supervisionTaskItems.forEach((el) => {
          const obj = {};
          const temForm = this.formList.find(element => element.id === el);
          obj.formId = temForm.id;
          obj.versionId = temForm.versionId;
          temTaskItem.push(obj);
        });
        this.$set(this.itemModel, 'supervisionTaskItems', temTaskItem);
        save(this.itemModel).then((response) => {
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
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
};
</script>

<style lang="scss" scoped>
</style>
