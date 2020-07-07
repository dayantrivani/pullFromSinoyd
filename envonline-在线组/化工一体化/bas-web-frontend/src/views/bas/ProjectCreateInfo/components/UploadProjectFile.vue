<template>
<!-- 使用方法：
  1. id 必传,用于标识附件地址
    isRequest 是否调用获取附件的接口
    isUpdate  是否调用上传附件的接口
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

  <div class="mod-upload-file" v-loading="loading">
    <el-upload
      ref="addFile"
      action=""
      v-show="!(fileList.length === 1)"
      :multiple="false"
      :auto-upload="false"
      :file-list="fileList"
      :on-remove="onRemove"
      :on-change="onChange"
      :disabled="disabled"
      :show-file-list="false">
      <el-button
        v-show="btn.includes('add')"
        type="text"
        class="pad-l-0"
        :disabled="disabled"
      >添加附件</el-button>
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
              v-show="btn.includes('remove') && !disabled"
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
  name: 'UploadProjectFile',
  props: {
    id: {
      required: true,
      validator(value) {
        return ['undefined', 'string', null].indexOf((typeof value)) !== -1;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: -1,
    },
    docTypeId: {
      type: [String, Number],
      default: '',
    },
    // 多列布局的列数
    col: {
      type: Number,
      default: 1,
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
      loading: false,
      removeIndex: -1,
      fileList: [],             // 附件列表
    };
  },
  watch: {
    // 目的是判断是否需要调用上传附件的接口
    docTypeId(id) { if (id) this.getList(); },
  },
  methods: {
    getIcon: getFileIcon,
    reset() {
      this.fileList = [];
    },
    // 获取附件列表
    getList() {
      this.loading = true;
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
    // 上传附件
    sendUpload(id) {
      const tempList = this.fileList.filter(item => item.status === 'ready');
      if (tempList.length <= 0) {
        this.$emit('update-success', true);
        this.$emit('update-recover');
        return false;
      }
      const formatData = this.switchFormData(tempList);
      return new Promise((resolve, reject) => {
        this.$http.post(`res/document/upload/?objectId=${this.id || id}`, formatData).then((response) => {
          if (response.status === 200) {
            this.$message.success({
              message: '上传成功',
              duration: 1500,
              showClose: true,
            });
            resolve();
            this.getList();
            this.$emit('update-success', true);
          } else {
            reject();
            this.$message.warning({
              message: response.data.message,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.$emit('update-recover');
        });
      });
    },
    // 上传前转化成 formData 对象
    switchFormData(val) {
      const formData = new FormData();
      val.forEach((item) => {
        formData.append('file', item.raw, item.raw.name);
        formData.append('docTypeId', this.docTypeId);
      });
      return formData;
    },
    // 点击下载附件
    onClickDown(row) {
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
        this.$emit('change', this.fileList, this.index);
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
          this.fileList = [];
          this.getList();
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
    // 文件列表移除文件时的钩子
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 文件状态改变时的钩子,添加文件、上传成功、和上传失败
    onChange(file, fileList) {
      this.fileList = fileList;
      this.$emit('change', fileList, this.index);
    },
  },
};
</script>
