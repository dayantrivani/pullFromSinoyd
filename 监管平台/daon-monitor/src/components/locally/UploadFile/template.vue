<template>
  <div class="mod-upload-file">
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
    <!-- 文件列表 -->
    <el-row class="mod-upload-file__content" :gutter="5">
      <el-col v-for="(item, index) in fileList" :key="index" :span="24 / (itemCol - 0)">
        <!-- 文件项 -->
        <div class="file-item">
          <div class="file-item__label">
            <div class="file-item-type">
              <icon :name="_getIconClass(item.name)" />
            </div>
            <div class="file-item-info">
              <span :title="item.name">{{ item.name }}</span>
              <span>{{ file.docSize || file.size }}</span>
            </div>
          </div>
          <div class="file-item__operate">
            <button class="file-item__operatebtn" @click="onClickDown(item, index)">
              <i class="el-icon-download"></i>
            </button>
            <button class="file-item__operatebtn" @click="onClickRemove(item, index)">
              <i class="el-icon-close"></i>
            </button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import fileIcons from './icons';
// import { downloadFile } from '@/libs/util';

export default {
  name: 'UploadFile',
  props: {
    // 必选参数: 关联的唯一标识
    key: {
      type: String,
      required: true,
    },
    // 可选参数: 上传的地址
    action: {
      type: String,
      default: 'res/document/upload',
    },
    // 可选参数: 是否只读（保留下载）
    readonly: Boolean,
    // 可选参数: 是否禁用
    disabled: Boolean,
    // 可选参数: 排版列数
    itemCol: {
      type: [String, Number],
      default: 3,
    },
    // 配置项
    props: {
      type: Object,
      default: () => ({
        name: 'docName', // 文件名
        size: 'docSize', // 文件大小
        path: 'path',
      }),
    },
  },
  data() {
    return {
      fileList: [], // 已上传文件列表
      tempList: [], // 未上传文件列表
    };
  },
  methods: {
    // 获取文件类型图标名
    _getIconClass(/* fileName */) {
      // const suffix =  this.$tools.getFileSuffix(fileName, true);
      // Object.keys(fileIcons).forEach((iconName) => {
      //   if (fileIcons[iconName].includes(suffix)) {
      //     return iconName;
      //   }
      // });
      return 'icon-file-unknown';
    },
    // 上传附件
    upload() {},
    // 获取已上传文件列表
    getFileList() {},
  },
};
</script>
