<template>
  <dialog-modal
    ref="dialog"
    size="middle"
    title="企业附件"
    min-width="754px"
    @close="closeDialog">
    <div class="mar-b-xs">
      <el-upload
        style="display: inline-block"
        action=""
        :show-file-list="false"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :http-request="onUpload">
        <el-button icon="fas fa-cloud-upload-alt" type="primary" :loading="loadStatus">
          {{ loadStatus ? '上传中' : '上 传' }}
        </el-button>
      </el-upload>
      <el-button
        class="mar-l-sm"
        icon="fas fa-trash-alt"
        type="danger"
        :disabled="!selectedIds.length"
        @click="onClickRemove()">删 除</el-button>
    </div>
    <el-table
      border
      v-loading="loading"
      height="397px"
      class="mar-b-sm"
      :data="itemList"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="40"></el-table-column>
      <el-table-column label="No." type="index" align="center" width="50"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-cloud-download-alt"
            @click="onClickDown(scope.row)">下 载
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="docName" label="文件名" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column property="docSize" label="文件大小" width="100">
        <template slot-scope="scope">
          {{ getSizeUnit(scope.row.docSize) }}
        </template>
      </el-table-column>
      <el-table-column property="uploadTime" label="上传时间" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="authorName" label="上传人" min-width="120" show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
// import { analyzeResp } from '@/libs/util';

export default {
  name: 'upload-list',
  mixins: [queryList, deleteItem],
  data() {
    return {
      id: '',
      url: 'res/document',
      isAuto: false,
      loadStatus: false,
      fileList: [],
      itemList: [],
    };
  },
  methods: {
    openDialog(id) {
      this.id = id;
      this.itemList = [];
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 保存选中项 id
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.rowGuid);
    },
    getSizeUnit(fileSize) {
      if (fileSize < 1024) {
        return `${fileSize}B`;
      } if (fileSize < (1024 * 1024)) {
        let temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return `${temp}KB`;
      } if (fileSize < (1024 * 1024 * 1024)) {
        let temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return `${temp}MB`;
      }
      let temp = fileSize / (1024 * 1024 * 1024);
      temp = temp.toFixed(2);
      return `${temp}GB`;
    },
    // 上传前
    beforeUpload(file) {
      // 文件大小 MB
      const fileSizeMB = file.size / 1024 / 1024;

      // 单文件上传文件小于10MB
      if (fileSizeMB > 10) {
        this.$message.error('上传文件大小不能超过 10MB');
        return false;
      }

      return true;
    },
    // 获取附件列表
    getItemList() {
      this.loading = true;
      this.$http.get(this.url, {
        params: { objectId: this.id },
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
      }).finally(() => {
        this.loading = false;
      });
    },
    // 附件上传
    onUpload({ file }) {
      const formatData = new FormData();
      formatData.append('file', file);
      this.loadStatus = true;
      return new Promise(() => {
        this.$http.post(`${this.url}/upload/?objectId=${this.id}`, formatData).then((response) => {
          if (response.status === 200) {
            this.$message.success({
              message: '上传成功',
              duration: 1500,
              showClose: true,
            });
            this.getItemList();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loadStatus = false;
        });
      });
    },
    // 点击下载
    onClickDown(row) {
      if (row.status === 'ready') return;
      this.$http.get(`${this.url}/download?id=${row.id}`, {
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
    // 删除
    onClickRemove() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(this.url, { data: this.selectedIds })
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
  },
};
</script>
