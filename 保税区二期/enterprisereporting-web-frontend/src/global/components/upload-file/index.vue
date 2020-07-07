<template>
<!-- 使用方法：
  1. id 必传,用于标识附件地址
    isRequest 是否调用上传附件的接口
    isUpdate  是否调用获取附件的接口
    btn       可选, 当所传值包含[add, down, remove]时,显示添加附件选项,反之，隐藏
    @update-success  当发送上传附件请求后，请求成功的回调
    @update-recover  当发送上传附件请求后，无论请求成功与否都会触发的回调
      触发的父组件方法中必然包含该代码：
        this.isRequset = false;
        this.isUpdate = false;
      示例：
        父组件 <upload-file @update-recover="updateRecover">
          methods: {
            updateRecover() {
              this.isRequset = false;
              this.isUpdate = false;
            }
          }
-->

  <div class="mod-upload-file">
    <!--删除 :http-request="onSendUpload"
        删除 action=""
        删除 :before-upload="beforeUpload"
    -->
    <el-upload
      ref="addFile"
      action=""
      multiple
      :auto-upload="false"
      :file-list="fileList"
      :on-remove="onRemove"
      :on-change="onChange"
      :show-file-list="false">
      <el-button v-show="btn.includes('add')" type="text" class="pad-l-0" @click="onClickUpload">添加附件</el-button>
    </el-upload>
    <!-- 文件列表展示区 -->
    <el-row :gutter="5" style="margin-top: -5px">
      <el-col class="mar-t-xs" v-for="(item, index) in fileList" :key="index" :span="24 / col">
        <div :class="{ 'file-item': 1, 'fn-flex': 1,
          'border-danger': removeIndex === index,
          'no-updata': item.status === 'ready',
        }">
          <div class="item-type">
            <svg class="icon" aria-hidden="true">
              <use v-if="item.status !== 'ready'" :xlink:href="`#${getIcon(item[props.name])}`"></use>
              <use v-else :xlink:href="`#${getIcon(item.name)}`"></use>
              <!-- <use :xlink:href="`#${item.fileType.substr(1)}`"></use> -->
            </svg>
          </div>
          <div class="item-name flex-1">
            <div v-if="item.status !== 'ready'" :title="item[props.name]">{{ item[props.name] }}</div>
            <div v-else :title="item.name">{{ item.name }}</div>
          </div>
          <div class="item-option">
            <div class="btn-down" :title="item.status === 'ready' ? '需上传后才能下载' : '下载'"
               v-show="btn.includes('down')" @click="onClickDown(item)">
              <i class="el-icon-download"></i>
            </div>
            <div
              v-show="btn.includes('remove')"
              class="btn-close"
              title="删除"
              @click="onClickRemove(item, index)"
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
    // 上传接口地址
    // url: {
    //   type: String,
    //   required: true,
    // },
    docTypeId: {
      type: String,
      default: '',
    },
    // 文件类型限制
    typeLimilt: {
      type: Array,
      default: () => ([]),
    },
    sizeLimilt: Number,
    sizesLimilt: Number,
    id: {
      required: true,
      validator(value) {
        return ['undefined', 'string', null].indexOf((typeof value)) !== -1;
      },
    },
    // 是否调用获取上传附件的接口, 必须
    isRequest: {
      type: Boolean,
      required: true,
    },
    // 是否调用上传请求, 必须
    isUpdate: {
      type: Boolean,
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
        name: 'docName', // 文件名
        size: 'docSize', // 文件大小
        link: 'path', // 文件下载链接
      }),
    },
  },
  data() {
    return {
      url: 'res/document/upload',
      removeIndex: -1,
      fileList: [],             // 附件列表
      // tempList: [],             // 待上传的附件
      formatData: {},           // 上传数据转化对象
    };
  },
  computed: {
    // nums() {
    //   return this.tempList.length;
    // },
    // // 文件大小数组
    // filesSize() {
    //   return this.tempList.map(val => val.size / 1024 / 1024);
    // },
    // // 单个上传文件 true: 小于10MB, false: 文件大小超出
    // isFileSize() {
    //   return this.filesSize.every(size => size < 10);
    // },
    // // 多个上传文件 true: 小于100MB, false: 总大小超出
    // isFilesSize() {
    //   return this.filesSize.reduce((val, newVal) => val + newVal, 0) < 100;
    // },
  },
  // created() {
  //   vm.$watch(isRequest, callback, { immediate: true });
  // },
  watch: {
    // 目的是判断是否需要调用获取上传附件的接口
    isRequest: {
      handler(val) { if (val) this.getItemList(); },
      immediate: true,
    },
    // 目的是判断是否需要调用上传附件的接口
    isUpdate(val) { if (val) this.onSendUpload(); },
  },
  methods: {
    getIcon: getFileIcon,
    // 父组价调用该方法 -- 上传附件
    onSendUpload() {
      const tempList = this.fileList.filter(item => item.status === 'ready');
      if (tempList.length <= 0) {
        this.$emit('update-success', true);
        this.$emit('update-recover');
        return false;
      }
      // 先将需要上传的文件转化为formData格式,然后一一请求
      return this.uploadQuery(this.beforeUpload(tempList));
    },
    // 点击下载
    onClickDown(row) {
      // try {
      //   const elemIF = document.createElement('iframe');
      //   elemIF.src = `res/document/download/${row.id}`;
      //   elemIF.style.display = 'none';
      //   document.body.appendChild(elemIF);
      // } catch (e) {
      //   this.$message.error('下载异常！');
      // }
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
    // 移除附件
    onClickRemove(row, index) {
      if (row.status === 'ready') {
        this.fileList.splice(index, 1);
        return;
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('res/document', { data: [row.id] })
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
    // 上传前转化成 formData 对象
    beforeUpload(val) {
      const formData = new FormData();
      val.forEach((item) => {
        formData.append('file', item.raw, item.raw.name);
        formData.append('docTypeId', this.docTypeId);
      });
      return formData;
    },
    // 上传方法
    uploadQuery(formatData) {
      this.$http.post(`res/document/upload/?objectId=${this.id}`, formatData).then((response) => {
        if (response.status === 200) {
          this.$message.success({
            message: '上传成功',
            duration: 1500,
            showClose: true,
          });
          this.getItemList();
          this.$emit('update-success', true);
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
        this.$emit('update-recover');
      });
    },
    // 文件列表移除文件时的钩子
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 文件状态改变时的钩子,添加文件、上传成功、和上传失败
    onChange(file, fileList) {
      // 获取文件大小
      const getSize = item => (item.docSize ? (item.docSize / 1024 / 1024) : (item.size / 1024 / 1024));
      // 获取文件后缀名
      const getSuffix = (item) => {
        const fileName = item.docName || item.name;
        return fileName.substring(fileName.lastIndexOf('.') + 1);
      };

      // 检测文件后缀
      if (this.typeLimilt.length) {
        fileList = fileList.filter((item) => {
          const isPass = this.typeLimilt.includes(getSuffix(item));
          if (!isPass) { this.$message.warning('文件格式错误'); }
          return isPass;
        });
      }
      // 检测文件大小
      if (this.sizeLimilt) {
        fileList = fileList.filter((item) => {
          const isPass = this.sizeLimilt >= getSize(item);
          if (!isPass) { this.$message.warning('文件大小超出限制'); }
          return isPass;
        });
      }
      // 检测文件总大小（多个文件）
      if (this.sizesLimilt) {
        const filesSize = fileList.map(v => getSize(v)).reduce((val, newVal) => val + newVal, 0);
        if (filesSize > this.sizesLimilt) { this.$message.warning('文件总大小超出限制'); }
      }
      this.fileList = fileList;
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
      this.$http.get('res/document', {
        params: {
          objectId: this.id,
          docTypeId: this.docTypeId,
        },
      }).then((response) => {
        if (response.status === 200) {
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
