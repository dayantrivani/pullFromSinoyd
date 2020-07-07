<template>
  <el-upload
    v-loading="loading"
    ref="upload"
    :disabled="disabled"
    :class="{ 'one-picture': isOnlyPic }"
    class="pic-upload"
    list-type="picture-card"
    action=""
    accept=".jpg,.jpeg,.png,.gif"
    :http-request="onUpload"
    :auto-upload="false"
    :limit="limit"
    :file-list="fileList"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-change="fileChange"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove">
    <i class="el-icon-plus"></i>
    <dialog-modal ref="imgDialog" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </dialog-modal>
  </el-upload>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'UploadPicture',
  props: {
    objectId: {
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      required: false,
      default: null,
    },
    docTypeId: {
      required: false,
      default: null,
    },
  },
  computed: {
    isOnlyPic() { return this.limit ? this.fileList.length >= this.limit : false; },
  },
  data() {
    return {
      loading: false, // 图片加载动画
      id: '',
      fileList: [],
      formatData: new FormData(),
      dialogImageUrl: '',
      // dialogVisible: false,
    };
  },
  created() {
    if (this.objectId) this.getImg();
  },
  methods: {
    getImg(rowGuid) { // 获取编辑中图片信息事件
      if (!rowGuid) {
        this.fileList = [];
        return;
      }
      this.loading = true;
      this.id = rowGuid;
      this.$http.get(`res/document/objectId/${rowGuid || this.objectId || this.id}`).then((response) => {
        if (response.data.success) {
          if (response.data.data.length) {
            this.fileList = response.data.data.map(n => ({ ...n, name: n.physicalName, url: n.base64Content }));
            // eslint-disable-next-line
            if (this.docTypeId) this.fileList = this.fileList.filter(n => n.docTypeId == this.docTypeId);
          } else {
            this.fileList = [];
          }
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: response.data.msg,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    fileChange(file, fileList) {
      // 检测文件后缀
      const picList = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
      const isPic = picList.includes(file.raw && file.raw.type);
      if (!isPic) {
        this.$message({
          message: '请选择图片',
          type: 'warning',
        });
        this.fileList = fileList.filter(files => files.uid !== file.uid);
      } else {
        this.fileList = fileList;
      }
    },
    // 上传前的钩子 格式化
    beforeUpload() {
      // this.formatData = new FormData();  // 创建form对象
      // this.formatData.append('file', file, file.name);  // file对象是 beforeUpload参数
      return true;
    },
    beforeRemove(file) {
      let flag = false;
      if (file.id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const response = await this.$http.delete('res/document', { data: [file.id] });
          if (response.status === 200) {
            this.$message.success({
              message: '删除成功',
              duration: 3000,
              showClose: true,
            });
            this.getImg(this.objectId || this.id);
            flag = true;
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }).catch(() => {
          flag = false;
        });
      } else {
        flag = true;
      }
      return flag;
    },
    // 上传方法
    onUpload(id) {
      this.formatData = new FormData();
      this.fileList.filter(n => n.status !== 'success').forEach((element) => {
        this.formatData.append('file', element.raw, element.name);
        if (this.docTypeId) this.formatData.append('docTypeId', this.docTypeId);
      });
      return new Promise((resolve) => {
        if (!this.fileList.every(val => val.status === 'success')) {
          resolve(this.$http.post(`res/document/upload?objectId=${this.objectId || id}`, this.formatData)
            .then(() => {
              this.$message.success({
                message: '上传成功',
                duration: 3000,
                showClose: true,
              });
              this.getImg(this.id);
            }), ({ response }) => {
            analyzeResp(response);
          });
        } else {
          resolve({ data: { code: 200, success: true } });
        }
      });
    },
    clearFiles() {
      this.fileList = [];
    },
    handleRemove(file, fileList) {
      this.fileList = [...fileList];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.$refs.imgDialog.openDialog();
    },
  },
};
</script>

<style>

</style>
