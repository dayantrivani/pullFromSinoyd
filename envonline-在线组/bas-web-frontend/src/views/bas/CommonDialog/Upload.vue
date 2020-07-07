<template>
  <!-- 上传组件 -->
  <div class="upload">
    <div class="mar-y-xs">
      <el-button type="primary" icon="fas fa-cloud-upload-alt" @click="onClickAdd"> 上传文档</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem"> 删除文档</el-button>
    </div>
    <el-table
      v-loading="loading"
      :height="height"
      border
      :data="fileList"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="70">
        <template slot-scope="scope">
          <el-button type="primary" @click="onDownLoad(scope.row)" icon="fa fa-download">
            下 载
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="docName" label="文档名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="fileType" label="文档类型" show-overflow-tooltip></el-table-column>
      <el-table-column property="authorName" label="上传人" show-overflow-tooltip></el-table-column>
      <el-table-column property="uploadTime" label="上传日期" min-width="200" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-modal ref="dialog" size="mini" title="上传附件" :appendToBody="true">
      <el-upload
        ref="addFile"
        multiple
        class="mar-t-xs mar-b-xs"
        action=""
        :before-upload="beforeUpload"
        :file-list="tempList"
        :auto-upload="false"
        :http-request="onCreateItem"
        :on-change="onFileChange"
        :on-remove="handleRemove">
        <el-button size="small">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传不超过 10MB 大小的文件, 且每次上传不超过 100MB 大小</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="disabled"
          type="primary"
          icon="fas fa-cloud-upload-alt"
          @click="onClickUpload">上 传
        </el-button>
        <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </span>
    </dialog-modal>
  </div>
</template>

<script>
// import PagingQuery from '@/components/widgets/PagingQuery';

export default {
  // components: {
  //   PagingQuery,
  // },
  name: 'Upload',
  props: {
    id: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      default: '55vh',
    },
  },
  data() {
    return {
      disabled: false,
      count: 0,
      loading: false,           // 附件列表显示加载状态
      // addDialogVisible: false,  // 添加附件弹框显示
      fileList: [],             // 附件列表
      tempList: [],             // 待上传附件列表
      formatData: {},           // 上传数据转化对象
      selectedIds: [],          // 已选择的附件ID
      pager: {                  // 分页
        total: 0,
        page: 1,
        rows: 15,
      },
    };
  },
  computed: {
    // 文件大小数组
    filesSize() {
      return this.tempList.map(val => val.size / 1024 / 1024);
    },
    // 单个上传文件 true: 小于10MB, false: 文件大小超出
    isFileSize() {
      return this.filesSize.every(size => size < 10);
    },
    // 多个上传文件 true: 小于100MB, false: 总大小超出
    isFilesSize() {
      return this.filesSize.reduce((val, newVal) => val + newVal, 0) < 100;
    },
  },
  created() {
    this.getItemList();
  },
  watch: {
    id() {
      this.getItemList();
    },
    count() {
      if (this.count === this.filesSize.length) {
        this.disabled = false;
        this.tempList = [];
        this.getItemList();
      }
    },
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 保存选中项 id
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    // 单击添加上传附件
    onClickAdd() {
      this.tempList = [];
      // this.addDialogVisible = true;
      this.$refs.dialog.openDialog();
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.tempList = fileList;
    },
    // 文件改变时
    onFileChange(file, fileList) {
      this.tempList = fileList;
    },
    // 单击触发上传请求
    onClickUpload() {
      if (!this.tempList.length) {
        this.$message.info('请选择需要上传的附件');
      } else if (!this.isFileSize) {
        this.$message.info('单个文件大小不能超过10MB');
      } else if (!this.isFilesSize) {
        this.$message.info('上传文件总大小不能超过100MB');
      } else {
        this.count = 0;
        this.disabled = true;
        this.$refs.addFile.submit();
      }
    },
    // 获取附件列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('res/document', {
        params: {
          page,
          rows,
          objectId: this.id,
          sort: 'uploadTime-',
        },
      }).then((response) => {
        if (response.data.success) { // 返回格式错误
          this.fileList = response.data.data;
          this.pager.total = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 上传前的钩子 格式化
    beforeUpload(file) {
      this.formatData.param = new FormData();  // 创建form对象
      this.formatData.param.append('file', file, file.name);  // file对象是 beforeUpload参数
      this.formatData.config = {
        params: { objectId: this.id },
      };
    },
    // 上传附件
    onCreateItem() {
      this.$http.post('res/document/upload', this.formatData.param, this.formatData.config)
        .then((response) => {
          if (response.data.success) {
            this.$message.success('上传成功');
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        }).finally(() => {
          this.count++;
          // this.addDialogVisible = false;
          this.$refs.dialog.closeDialog();
        });
    },
    // 删除附件
    onDeleteItem() {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('res/document', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: response.data.msg,
            duration: 1500,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    onDownLoad(row) { // 下载附件
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

</style>
