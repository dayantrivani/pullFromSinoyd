<template>
  <a-modal
    class="stationDialog"
    width="830px"
    :title="this.id ? '编辑站点' : '新增站点'"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-form :form="form">
        <a-row>
          <a-col :span="12">
            <a-form-item label="站点名称：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input
                placeholder="请输入站点名称"
                v-decorator="[
                'name',
                {
                  rules: [
                    {required: true, message: '请输入站点名称！',}
                  ],
                }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点mn号：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input
                placeholder="请输入站点mn号"
                v-decorator="[
                'mn',
                {
                  rules: [
                    {required: true, message: '请输入站点mn号！',}
                  ],
                }]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="运维单位：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-select placeholder="请选择运维单位" v-decorator="['corpId']">
                <a-select-option
                  v-for="item in unitsData"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点类型：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-select placeholder="请选择站点类型" v-decorator="['type']">
                <a-select-option
                  v-for="item in stationTypes"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点经度：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input
                placeholder="请输入站点经度"
                v-decorator="[
                'lng',
                {
                  rules: [
                    {required: true, message: '请输入站点经度！',}
                  ],
                }]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点纬度：" :labelCol="{span:6}" :wrapperCol="{span:18}">
              <a-input
                placeholder="请输入站点纬度"
                v-decorator="[
                'lat',
                {
                  rules: [
                    {required: true, message: '请输入站点纬度！',}
                  ],
                }]"
              ></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item label="站点地址：" :labelCol="{span:3}" :wrapperCol="{span:21}">
              <a-input placeholder="请输入站点地址度" v-decorator="['address']"></a-input>
            </a-form-item>
          </a-col>-->
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
// import moment from 'moment';
import { saveStation, getStationDetail, getUnits } from '@/api/modules/enter-management.js';

export default {
  name: 'StationDialog',
  props: {
    companyId: Number,
  },
  data() {
    return {
      isVisible: false,
      spinning: false,
      id: '',
      stationTypes: [
        {
          id: '1',
          name: '废水',
        },
        {
          id: '2',
          name: '废气',
        },
        {
          id: '3',
          name: '雨水',
        },
        {
          id: '4',
          name: '噪声',
        },
      ],
      unitsData: [], // 运维单位数据
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    openDialog(row) {
      if (row) {
        this.id = row.id;
        // 编辑获取站点详情
        getStationDetail(this.id).then((res) => {
          if (res.data.code === 200 && res.data.success) {
            const { data } = res.data;
            this.form.setFieldsValue({
              'name': data.name,
              'mn': data.mn,
              'corpId': data.corpId,
              'type': data.type,
              'address': data.address,
              'lat': data.lat,
              'lng': data.lng,
            });
          }
        });
      } else {
        this.id = '';
      }
      this.isVisible = true;
      this.getUnits();
    },
    getUnits() {
      getUnits().then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.unitsData = res.data.data;
        }
      });
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
          'mn': fieldsValue.mn,
          'corpId': fieldsValue.corpId,
          'type': fieldsValue.type,
          'address': fieldsValue.address,
          'lat': fieldsValue.lat,
          'lng': fieldsValue.lng,
        };
        this.$set(setValue, 'companyId', this.companyId);
        saveStation(setValue, this.id).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeDialog();
            this.$emit('getStationData', { id: this.companyId, checkId: response.data.data.id });
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
