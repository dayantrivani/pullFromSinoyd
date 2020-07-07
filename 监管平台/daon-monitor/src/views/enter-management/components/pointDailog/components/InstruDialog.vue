<template>
  <a-modal
    class="stationDialog"
    width="450px"
    title="新增仪器"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item label="仪器名称：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input placeholder="请输入仪器称点" v-decorator="[
                'name',
                {
                  rules: [
                    {required: true, message: '请输入仪器名称！',}
                  ],
                }]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="仪器编号：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input placeholder="请输入仪器编号" v-decorator="[
                'sn',
                {
                  rules: [
                    {required: true, message: '请输入仪器编号！',}
                  ],
                }]">
              </a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="站点因子：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input placeholder="请输入站点因子" v-decorator="[
                'lng',
                {
                  rules: [
                    {required: true, message: '请输入站点因子！',}
                  ],
                }]"></a-input>
            </a-form-item>
          </a-col> -->
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
import { saveInstru, getInsDetail } from '@/api/modules/enter-management.js';

export default {
  name: 'InstruDialog',
  props: {
    companyId: Number,
    stationId: Number,
  },
  data() {
    return {
      isVisible: false,
      spinning: false,
      id: '',
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    openDialog(id) {
      this.id = id;
      if (id) {
        // 编辑获取仪器详情
        getInsDetail(id).then((res) => {
          if (res.data.code === 200 && res.data.success) {
            const { data } = res.data;
            this.form.setFieldsValue({
              'name': data.name,
              'sn': data.sn,
            });
          }
        });
      }
      this.isVisible = true;
    },
    closeDialog() {
      this.isVisible = false;
      this.form.resetFields();
    },
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        const setValue = {
          'name': fieldsValue.name,
          'sn': fieldsValue.sn,
        };
        this.$set(setValue, 'companyId', this.companyId);
        this.$set(setValue, 'stationId', this.stationId);
        saveInstru(setValue, this.id).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeDialog();
            this.$emit('getInstru', this.stationId);
          } else {
            this.$message.warning(response.data.msg, 3);
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
