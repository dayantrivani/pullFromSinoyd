<template>
  <dialog-modal ref="dialog" size="mini" title="上传附件" :appendToBody="true" @close="onCloseDialog">
    <!--
      :before-upload="beforeUpload"
      :http-request="onCreateItem"
    -->
    <el-upload
      ref="addFile"
      multiple
      class="mar-t-xs mar-b-xs"
      action=""
      :file-list="tempList"
      :auto-upload="false"
      :on-change="onFileChange"
      :on-remove="handleRemove">
      <el-button size="small">选择文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传不超过 10MB 大小的文件, 且每次上传不超过 100MB 大小 </div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        icon="fas fa-cloud-upload-alt"
        v-loading="loading"
        @click="onClickUpload">上 传
      </el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </span>
  </dialog-modal>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    // docTypeId: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      loading: false,
      tempList: [],       // 待上传附件列表
    };
  },
  computed: {
    // 文件大小数组
    filesSize() {
      return this.tempList.map(val => val.size / 1024 / 1024);
    },
    // 单个上传文件 true: 小于10MB, false: 文件大小超出
    isFileSize() {
      return this.filesSize.every(size => size < 10);
    },
    // 多个上传文件 true: 小于100MB, false: 总大小超出
    isFilesSize() {
      return this.filesSize.reduce((val, newVal) => val + newVal, 0) < 100;
    },
  },
  watch: {
  },
  methods: {
    // 打开弹框
    openDialog() {
      this.$refs.dialog.openDialog();
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.tempList = fileList;
    },
    // 文件改变时
    onFileChange(file, fileList) {
      this.tempList = fileList;
    },
    // 上传前的钩子 格式化
    beforeUpload() {
      const arrUpload = [];
      this.tempList.forEach((file) => {
        const formatData = {
          param: {},
          config: {},
        };
        formatData.param = new FormData();  // 创建form对象
        formatData.param.append('file', file.raw, file.name);  // file对象是 beforeUpload 参数
        formatData.config = {
          params: {
            objectId: this.id,
            // docTypeId: this.docTypeId,
          },
        };
        arrUpload.push(this.onCreateItem(formatData, file.name));
      });
      this.loading = true;
      Promise.all(arrUpload).then(() => {
        this.$message.success('上传成功');
        this.$emit('query');
        this.$refs.dialog.closeDialog();
      }).catch((error) => {
        this.$message.wraning({
          message: `文件${error.join(',')}上传失败`,
          showClose: true,
          duration: 3000,
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    // 上传附件
    onCreateItem(formatData, name) {
      return new Promise((reslove, reject) => {
        this.$http.post('res/document/upload', formatData.param, formatData.config)
          .then((response) => {
            if (response.data.success) {
              reslove();
            } else {
              reject(name);
            }
          }, () => {
            reject(name);
          });
      });
    },
    // 点击触发上传请求
    onClickUpload() {
      if (!this.tempList.length) {
        this.$message.info('请选择需要上传的附件');
      } else if (!this.isFileSize) {
        this.$message.info('单个文件大小不能超过10MB');
      } else if (!this.isFilesSize) {
        this.$message.info('上传文件总大小不能超过100MB');
      } else {
        this.beforeUpload();
      }
    },
    onCloseDialog() {
      this.tempList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
