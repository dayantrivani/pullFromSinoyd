<template>
  <!-- 上传附件列表 -->
  <el-card fill>
    <div slot="header" class="mar-b-xs">
      <!-- <el-button type="primary" icon="fas fa-redo" @click="onClickRefresh">刷 新</el-button> -->
      <el-button
        type="primary"
        icon="fas fa-cloud-upload-alt"
        :disabled="!uploadInfo.id"
        @click="onClickUpload">上 传
      </el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length && !uploadInfo.id"
        @click="onClickDele">删 除
      </el-button>
      <!-- <el-button type="primary" icon="fas fa-file-signature" @click="onClickRename">重命名</el-button> -->
    </div>
    <el-table
      v-loading="loading"
      height="calc(100% - 36px)"
      :data="fileList"
      border
      highlight-current-row
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickDown(scope.row)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="docName" min-width="160" show-overflow-tooltip label="名称"></el-table-column>
      <el-table-column prop="uploadTime" min-width="160" show-overflow-tooltip label="创建时间"></el-table-column>
      <el-table-column prop="authorName" min-width="120" show-overflow-tooltip label="作者"></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>

    <upload ref="upload" :id="uploadInfo.id || ''" @getItemList="getItemList"/>
  </el-card>
</template>

<script>
// import { mapState } from 'vuex';
import Upload from './Upload.vue';
import { queryList } from '@/global/libs/mixins';

export default {
  components: {
    Upload,
  },
  props: {
    uploadInfo: {
      type: Object,
      required: true,
    },
  },
  mixins: [queryList],
  data() {
    return {
      isAuto: false,   // 关闭混合的默认请求
      loading: false,  // 表格数据加载状态
      // selectedIds: [], // 列表选中项集合
      fileList: [],    // 列表数据集合
    };
  },
  watch: {
    uploadInfo: {
      handler(val) {
        if (val.id) {
          this.getItemList();
        }
      },
      deeep: true,
      immediate: true,
    },
  },
  methods: {
    onClickDele() {         // 删除
      if (this.selectedIds.length === 0) {
        this.$message('请选择要删除的数据');
        return;
      }
      this.$confirm('是否删除选中的数据？', '请确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('res/document', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.getItemList();
        }
        this.$message({
          showClose: true,
          message: response.data.success ? '删除成功' : response.data.msg,
          type: response.data.success ? 'success' : 'error',
          duration: 3000,
        });
      });
    },
    onClickDown(row) {      // 下载附件
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
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
    getItemList() {         // 获取附件列表
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('res/document', {
        params: {
          page,
          rows,
          objectId: this.uploadInfo.id,
          // docTypeId: this.pageId,
          sort: 'uploadTime-',
        },
      }).then((response) => {
        if (response.data.success) {
          this.fileList = response.data.data;
          this.pager.total = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showColse: true,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    onClickUpload() {       // 单击上传按钮
      this.$refs.upload.openDialog();
    },
  },
};
</script>

<style scoped>
  .box-dialog {
    width: calc(100% - 5px);
    height: 100%;
    padding-right: 5px;
    overflow-y: auto;
  }
  hr {
    margin: 5px 0;
  }
</style>
