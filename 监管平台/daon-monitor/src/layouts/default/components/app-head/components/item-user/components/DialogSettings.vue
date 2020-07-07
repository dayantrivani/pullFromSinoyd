<template>
  <a-modal
      title="设置用户头像"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-upload
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader-user"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :customRequest="onSendUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">
            Upload
          </div>
        </div>
      </a-upload>
    </a-modal>
</template>

<script>
export default {
  name: 'DialogSettings',
  data() {
    return {
      visible: false,
      imageUrl: '',
      loading: false,
      file: '',
      formatData: {},
      filePath: '',
    };
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.$axios.request({
        url: `/api/monitor/image/user-pic?pic=${this.filePath}`,
        method: 'post',
      }).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 1.5);
          this.visible = false;
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    // 上传前转化成 formData 对象
    beforeUpload(file) {
      this.file = file;
      this.formatData = new FormData();
      this.formatData.append('file', file);
    },
    // 上传方法
    onSendUpload() {
      this.$axios.request({
        url: '/api/monitor/attach/upload',
        method: 'post',
        data: this.formatData,
      }).then((response) => {
        if (response.data.code === 500 && !response.data.success) {
          this.$message.warning(response.data.msg, 1.5);
        } else if (response.status === 200) {
          this.filePath = response.data[0].filePath;
          this.imageUrl = `/api/monitor/static/files/${response.data[0].filePath}`;
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    openDialog() {
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss">
.avatar-uploader-user{
  // margin-left: 140px;
   .ant-upload {
    width: 168px;
    height: 134px;
    margin-right: 0!important;
    margin: 0 auto!important;
    >img{
      width: 150px;
    }
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
