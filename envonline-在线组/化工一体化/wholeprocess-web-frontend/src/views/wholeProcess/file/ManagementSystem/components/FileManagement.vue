<template>
<!-- 文件管理主页右侧 -->
  <el-card class="title-card">
    <!-- 标题内容 -->
    <template slot="header">
      <span class="text-primary font-bold" style="line-height: 25px;">{{title}}</span>
    </template>

    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm fn-no-wrap">
      <el-form-item label="适用部门：">
        <select-info-table
          v-model="queryForm.deptId"
          :isPsId="false"
          type="dp"
          title="适用部门" />
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="queryForm.status" clearable>
          <el-option label="有效" :value="1"></el-option>
          <el-option label="停用" :value="2"></el-option>
          <el-option label="过期" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input
          v-model="queryForm.key"
          clearable
          placeholder="关键字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-cloud-upload-alt"
        :disabled="addDisabled"
        @click="onClickAdd">上 传</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 107px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="76">
        <template slot-scope="{ row }">
          <el-dropdown>
            <span class="text-primary z-pointer">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="primary" size="mini" icon="fas fa-eye" @click="onClickSee(row)">查 看</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" size="mini" icon="fas fa-pencil-alt" @click="onClickEdit(row)">编 辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" size="mini" icon="fas fa-cloud-download-alt" @click="onClickDown(row)">下载附件</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" size="mini" icon="fas fa-th-list" @click="onClickView(row)">评审记录</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" size="mini" icon="fab fa-leanpub" @click="onClickRecord(row)">浏览记录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column property="fileName" label="文件名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="version" label="版本号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="releaseDate" label="发布日期" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="purpose" label="适用部门" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column property="validDate" label="有效期" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="status" label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{{ 1: '有效', 2: '停用' }[row.status]}}
        </template>
      </el-table-column>
      <el-table-column property="isOverdue" label="是否过期" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <upload-dialog ref="dialog" :title="title" @query="getItemList"></upload-dialog>
    <file-review-record ref="viewDialog" title="评审记录"></file-review-record>
    <file-record-dialog ref="recordDialog" title="浏览记录"></file-record-dialog>
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import UploadDialog from './UploadDialog';
import FileReviewRecord from './FileReviewRecord';
import FileRecordDialog from './FileRecordDialog';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'FileManagement',
  components: {
    UploadDialog,
    FileReviewRecord,
    FileRecordDialog,
  },
  mixins: [queryList, deleteItem],
  props: {
    title: {
      default: '',
    },
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/fileManagement',
      addDisabled: true, // 新增按钮禁用
      queryForm: {
        deptId: '',
        status: 1,
        key: '',
        sort: 'fileName+,releaseDate-',
      },
      itemList: [],
    };
  },
  methods: {
    onClickAdd() {
      this.$refs.dialog.openDialog({ folderId: this.queryForm.folderId });
    },
    onClickSee(row) {
      this.$refs.dialog.openDialog(row, true);
    },
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 点击配置树后改变id
    setConfigId(item) {
      this.queryForm.folderId = item.id;
      this.addDisabled = !item.id && !item.addDisabled;
      if (item.id) {
        this.getItemList();
      }
    },
    onClickView(row) { // 点击获取评审记录
      this.$refs.viewDialog.openDialog(row);
    },
    onClickRecord(row) { // 点击获取浏览记录
      this.$refs.recordDialog.openDialog(row);
    },
    deleteItem() {
      return this.$http.delete(`${this.url}`, { data: this.selectedIds });
    },
    deleteDoc() {
      const docIds = this.itemList.filter(n => this.selectedIds.includes(n.id)).map(n => n.baseDocId);
      return this.$http.delete('res/document', { data: docIds });
    },
    // 删除记录
    onDeleteItem() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.all([this.deleteItem(), this.deleteDoc()])
      )).then(this.$http.spread((item, doc) => {
        if (item.status === 200 && item.data.success && doc.status === 200 && doc.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: item.data.msg || doc.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }));
    },
    // 点击下载
    onClickDown(row) {
      this.$http.get(`res/document/download?id=${row.baseDocId}`, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const { fileName } = row;
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

<style>

</style>
