<template>
  <dialog-modal ref="dialog"
                size="middle"
                :title="title"
                min-width="754px"
                @close="closeDialog">
    <el-table border
              height="400px"
              class="mar-b-sm"
              :data="itemList">
      <el-table-column align="center"
                       label="操作"
                       width="120">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-cloud-download-alt"
                     @click="onDownLoad(scope.row,true)">下载</el-button>
          <el-button type="primary"
                     icon="fas fa-eye"
                     @click="onClickSee(scope.row)">预览</el-button>
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
    <dialog-modal :title="imgTitle"
                  ref="imgDialog"
                  size="mini"
                  append-to-body>
      <img width="100%"
           :src="imageUrl"
           alt="">
    </dialog-modal>
  </dialog-modal>
</template>

<script>
export default {
  name: 'upload-list',
  data() {
    return {
      queryParams: {
        projectId: '',
        imageId: '',
        type: [],
      },
      title: '',
      url: 'ldar/projectFiles',
      isAuto: false,
      loadingSee: false,
      imageUrl: '',
      imgTitle: '',
      itemList: [],
    };
  },
  methods: {
    openDialog(row, type) {
      if (type.length >= 4) {
        this.title = '附件下载';
        this.queryParams.projectId = row.id;
      } else {
        this.title = '密封点图档';
        this.queryParams.projectId = row.projectId;
        this.queryParams.imageId = row.imageId;
      }
      this.queryParams.type = type;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    onDownLoad(row, flag) { // 下载附件
      this.$http.get(`ldar/projectFiles/download?id=${row.id}`, {
        responseType: 'blob',
      }).then((response) => {
        const docName = row.fileName;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(response.data);
        this.imageUrl = link.href;
        link.download = docName;
        if (flag) {
          link.click();
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
      this.imageUrl = '';
      this.$refs.dialog.closeDialog();
    },
    // 获取附件列表
    getItemList() {
      this.$http.get(this.url, {
        params: {
          ...this.queryParams,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          const first = this.itemList[0];
          this.onDownLoad(first, false);
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    onClickSee() {
      this.$refs.imgDialog.openDialog();
    },
  },
};
</script>
