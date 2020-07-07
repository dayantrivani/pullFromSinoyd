<template>
  <!-- 逾期记录 -->
  <div style="height: 100%">
    <el-table
      border
      height="calc(100% - 32px)"
      highlight-current-row
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="部门名称" prop="deptName" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="补充反馈时间" prop="feedbackTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="补充反馈内容" prop="feedbackContent" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="附件" min-width="70" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-receiving"
            @click="onClickEdit(scope.row)"
          >附件</el-button>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <dialog-modal
      type="title"
      ref="fileDialog"
      title="附件列表"
      contentClass="pad-x-sm pad-b-sm"
      append-to-body
      @close="closeFileDialog"
    >
      <el-table
        border
        highlight-current-row
        height="480px"
        v-loading="fileLoading || downloading"
        :data="fileList"
      >
        <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
        <el-table-column align="center" label="操作" width="70">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="fas fa-download"
              @click="onClickDown(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="文件名称" prop="docName" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="上传时间" prop="uploadTime" min-width="160" show-overflow-tooltip></el-table-column>
      </el-table>
    </dialog-modal>
  </div>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'supplementaryInfo',
  mixins: [                   // 混合
    queryList,
  ],
  props: {
    petitionInfoId: {
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      isAuto: false,
      url: 'petition/supplementaryInfo',
      queryForm: {
        workNo: '', // 服务工单编号
        petitionInfoId: '', // 信访主键id
        sort: 'serialNo+',
      },
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
      itemList: [],
      fileLoading: false,
      fileList: [], // 附件列表
      downloading: false,
    };
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    onClickEdit(row) {
      this.getFileList(row);
      this.$refs.fileDialog.openDialog();
    },
    closeFileDialog() {
      this.$refs.fileDialog.closeDialog();
    },
    /** 请求层 */
    getFileList(item) {               // 获取附件列表
      this.fileLoading = true;
      this.$http.get('res/document', {
        params: {
          objectId: item.id,
          docTypeId: item.docTypeId || '',
          rows: 1000000,
          page: 1,
          sort: 'uploadTime-',
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
        this.fileLoading = false;
      });
    },
    onClickDown(row) {            // 点击下载
      this.downloading = true;
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
      }).finally(() => {
        this.downloading = false;
      });
    },
  },
};
</script>

<style>

</style>
