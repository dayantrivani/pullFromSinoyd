<template>
  <dialog-modal ref="dialog"
                size="middle"
                title="附件"
                min-width="754px"
                @close="closeDialog">
    <el-table border
              height="400px"
              class="mar-b-sm"
              :data="itemList">
      <el-table-column align="center"
                       type="index"
                       width="50"
                       label="No."></el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="67">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-cloud-download-alt"
                     @click="onDownLoad(scope.row)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column property="fileName"
                       label="附件名称"
                       min-width="160"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="typeValue"
                       label="类型"
                       width="160"></el-table-column>
      <el-table-column property="fileType"
                       label="文件类型"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="fileSize"
                       label="文件大小"
                       min-width="120"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{ getSizeUnit(scope.row.fileSize) }}</template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager"
                  @query="getItemList" />
  </dialog-modal>
</template>

<script>
import { queryList } from '@/libs/mixins';

export default {
  name: 'upload-list',
  mixins: [
    queryList,
  ],
  data() {
    return {
      queryForm: {
        projectId: '',
        type: [],
        sort: 'fileName',
      },
      url: 'ldar/projectFiles',
      isAuto: false,
    };
  },
  methods: {
    openDialog(row, type) {
      this.queryForm.projectId = row.id;
      this.queryForm.type = type;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    onDownLoad(row) { // 下载附件
      this.$http.get(`ldar/projectFiles/download?id=${row.id}`, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const docName = row.fileName;
          const blob = new Blob([response.data], { type: 'application/x-xls' });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, docName);
          } else {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = docName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }
      });
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
    closeDialog() {
      this.itemList = [];
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
