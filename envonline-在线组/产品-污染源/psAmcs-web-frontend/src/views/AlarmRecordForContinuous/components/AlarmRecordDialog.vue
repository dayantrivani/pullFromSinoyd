<template>
  <dialog-modal type="title"
                ref="dialog"
                size="middle"
                title="处理记录"
                contentClass="pad-x-sm pad-b-sm"
                @close="closeDialog">
    <el-table border
              highlight-current-row
              height="480px"
              v-loading="loading"
              :data="itemList"
              :row-class-name="rowClassName"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                       label="No."
                       width="50"
                       type="index"
                       :index="index"></el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="70">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-receiving"
                     @click="onClickEdit(scope.row)">附件</el-button>
        </template>
      </el-table-column>
      <el-table-column label="处置人员"
                       prop="dealUserName"
                       min-width="160"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="处置时间"
                       prop="dealDate"
                       min-width="160"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="处置状态"
                       prop="dealType"
                       min-width="180"
                       show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :class="`text-${row.dealType ? 'success' : 'danger'}`">
            {{row.dealType ? '已处理' : '待处理'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="超标原因"
                       prop="exceedReason"
                       min-width="90"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="处置说明"
                       prop="dealContext"
                       min-width="80"
                       show-overflow-tooltip></el-table-column>
    </el-table>
    <dialog-modal type="title"
                  ref="fileDialog"
                  title="附件列表"
                  contentClass="pad-x-sm pad-b-sm"
                  append-to-body
                  @close="closeFileDialog">
      <el-table border
                highlight-current-row
                height="480px"
                v-loading="fileLoading || downloading"
                :data="fileList">
        <el-table-column align="center"
                         label="No."
                         width="50"
                         type="index"
                         :index="index"></el-table-column>
        <el-table-column align="center"
                         label="操作"
                         width="70">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="fas fa-download"
                       @click="onClickDown(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="文件名称"
                         prop="docName"
                         min-width="80"
                         show-overflow-tooltip></el-table-column>
      </el-table>
    </dialog-modal>
  </dialog-modal>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [queryList],
  data() {
    return {
      url: 'amcs/alarmRecordForContinuousDeal',  // 必须, 接口地址
      isAuto: false,
      queryForm: {                  // 检索表单项
        alarmId: '',
      },
      fileLoading: false,
      fileList: [], // 附件列表
      downloading: false,
    };
  },
  methods: {
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.queryForm.alarmId = row.id;
      this.getItemList();
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
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
          sort: 'docName+',
          page: 1,
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
    getItemList() {              // 获取列表内容
      this.loading = true;
      this.$http.get(this.url, {
        params: {
          page: 1,
          rows: 1000000,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
