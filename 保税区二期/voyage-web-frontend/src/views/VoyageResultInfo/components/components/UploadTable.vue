<template>
  <!-- 上传附件列表 -->
  <div style="width: 100%; height: 100%;">

    <!-- 按钮组 -->
    <div class="mar-b-xs mar-l-xs">
      <el-button type="primary" icon="fas fa-cloud-upload-alt" @click="onClickUpload">上 传</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 61px)"
      v-loading="loading"
      :data="fileList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="76">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickDown(scope.row)">下 载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="文件名称" prop="docName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="上传时间" prop="uploadTime" min-width="160" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <upload ref="upload" :id="id" @query="getItemList"/>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import Upload from '@/components/Upload.vue';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  mixins: [queryList, deleteItem],
  components: {
    Upload,
  },
  data() {
    return {
      url: 'res/document',
      // docTypeId: '',   // 上传参数 docTypeId
      id: '',  // 上传参数 id
      loading: false,  // 表格数据加载状态
      isAuto: false,
      // selectedIds: [], // 列表选中项集合
      fileList: [],    // 列表数据集合
      // queryForm: {
      //   docName: '',    // 文件名称
      //   uploadTime: '', // 上传时间
      // },
    };
  },
  created() {
    // this.getItemList();
  },
  computed: {
    // ...mapState({
    //   uploadInfo: state => state.psInfo.uploadInfo,   // 上传附件id所在的对象
    // }),
  },
  methods: {
    openDialog(id) {
      this.id = id;
      this.onQueryList();
    },
    // onSaveSelected(selection) {   // 表格选中
    //   this.selectedIds = selection.map(val => val.id);
    // },
    // onDeleteItem() {   // 删除
    //   if (this.selectedIds.length === 0) {
    //     this.$message('请选择要删除的数据');
    //     return;
    //   }
    //   this.$confirm('是否删除选中的数据？', '请确定', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(() => (
    //     this.$http.delete('res/document', { data: this.selectedIds })
    //   )).then((response) => {
    //     if (response.data.success) {
    //       this.getItemList();
    //     }
    //     this.$message({
    //       showClose: true,
    //       message: response.data.success ? '删除成功' : response.data.msg,
    //       type: response.data.success ? 'success' : 'error',
    //       duration: 3000,
    //     });
    //   });
    // },
    onClickDown(row) { // 下载附件
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
    // 获取附件列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          objectId: this.id,
          // docTypeId: this.docTypeId,
          sort: 'docName+, uploadTime-',
        },
      }).then((response) => {
        if (response.data.success) {
          this.fileList = response.data.data || [];
          this.pager.count = response.data.count;
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
    // 单击上传按钮
    onClickUpload() {
      this.$refs.upload.openDialog();
    },
    closeDialog() {
      this.fileList = [];
      this.selectedIds = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
