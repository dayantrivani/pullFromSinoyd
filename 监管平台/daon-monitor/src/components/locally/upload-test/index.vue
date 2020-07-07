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
    <a-upload
        ref="addFile"
        :beforeUpload="beforeUpload"
        :customRequest="onSendUpload"
        :showUploadList="false">
        <a-button  v-show="btn.includes('add')" :disabled="fileList.length >= sizeLimilt">
          <a-icon type="upload" /> 点击上传附件
        </a-button>
      </a-upload>
    <!-- 文件列表展示区 -->
    <a-row :gutter="5" style="margin-top: -5px">
      <a-col class="mar-t-xs" v-for="(item, index) in fileList" :key="index" :span="24 / col">
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
            <div class="btn-down">
              <a-icon type="download" :title="item.status === 'ready' ? '需上传后才能下载' : '下载'"
                v-show="btn.includes('down')" @click="downLoad(item)"></a-icon>
            </div>
            <div class="btn-close">
              <a-icon type="close" v-show="btn.includes('remove')" title="删除" @click="onDeleteFile(item, index)"
                @mouseenter="removeIndex = index"
                @mouseleave="removeIndex = -1"></a-icon>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import '@/../public/iconfont.js';
import { getFileIcon } from '@/libs/util';

export default {
  name: 'UploadFile',
  props: {
    attachList: {
      type: Array,
      default: () => ([]),
    },
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
      default: 4,
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
        link: 'path', // 文件下载链接
      }),
    },
  },
  created() {
    if (this.attachList.length) {
      this.fileList = this.attachList;
      this.attachIds = [this.fileList[0].id];
      this.$emit('onChangeList', this.attachIds);
    }
  },
  watch: {
    attachList: {
      handler(val) {
        if (val.length) {
          this.fileList = val;
          this.attachIds = [this.fileList[0].id];
          this.$emit('onChangeList', this.attachIds);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      url: '',
      removeIndex: -1,
      fileList: [],             // 附件列表
      // tempList: [],             // 待上传的附件
      formatData: {},           // 上传数据转化对象
      file: {},
      attachIds: [],  // 附件id数组
    };
  },
  methods: {
    getIcon: getFileIcon,
    // 附件下载
    downLoad(item) {
      this.$axios.request({
        url: `/api/monitor/attach/${item.id}`,
        method: 'get',
        responseType: 'blob',
      }).then((res) => {
        this.downloadFn(res, item.name);
      });
    },
    /* eslint-disable */
    downloadFn(res, name) {
      if (res.headers.success) {
        // IE 浏览器：a标签的download属性不支持IE，使用微软自带的 msSaveBlob 方法
        // 其他浏览器：创建a标签 ，添加download属性，模拟鼠标点击事件
        const blob = new Blob([res.data], { type: res.headers['content-type'] });
        // const filename = res.headers['content-disposition'].split(';')[1].replace('filename=', '');
        if (window.navigator.msSaveBlob) {   // 兼容ie
          try {
            window.navigator.msSaveBlob(blob, name);
          } catch (e) {
            return e;
          }
        } else {
          const a = document.createElement('a');
          a.style.display = 'none';
          a.download = name;
          a.href = window.URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
        }
      } else {
        this.$message.error('当前文件不存在，请联系管理员');
      }
    },
    // 删除附件
    onDeleteFile(item, index) {
      this.fileList.splice(index, 1);
      this.attachIds.splice(index, 1);
      this.$emit('onChangeList', this.attachIds);
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
        data: this.formatData
      }).then((response) => {
        if (response.data.code === 500 && !response.data.success) {
          this.$message.warning(response.data.msg, 1.5);
        } else if (response.status === 200) {
          this.attachIds.push(response.data[0].id);
          this.$emit('onChangeList', this.attachIds);
          this.$set(this.file, 'id', response.data[0].id);
          this.fileList.push(this.file);
          this.$message.success('上传成功', 1.5);
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
  },
};
</script>
