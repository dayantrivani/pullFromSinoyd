<template>
  <dialog-modal ref="dialog" size="mini" title="上传附件" :appendToBody="true" @close="onCloseDialog">
    <el-upload
      ref="addFile"
      multiple
      class="mar-t-xs mar-b-xs"
      action=""
      :before-upload="beforeUpload"
      :file-list="tempList"
      :auto-upload="false"
      :http-request="onCreateItem"
      :on-change="onFileChange"
      :on-remove="handleRemove">
      <el-button size="small">选择文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传不超过 10MB 大小的文件, 且每次上传不超过 100MB 大小 </div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        icon="fas fa-cloud-upload-alt"
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
      formatData: {},     // 上传数据转化对象
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
    beforeUpload(file) {
      this.formatData.param = new FormData();  // 创建form对象
      this.formatData.param.append('file', file, file.name);  // file对象是 beforeUpload参数
      this.formatData.config = {
        params: {
          objectId: this.id,
          // docTypeId: this.docTypeId,
        },
      };
    },
    // 上传附件
    onCreateItem() {
      this.$http.post('res/document/upload', this.formatData.param, this.formatData.config)
        .then((response) => {
          if (response.data.success) {
            this.$message.success('上传成功');
            this.$emit('getItemList');
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }).finally(() => {
          this.$refs.dialog.closeDialog();
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
        this.$refs.addFile.submit();
      }
    },
    onCloseDialog() {
      this.tempList = [];
      this.formatData = {};
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
