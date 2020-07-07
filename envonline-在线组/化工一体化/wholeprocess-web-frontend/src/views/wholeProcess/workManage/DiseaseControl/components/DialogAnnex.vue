<template>
  <dialog-modal ref="dialog"
                title="附件信息"
                maxScrollbar
                size="middle"
                @close="closeDialog">
    <el-card type="title">
      <el-row class="fill-h">
        <el-col style="width:auto" class="fill-auto" :span="24">
          <el-upload
            ref="upload"
            action
            multiple
            class="mar-l-xs"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="onUploadFile">
            <el-button icon="fas fa-cloud-upload-alt" type="primary" >上传附件</el-button>
          </el-upload>
        </el-col>
        <el-button
          type="danger"
          class="mar-l-xs"
          icon="fas fa-trash-alt"
          :disabled="!selectedIds.length"
          @click="onDeleteItem()">删 除附件</el-button>
      </el-row>
       <el-table border
              highlight-current-row
              class="mar-y-xs"
              v-loading="loading"
              height="50vh"
              :data="itemList"
              @selection-change="onChangeSelected">
        <el-table-column align="center"
                        type="selection"
                        width="40"
                        :reserve-selection="true"></el-table-column>
        <el-table-column align="center"
                        label="No."
                        width="50"
                        type="index"
                        :index="index"></el-table-column>
        <el-table-column align="center"
                        label="操作"
                        width="100"
                        show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary"
                      icon="fas fa-cloud-download-alt"
                      @click="onClickDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="docName"
                        label="文档名称"
                        show-overflow-tooltip></el-table-column>
        <el-table-column prop="fileType"
                        label="文档类型"
                        show-overflow-tooltip></el-table-column>
        <el-table-column prop="authorName"
                        label="上传人"
                        show-overflow-tooltip></el-table-column>
        <el-table-column prop="uploadTime"
                        label="上传日期"
                        show-overflow-tooltip></el-table-column>
      </el-table>
    </el-card>
  </dialog-modal>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'DialogAnnex',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
  },
  data() {
    return {
      isAuto: false,
      url: 'res/document',
      loading: false,
      itemList: [],
      // 附件相关
      objectId: '',
      formatData: {},
      fileList: [],   // 附件列表
    };
  },
  methods: {
    // 打开对话框
    openDialog(diseaseId) {
      this.objectId = diseaseId;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.objectId = '';
      this.fileList = [];
      this.$refs.dialog.closeDialog();
    },
    getItemList() {
      this.$http.get('res/document', {
        params: {
          objectId: this.objectId,
        },
      }).then((response) => {
        if (response.status === 200) {
          this.itemList = response.data.data;
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
    // 上传前转化成 formData 对象
    beforeUpload(file) {
      this.formatData = new FormData(); // 创建form对象
      this.formatData.append('file', file, file.name);
      return this.formatData;
    },
    // 上传附件
    onUploadFile() {
      this.$http.post(`res/document/upload/?objectId=${this.objectId}`, this.formatData).then(
        (response) => {
          if (response.status === 200) {
            this.$message.success({
              message: '上传成功',
              duration: 1500,
              showClose: true,
            });
            this.getItemList();
          } else {
            this.$message.warning({
              message: response.data.message,
              duration: 1500,
              showClose: true,
            });
          }
        }, ({ response }) => {
          this.$tools.resp(response);
        }
      );
    },
    // 下载附件
    onClickDownload(row) {
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
  },
};
</script>
