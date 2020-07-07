<template>
  <!-- 上传附件列表 -->
  <dialog-modal
    ref="dialog"
    size="small"
    scrollbar
    :view="true"
    title="上传附件"
    @close="closeDialog">
    <div class="mar-b-xs" v-if="isShow">
      <el-button type="primary" icon="fas fa-cloud-upload-alt" @click="onClickUpload">上 传</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onClickDele">删 除
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :height="isShow ? 'calc(100% - 64px)' : 'calc(100% - 31px)'"
      :data="itemList"
      border
      highlight-current-row
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37" v-if="isShow"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-pencil-alt"
            @click="onClickDown(scope.row)"
          >下载</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="docName" min-width="160" show-overflow-tooltip label="名称"></el-table-column>
      <el-table-column prop="uploadTime" min-width="160" show-overflow-tooltip label="创建时间"></el-table-column>
      <el-table-column prop="authorName" min-width="120" show-overflow-tooltip label="作者"></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>

    <upload ref="upload" :id="queryForm.objectId" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import Upload from './Upload.vue';
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  components: {
    Upload,
  },
  props: {
    isShow: {
      type: Boolean,
    },
  },
  data() {
    return {
      url: 'res/document',
      isAuto: false,
      loading: false,       // 表格数据加载状态
      itemList: [],         // 列表数据集合
      queryForm: {          // 查询条件
        objectId: '',
        sort: 'uploadTime-',
      },
    };
  },
  computed: {
  },
  created() {
  },
  methods: {
    openDialog(row) {                // 打开上传附件弹窗
      this.queryForm.objectId = row.id || '';
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    onSaveSelected(selection) {      // 表格选中
      this.selectedIds = selection.map(val => val.id);
    },
    onClickUpload() {                // 单击上传按钮
      this.$refs.upload.openDialog();
    },
    closeDialog() {                  // 关闭弹框
      this.queryList = {
        objectId: '',
        sort: 'uploadTime-',
      };
      this.itemList = [];
      this.loading = false;
    },
    /** 请求层 */
    onClickDele() {                  // 删除
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
    onClickDown(row) {               // 下载附件
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
  },
};
</script>

<style scoped>
  /* .box-dialog {
    width: calc(100% - 5px);
    height: 100%;
    padding-right: 5px;
    overflow-y: auto;
  }
  hr {
    margin: 5px 0;
  } */
</style>
