<template>
  <a-modal
    class="enter-dialog"
    width="1200px"
    :title="`${row.id ? '编辑' : '新增'}企业`"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-form :form="form">
        <a-row :gutter="10">
          <a-col :span="16">
            <a-row>
              <a-col :span="12">
                <a-form-item label="企业名称：" :labelCol="{span:8}" :wrapperCol="{span:16}">
                  <a-input
                    placeholder="请输入企业名称"
                    v-decorator="[
                    'name',
                    {
                      rules: [
                        {required: true, message: '请输入企业名称！',}
                      ],
                    }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="社会信用代码：" :labelCol="{span:8}" :wrapperCol="{span:16}">
                  <a-input
                    placeholder="请输入社会信用代码(18位数字或字母)"
                    v-decorator="[
                    'creditCode',
                    {
                      rules: [
                        {required: true, message: '请输入社会信用代码！',}
                      ],
                    }]"
                  >
                    <a-icon
                      type="share-alt"
                      slot="suffix"
                      @click="onRelate"
                      v-if="isMultiCode"
                      title="关联关系"
                    ></a-icon>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="企业法人：" :labelCol="{span:8}" :wrapperCol="{span:16}">
                  <a-input
                    placeholder="请输入企业法人"
                    v-decorator="[
                    'corporation'
                  ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="联系人：" :labelCol="{span:8}" :wrapperCol="{span:16}">
                  <a-input v-decorator="['contactName']"></a-input>
                </a-form-item>
                <!-- <a-form-item label="关注程度：" :labelCol="{span:8}" :wrapperCol="{span:16}">
                  <a-select
                    placeholder="请选择"
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-decorator="[
                      'attentionLevel',
                    ]">
                    <a-select-option v-for="(item, index) in $enum.ATTENTION_LEVEL" :key="index" :value="item.value">
                      {{item.label}}</a-select-option>
                  </a-select>
                </a-form-item>-->
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
            <a-form-item label="头像：" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-upload
                name="avatar"
                listType="picture-card"
                class="avatar-uploader"
                :beforeUpload="beforeUpload"
                :customRequest="upload"
                :showUploadList="false"
              >
                <img v-if="avatarImg" :src="isEffective ? avatarImg : img" alt="avatar" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="8">
            <a-form-item label="联系电话：" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input v-decorator="['contactPhone']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="经度：" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input v-decorator="['glng']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="纬度：" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input v-decorator="['glat']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="地址：" :labelCol="{span:8}" :wrapperCol="{span:16}">
              <a-input v-decorator="['address']"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否聘用专业运维公司：" :labelCol="{span:12}" :wrapperCol="{span:12}">
              <a-switch
                v-decorator="[
                'isOperation',
                { valuePropName: 'checked',
                  initialValue: false, }
                ]"
              ></a-switch>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否重点污染源：" :labelCol="{span:12}" :wrapperCol="{span:12}">
              <a-switch
                v-decorator="[
                'isVital',
                { valuePropName: 'checked',
                  initialValue: false, }
                ]"
              ></a-switch>
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
  emptyForm, getIndustry, getDistrict, create, update, getOne, uploadAvatar, checkCode, relate,
} from '@/api/modules/enter-management.js';

export default {
  name: '',
  components: {},
  data() {
    return {
      // reginLabel: '', // 编辑时的区域默认显示
      isVisible: false,           // 弹框显示隐藏
      row: {},
      spinning: false,
      districts: [],              // 区域列表
      industrys: [],              // 行业列表
      itemModel: emptyForm(),     // 表单
      currentUser: {},            // 当前用户信息
      avatarImg: '',              // 头像路径
      loading: false,
      formatData: {},
      isMultiCode: false,
      /* eslint-disable */
      img: require('@/assets/img/user_avater_man_100x100.jpg'),
      isEffective: false,
    };
  },
  methods: {
    changeData(val) {
      Object.assign(this.itemModel, val);
    },
    // 关联关系
    onRelate() {
      const code = this.form.getFieldValue('creditCode');
      relate(code).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg);
        } else {
          this.$message.warning(response.data.msg);
        }
      });
    },
    // 输入框失焦验证信用代码
    checkCode() {
      const code = this.form.getFieldValue('creditCode');
      if (code) {
        checkCode(code).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            if (response.data.data) {
              this.isMultiCode = true;
              this.$message.warning('社会信用代码重复，需绑定请点击关联关系');
            } else {
              this.isMultiCode = false;
            }
          } else {
            this.$message.warning(response.data.msg);
          }
        });
      }
    },
    // 头像上传前
    beforeUpload(file) {
      this.formatData = new FormData();
      this.formatData.append('file', file);
    },
    // 上传事件
    upload() {
      this.loading = true;
      uploadAvatar(this.formatData).then((response) => {
        if (response.status === 200) {
          this.$set(this.itemModel, 'pic', response.data);
          this.avatarImg = `/api/monitor/static/files/${response.data}`;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
        this.loading = false;
      });
    },
    // 弹框显示
    openDialog(row) {
      // this.getDistrictData();
      // this.getIndustryData();
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
      this.isMultiCode = false;
      this.itemModel = emptyForm();
      this.form.resetFields();
      // this.$refs.Regiona.reset();
      // this.reginLabel = '';
      this.avatarImg = '';
    },
    // 表单赋值
    setOneData(data) {
      // 区域组件赋值
      // this.reginLabel = data.townName;
      // this.itemModel.townId = data.townId;
      this.form.setFieldsValue({
        'name': data.name,
        'creditCode': data.creditCode,
        // 'industryId': data.industryId,
        'corporation': data.corporation,
        'attentionLevel': data.attentionLevel,
        'contactName': data.contactName,
        'contactPhone': data.contactPhone,
        'glng': data.glng,
        'glat': data.glat,
        'address': data.address,
        'isOperation': data.isOperation,
        'isVital': data.isVital,
      });
      this.isEffective = data.isEffective;
      this.avatarImg = data.pic ? `/api/monitor/static/files/${data.pic}` : '';
    },
    // 验证区域
    valiReg() {
      return new Promise((resolve) => {
        this.$refs.Regiona.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          resolve();
        });
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
            'creditCode': fieldsValue.creditCode,
            // 'industryId': fieldsValue.industryId,
            'corporation': fieldsValue.corporation,
            'attentionLevel': fieldsValue.attentionLevel,
            'contactName': fieldsValue.contactName,
            'contactPhone': fieldsValue.contactPhone,
            'glng': fieldsValue.glng,
            'glat': fieldsValue.glat,
            'address': fieldsValue.address,
            'isOperation': fieldsValue.isOperation,
            'isVital': fieldsValue.isVital,
          };
          resolve(setValue);
        });
      });
    },
    // 保存事件
    onSave() {
      Promise.all([this.validateImfomation()]).then(values => {
        if (values) {
          Object.assign(this.itemModel, values[0]);
          // console.log(this.itemModel);
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
        }
      });
    },
    // 获取行业列表
    getIndustryData() {
      getIndustry().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.industrys = response.data.data;
        }
      });
    },
    // 获取区域列表
    getDistrictData() {
      getDistrict().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.districts = response.data.data;
        }
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
<style lang="scss">
.enter-dialog {
  .avatar-uploader > .ant-upload {
    width: 100px;
    height: 100px;
    img {
      width: 84px;
      height: 84px;
    }
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .ant-input-suffix {
    border-left: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 9px 0 9px 9px;
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
</style>
