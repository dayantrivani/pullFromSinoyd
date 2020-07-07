<template>
  <div class="mod-upload-file">
    <el-upload
      ref="addFile"
      multiple
      action=""
      :file-list="fileList"
      :http-request="onSendUpload"
      :on-remove="onRemove"
      :on-change="onChange"
      :auto-upload="false"
      :show-file-list="false">
      <el-button v-show="btn.includes('add')" type="text" class="pad-l-0" @click="onClickUpload">添加附件</el-button>
    </el-upload>
    <!-- 文件列表 -->
    <el-row :gutter="5" style="margin-top: -5px">
      <el-col class="mar-t-xs" v-for="(item, index) in fileList" :key="index" :span="24 / col">
        <div :class="{ 'file-item': 1, 'fn-flex': 1, 'border-danger': removeIndex === index}">
          <div class="item-type">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="`#${getIcon(item[props.name] || item.name)}`"></use>
            </svg>
          </div>
          <div class="item-name flex-1">
            <div :title="item[props.name]">{{ item[props.name] || item.name }}</div>
          </div>
          <div class="item-option">
            <div
              v-show="btn.includes('down') && item.status === 'success'"
              class="btn-down" title="下载"
              @click="onClickDown(item)"
            ><i class="el-icon-download"></i>
            </div>
            <div
              v-show="btn.includes('remove')"
              class="btn-close"
              title="删除"
              @click="onClickRemove(item)"
              @mouseenter="removeIndex = index"
              @mouseleave="removeIndex = -1">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '~/fonts/iconfont.js';
import { analyzeResp, getFileIcon } from '@/global/libs/util';

export default {
  name: 'UploadFile',
  props: {
    params: {
      type: Object,
      default: () => {},
    },
    // 上传接口地址
    url: {
      type: String,
      required: true,
    },
    // 多列布局的列数
    col: {
      type: [String, Number],
      default: 3,
    },
    // 按钮 add down remove
    btn: {
      type: String,
      default: 'add down remove',
    },
    props: {
      type: Object,
      default: () => ({
        name: 'name', // 文件名
        size: 'size', // 文件大小
        link: 'url', // 文件下载链接
      }),
    },
  },
  data() {
    return {
      // url: 'storage/files/list',
      isEdit: false,
      removeIndex: -1,
      fileList: [],             // 附件列表
      tempList: [],             // 待上传附件列表
      formatData: {},           // 上传数据转化对象
    };
  },
  computed: {
    nums() {
      return this.tempList.length;
    },
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
    'params.objectId': {
      handler(val) {
        // TODO: 如果后端id格式改变，会导致fileList不清空
        if (!val.includes('-')) {
          this.fileList = [];
        } else {
          this.$nextTick(() => {
            this.getItemList();
          });
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    getIcon: getFileIcon,
    // 点击下载
    onClickDown(file) {
      if (file.status === 'ready') return;
      this.$http.get(`${this.url}/download?id=${file.id}`, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const fileName = file.docName;
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
    onClickRemove(file) {
      if (file.status === 'success') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => (
          this.$http.delete(this.url, { data: [file.id] })
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
      } else {
        this.fileList = this.fileList.filter(files => files.uid !== file.uid);
      }
    },
    // 上传前转化成 formData 对象
    beforeUpload() {
      this.fileList = this.fileList.filter(file => file.status === 'ready');
      if (this.fileList && this.fileList.length) {
        this.formatData = new FormData();  // 创建form对象
        this.fileList.forEach((file) => {
          this.formatData.append('file', file.raw, file.name);  // file对象是 beforeUpload参数
        });
      }
    },
    // 上传方法
    onSendUpload() {
      this.beforeUpload();
      this.$http.post(`${this.url}/upload`, this.formatData, { params: this.params }).then((response) => {
        if (response.status === 200) {
          this.$message.success({
            message: '上传成功',
            duration: 1500,
            showClose: true,
          });
          // this.imageUrl = `http://192.168.6.181:9002${response.data}`;
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.message,
            duration: 1500,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.avatarLoading = false;
      });
    },
    // 文件列表移除文件时的钩子
    onRemove(/* file, fileList */) {
      // this.tempList = fileList;
    },
    // 文件改变时
    onChange(file, fileList) {
      this.fileList = [...fileList];
    },
    // 单击触发上传请求
    onClickUpload() {
      // this.$refs.addFile.submit();
      // console.log(this.tempList);
      // if (!this.tempList.length) {
      //   this.$message.info('请选择需要上传的附件');
      // } else if (!this.isFileSize) {
      //   this.$message.info('单个文件大小不能超过10MB');
      // } else if (!this.isFilesSize) {
      //   this.$message.info('上传文件总大小不能超过100MB');
      // } else {
      //   this.count = 0;
      //   this.disabled = true;
      //   this.$refs.addFile.submit();
      // }
    },
    // 获取附件列表
    getItemList() {
      this.$http.get(this.url, { params: this.params }).then((response) => {
        if (response.data.success) {
          this.fileList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
  },
};
</script>
