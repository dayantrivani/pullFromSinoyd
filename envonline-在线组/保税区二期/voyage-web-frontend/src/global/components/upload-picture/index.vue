<template>
<!-- 使用方法：
    id               必传,列表数据的id
    isRequest        是否调用获取附件的接口
    btn              可选, 当所传值包含[add, down, remove]时,显示添加附件选项,反之，隐藏
      触发的父组件方法中必然包含该代码：
        this.isRequset = false;
      示例：
        父组件
        <upload-file
          :isRequest="isRequest"
          id="itemModel.id || ''"
        >
-->

  <div class="mod-upload-pictrue" v-loading="loading">
    <el-upload
      ref="addFile"
      action=""
      drag
      list-type="picture-card"
      :http-request="beforeUpload"
      :on-exceed="onExceed"
      :auto-upload="true"
      :file-list="fileList"
      :limit="1"
    >
      <!-- <template v-show="!(fileList.length === 1)"> -->
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">请上传jpg/png类型文件</div>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <span class="el-upload-list__item-actions">
          <!-- <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span> -->
          <span
            class="el-upload-list__item-delete"
            @click="onClickDown(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="onClickDele(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <!-- </template> -->
    </el-upload>
  </div>
</template>

<script>
import '~/fonts/iconfont.js';
// import { analyzeResp, getFileIcon } from '@/global/libs/util';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'UploadPicture',
  props: {
    docTypeId: {
      type: [String, Number],
      default: '',
    },
    objectId: {                // 列表数据id
      required: true,
      validator(value) {
        return ['undefined', 'string', null].indexOf((typeof value)) !== -1;
      },
    },
    props: {
      type: Object,
      default: () => ({
        name: 'docName',   // 文件名
        size: 'docSize',   // 文件大小
        link: 'path',      // 文件下载链接
      }),
    },
  },
  data() {
    return {
      url: 'res/document/upload',
      loading: false,
      removeIndex: -1,
      imgUrl: '',
      fileList: [],             // 附件列表
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    // getIcon: getFileIcon,         // 获取文件图标
    // onChange(file, fileList) {    // 文件状态改变时的钩子,添加文件、上传成功、和上传失败
    //   this.fileList = fileList;
    // },
    onExceed() {
      this.$message.warning({
        message: '仅支持上传一张图片',
        showClose: true,
        duration: 3000,
      });
    },

    /** 请求层 */
    getItemList() {               // 获取附件列表
      this.loading = true;
      this.$http.get(`res/document/objectId/${this.objectId}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          if (response.data.data && response.data.data.length) {
            this.fileList = response.data.data.map(n => ({ ...n, name: n.physicalName, url: n.base64Content }));
            // eslint-disable-next-line
            // if (this.docTypeId) {
            //   this.fileList = this.fileList.filter(n => n.docTypeId == this.docTypeId);
            // }
          } else {
            this.fileList = [];
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    uploadQuery(data) {           // 上传方法
      this.loading = true;
      this.$http.post(`res/document/upload/?objectId=${this.objectId}`, data).then((response) => {
        if (response.status === 200) {
          this.$message.success({
            message: '上传成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    onClickDown(row) {            // 点击下载
      if (row.status === 'ready') return;
      this.$http.get(`res/document/download?id=${row.id}`, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const fileName = row.docName;
          const blob = new Blob([response.data], { type: 'application/x-xls' });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }
      }, (response) => {
        analyzeResp(response);
      });
    },
    onClickDele(file) {           // 移除附件
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('res/document', { data: [file.id] })
      )).then((response) => {
        if (response.status === 200) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },

    /** 特殊方法 */
    beforeUpload(val) {           // 上传前将文件转化成 formData 格式
      const formData = new FormData();
      // val.forEach((item) => {
      formData.append('file', val.file, val.file.name);
      formData.append('docTypeId', this.docTypeId);
      this.uploadQuery(formData);
      // });
      // return formData;
    },
  },
};
</script>
