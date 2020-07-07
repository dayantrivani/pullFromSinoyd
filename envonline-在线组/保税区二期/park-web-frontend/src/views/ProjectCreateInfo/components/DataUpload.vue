<template>
  <el-upload
    style="display: inline-block"
    class="mar-r-sm"
    action=""
    accept=".xls,.xlsx"
    :disabled="uploadStatus"
    :show-file-list="false"
    :file-list="fileList"
    :before-upload="beforeUpload"
    :http-request="onUpload"
    :on-success="handleSuccess">
    <el-button type="primary" icon="fas fa-download">导 入</el-button>
  </el-upload>
</template>

<script>
import { getFleSuffix } from '@/global/libs/tools';

export default {
  data() {
    return {
      uploadStatus: false,
      fileSize: 10,               // 文件大小
      fileType: ['xls', 'xlsx'],  // 上传文件类型
      fileTemp: '',
      fileList: [],
    };
  },
  methods: {
    beforeUpload(file) {
      // 上传的文件是否为 excel
      const isXls = this.fileType.includes(getFleSuffix(file.name));
      // 上传文件大小是否小于 2MB
      const isSize = file.size / 1024 / 1024 < this.fileSize;
      if (!isXls) {
        this.$message.error('上传文件格式只能是 xls 或者 xlsx');
      }
      if (!isSize) {
        this.$message.error('上传文件大小不能超过 2MB');
      }
      if (isXls && isSize) {
        this.fileTemp = file;
      }
      return isXls && isSize;
    },
    handleSuccess() {
      this.$message.success({
        message: '操作成功',
        duration: 3000,
        showClose: true,
      });
      this.$emit('query');
    },
    onUpload({ file }) {
      this.uploadStatus = true;
      this.formatData = new FormData();
      this.formatData.append('file', file);
      return new Promise((resolve) => {
        this.$http.post('bas/pSProjectInfo/import', this.formatData).then((response) => {
          if (response.status === 200 && response.data.success) {
            resolve(response.data);
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }).finally(() => {
          this.uploadStatus = false;
        });
      });
    },
  },
};
</script>
