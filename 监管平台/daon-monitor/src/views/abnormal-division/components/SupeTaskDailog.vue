<template>
  <a-modal
    class="choose-dialog"
    width="400px"
    title="选择企业"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="closeDialog"
  >
    <a-select style="width: calc(100% - 70px)" v-model="companyId">
      <a-select-option v-for="item in companyData" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
    </a-select>
    <a-modal
      class="add-dialog"
      width="450px"
      title="添加督办任务"
      :visible="isTaskVisible"
      :maskClosable="false"
      :centered="true"
      @cancel="closeTaskDialog"
    >
      <a-row>
        <a-form :form="form">
          <a-col :span="24">
            <a-form-item label="选择站点：" :labelCol="{span:7}" :wrapperCol="{span:17}">
              <a-select placeholder="请选择站点" v-decorator="[
                'stationId',
                {
                  rules: [
                    {required: true, message: '请选择站点！',}
                  ],
                }]">
                <a-select-option v-for="item in stationData" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="报警类型：" :labelCol="{span:7}" :wrapperCol="{span:17}">
              <a-input placeholder="请输入报警类型" v-decorator="[
                'type',
                {
                  rules: [
                    {required: true, message: '请输入报警类型！',}
                  ],
                }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="报警时间：" :labelCol="{span:7}" :wrapperCol="{span:17}">
              <a-date-picker style="width: 100%;" showTime placeholder="请选择报警时间" v-decorator="[
                'alarmedAt',
                {
                  rules: [
                    {required: true, message: '请选择报警时间！',}
                  ],
                }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="要求完成时间：" :labelCol="{span:7}" :wrapperCol="{span:17}">
              <a-input-number :min="0" :precision="0" placeholder="请输入要求完成时间" v-decorator="[
                'disposeWarningHour',
                {
                  rules: [
                    {required: true, message: '请输入要求完成时间！',}
                  ],
                }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="是否重点：" :labelCol="{span:7}" :wrapperCol="{span:17}">
              <a-switch checkedChildren="是" unCheckedChildren="否" v-decorator="['attention']"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="报警内容：" :labelCol="{span:7}" :wrapperCol="{span:17}">
              <a-input placeholder="请输入报警内容" v-decorator="[
                'message',
                {
                  rules: [
                    {required: true, message: '请输入报警内容！',}
                  ],
                }]"/>
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <div slot="footer">
        <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
        <a-button icon="close" @click="closeTaskDialog">关 闭</a-button>
      </div>
    </a-modal>
    <a-button style="margin-left: 5px" type="primary" @click="enterItem" :disabled="!this.companyId">确定</a-button>
  </a-modal>
</template>

<script>
import { getCompanyList, getStation } from '@/api/modules/enter-management.js';
import { emptyForm, addTask } from '@/api/modules/abnormal-division.js';

export default {
  name: 'supeTaskDailog',
  data() {
    return {
      isVisible: false,
      isTaskVisible: false,
      companyId: '',  // 企业id
      companyData: [],  // 企业数据
      stationData: [],  // 站点数据
      itemModel: emptyForm(),
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    // 添加督办任务-保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'stationId': fieldsValue.stationId,
          'type': fieldsValue.type,
          'alarmedAt': fieldsValue.alarmedAt ? fieldsValue.alarmedAt.format('YYYY-MM-DD HH:mm:ss') : '',
          'disposeWarningHour': fieldsValue.disposeWarningHour,
          'attention': fieldsValue.attention,
          'message': fieldsValue.message,
        };
        Object.assign(this.itemModel, setValue);
        if (err) {
          return;
        }
        const cur = this.stationData.find(val => val.id === this.itemModel.stationId);
        this.$set(this.itemModel, 'stationName', cur.name);
        this.$set(this.itemModel, 'companyId', this.companyId);
        this.$delete(this.itemModel, 'stationId');
        addTask(this.itemModel).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeTaskDialog();
          } else {
            this.$message.warning(response.data.msg, 3);
          }
        });
      });
    },
    // 打开添加督办任务
    enterItem() {
      this.isVisible = false;
      this.isTaskVisible = true;
      const item = this.companyData.find(val => val.id === this.companyId);
      getStation(item.creditCode).then((res) => {
        if (res.data.code === 200) {
          this.stationData = Object.values(res.data.data);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    closeTaskDialog() {
      this.isTaskVisible = false;
      this.itemModel = emptyForm();
      this.form.resetFields();
      this.$emit('onQueryList');
    },
    // 弹框显示
    openDialog() {
      this.isVisible = true;
      getCompanyList({ rows: 2147483647 }).then((res) => {
        if (res.data.code === 200) {
          this.companyData = res.data.data;
          this.companyId = this.companyData[0].id;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss">
.station_card{
  height: 125px;
  >.ant-card-body{
    padding: 20px;
  }
}
.instrument_card{
  height: calc(100% - 135px);
  margin-top: 10px;
  >.ant-card-body{
    padding: 20px;
  }
}
.pointDailog-table{
  height: 100%;
  overflow-y: auto;
  .ant-table-content{
    min-height: 0;
  }
}
</style>

<style lang="scss" scoped>
.spn{
  font-weight: 600;
}
</style>
