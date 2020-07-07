<template>
<a-modal
    class="apply-dialog"
    width="740px"
    title="新建机构"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
  <a-form :form="form">
    <a-row :gutter="10">
      <a-col :span="12">
        <a-form-item label="机构名称：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-input v-decorator="[
            'name', {
              rules: [
                {required: true, message: '请输入机构名称！'}
              ],
            }]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :labelCol="{span:6}" :wrapperCol="{span:18}">
          <span slot="label">
            邀请码
            <a-tooltip title="您必须与我们取得联系，获取有效的邀请码后，才能创建自己的机构并开始后续工作">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input v-decorator="[
            'inviteCode', {
              rules: [
                {required: true, message: '请输入邀请码！'}
              ],
            }]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
    </a-row>
    <a-row :gutter="10">
      <a-col :span="12">
        <a-form-item label="联系电话：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-input v-decorator="['phone', {
            rules: [
              {required: true, message: '请输入联系电话！'}
            ],
          }]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="邮箱地址：" :labelCol="{span:6}" :wrapperCol="{span:18}">
          <a-input v-decorator="['email']" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="地址：" :labelCol="{span:3}" :wrapperCol="{span:21}">
          <a-input v-decorator="['address']" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="头像：" :labelCol="{span:3}" :wrapperCol="{span:21}">
           <a-upload
            name="avatar"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            action=""
            :beforeUpload="beforeUpload"
            :customRequest="upload"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 102px;height: 102px;"/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
            </div>
          </a-upload>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <div slot="footer">
    <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
    <a-button icon="close" @click="closeDialog">关 闭</a-button>
  </div>
</a-modal>
</template>

<script>
import {
  uploadImg, emptyForm, addInstitu, getOrgList,
} from '@/api/institutions';

export default {
  name: 'applyDialog',
  data() {
    return {
      isVisible: false,
      loading: false,
      imageUrl: '',
      formatData: {},
      itemModel: emptyForm(),
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    beforeUpload(file) {
      this.formatData = new FormData();
      this.formatData.append('file', file);
    },
    // 上传头像
    upload() {
      uploadImg(this.formatData).then((res) => {
        if (res.status === 200) {
          this.itemModel.pic = res.data;
          this.imageUrl = `/api/monitor/static/files/${res.data}`;
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    openDialog() {
      this.isVisible = true;
      this.form = this.$form.createForm(this);
    },
    closeDialog() {
      this.isVisible = false;
    },
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          const setValue = {
            'name': fieldsValue.name,
            'inviteCode': fieldsValue.inviteCode,
            'phone': fieldsValue.phone,
            'email': fieldsValue.email,
            'address': fieldsValue.address,
          };
          Object.assign(this.itemModel, setValue);
          addInstitu(this.itemModel).then((res) => {
            if (res.data.code === 200 && res.data.success) {
              this.$message.success(res.data.msg);
              this.closeDialog();
              this.$emit('getApply');
              getOrgList().then((response) => {
                const organization = Object.values(response.data.data.organizationMap);
                this.$tools.setSessionStorage('organization', organization);
              });
            } else {
              this.$message.warning(res.data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
