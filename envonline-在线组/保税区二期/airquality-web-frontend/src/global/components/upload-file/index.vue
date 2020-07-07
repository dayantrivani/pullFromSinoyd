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
      :before-upload="beforeUpload"
      :show-file-list="false">
      <el-button v-show="btn.includes('add')" type="text" class="pad-l-0" @click="onClickUpload">添加附件</el-button>
    </el-upload>
    <!-- 文件列表 -->
    <el-row :gutter="5" style="margin-top: -5px">
      <el-col class="mar-t-xs" v-for="(item, index) in fileList" :key="index" :span="24 / col">
        <div :class="{ 'file-item': 1, 'fn-flex': 1, 'border-danger': removeIndex === index}">
          <div class="item-type">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="`#${getIcon(item[props.name])}`"></use>
            </svg>
          </div>
          <div class="item-name flex-1">
            <div :title="item[props.name]">{{ item[props.name] }}</div>
          </div>
          <div class="item-option">
            <div v-show="btn.includes('down')" class="btn-down" title="下载" @click="onClickDown(item)">
              <i class="el-icon-download"></i>
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
    // 上传接口地址
    // url: {
    //   type: String,
    //   required: true,
    // },
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
      url: 'storage/files/list',
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
  created() {
    this.getItemList();
  },
  methods: {
    getIcon: getFileIcon,
    // 点击下载
    onClickDown(row) {
      try {
        const elemIF = document.createElement('iframe');
        elemIF.src = `../storage/files/download/${row.id}`;
        elemIF.style.display = 'none';
        document.body.appendChild(elemIF);
      } catch (e) {
        this.$message.error('下载异常！');
      }
    },
    onClickRemove(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(`../storage/files/${row.id}`)
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
    beforeUpload(file) {
      this.formatData = new FormData();  // 创建form对象
      this.formatData.append('file', file, file.name);  // file对象是 beforeUpload参数
      return new Promise((resolve) => {
        resolve();
      });
    },
    // 上传方法
    onSendUpload() {
      this.$http.post('../storage/files/upload', this.formatData).then((response) => {
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
    onRemove(file, fileList) {
      this.tempList = fileList;
    },
    // 文件改变时
    onChange(file, fileList) {
      this.tempList = fileList;
    },
    // 单击触发上传请求
    onClickUpload() {
      this.$refs.addFile.submit();
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
      // const { page, rows } = this.pager;
      this.$http.get('../storage/files/list', {
        // params: { page, rows, objectId: this.id },
      }).then((response) => {
        if (response.status === 200) {
          // console.log(response.data);
          this.fileList = response.data;
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
