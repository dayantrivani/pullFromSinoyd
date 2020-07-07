<template>
  <el-row>
    <el-col :span="24" class="fill-auto mar-l-sm">
      <div :class="{ 'mar-l-sm': indent }" class="title-info">相关电子文档</div>
    </el-col>
    <el-col :span="24" style="width:auto" class="fill-auto mar-l-sm mar-t-xs">
      <el-upload
        v-loading="uploadLoading"
        class="pad-r-sm pad-y-xs"
        :class="{ 'pad-l-sm': indent }"
        ref="addFile"
        :multiple="false"
        action=""
        :disabled="!id"
        :file-list="tempList"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="onFileChange"
        :http-request="uploadQuery">
        <el-tooltip offset="8" effect="dark" transition placement="top-start" :disabled="!!id">
          <div slot="content">
            <p>请先填写并保存上面监测详情后，再上传附件</p>
          </div>
          <div>
            <el-button
              icon="fas fa-cloud-upload-alt"
              :disabled="!id"
              type="primary">上传文件</el-button>
          </div>
        </el-tooltip>
      </el-upload>
    </el-col>
    <el-button
      class="mar-t-sm"
      icon="fas fa-trash-alt"
      type="danger"
      :disabled="!selectedIds.length"
      @click="onClickRemove">删 除</el-button>
    <el-button
      type="primary"
      icon="fas fa-cloud-download-alt"
      :disabled="!id"
      @click="onClickDownload"
    >批量打包下载</el-button>
    <!-- <div :class="{ 'mar-x-sm': indent }"> -->
      <el-table
        border
        :data="tempList"
        height="calc(100% - 72px)"
        @selection-change="onChangeSelected"
      >
        <el-table-column align="center" type="selection" width="40"></el-table-column>
        <el-table-column label="No." type="index" align="center" width="50"></el-table-column>
        <el-table-column align="center" label="操作" width="67">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="fas fa-cloud-download-alt"
              @click="onClickDown(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
        <el-table-column property="name" label="附件名称" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column property="size" label="大小" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{formatFileSize(scope.row.size)}}
          </template>
        </el-table-column>
        <el-table-column property="uploadTime" label="上传时间" min-width="160" show-overflow-tooltip></el-table-column>
      </el-table>
    <!-- </div> -->
    <!-- </el-col> -->
  </el-row>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { mapState } from 'vuex';
import { formatDate } from '@/global/libs/tools';
// import { analyzeResp } from '@/global/libs/util';

export default {
  props: {
    id: {
      default: '',
    },
    schemeReportData: { // 监测数据相关信息
      default: {},
    },
    indent: { // 上传按钮是否添加 `mar-l-sm`
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      // required: true,
    },
  },
  inject: ['schemeBasicData'], // 接收祖先组件传递的参数
  data() {
    return {
      uploadLoading: false, // 上传组件加载动画
      tempList: [],
      selectedIds: [],
    };
  },
  computed: {
    // 获取当前用户
    ...mapState({
      user: state => state.auth.user,
    }),
    nums() {
      return this.tempList.length;
    },
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
  watch: {
    tempList() {
      this.tempList.forEach((element) => {
        this.$set(element, 'time', formatDate(new Date(), 'Y-m-d H:i:s'));
        this.$set(element, 'person', this.user.userName);
      });
    },
    id(val) {
      if (!val) {
        this.tempList = [];
        this.fileList = [];
      }
    },
  },
  methods: {
    formatFileSize(size) { // bytes自适应转换到KB,MB,GB
      let _size;
      if (size < 1024) {
        _size = `${size}B`;
      } else if (size < 1024 * 1024) {
        _size = `${(size / 1024).toFixed(2)}KB`;
      } else if (size < 1024 * 1024 * 1024) {
        _size = `${(size / (1024 * 1024)).toFixed(2)}MB`;
      } else if (size < 1024 * 1024 * 1024 * 1024) {
        _size = `${(size / (1024 * 1024 * 1024)).toFixed(2)}GB`;
      }
      return _size;
    },
    // 当选择项发生变化时会触发该事件
    onChangeSelected(option) {
      this.selected = option;
      this.selectedIds = option.map(val => val.id);
    },
    // 获取附件列表
    getItemList() {
      this.loading = true;
      this.$http.get('res/document', {
        params: {
          objectId: this.id,
          rows: 1000000,
          page: 1,
          sort: 'uploadTime-, docName+',
        },
      }).then((response) => {
        if (response.data.code === 200) {
          this.fileList = response.data.data;
          this.tempList = response.data.data.map(n => ({
            name: n.docName,
            size: n.docSize,
            modifyDate: n.modifyDate,
            ...n,
          }));
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
    // 上传前转化成 formData 对象
    beforeUpload() {
      // const formData = new FormData();
      // val.forEach((item) => { formData.append('file', item.raw, item.raw.name); });
      // return formData;
    },
    // 上传方法
    uploadQuery(item) {
      this.uploadLoading = true;
      const formData = new FormData();
      formData.append('file', item.file, item.file.name);
      this.$http.post(`res/document/upload/?objectId=${this.id}`, formData).then((response) => {
        if (response.data.code === 200) {
          this.$message.success({
            message: '上传成功',
            duration: 1500,
            showClose: true,
          });
          this.getItemList();
          this.schemeBasicData.setUpdateDate(this.schemeBasicData.schemeItem.id);
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
        this.uploadLoading = false;
        this.$emit('update-recover');
      });
    },
    // 点击下载
    onClickDown(row) {
      this.$http.get(`res/document/download?id=${row.id}`, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          let fileName = '';
          fileName += this.schemeBasicData.schemeItem.psName || '管委会';
          fileName += this.schemeReportData.monitoringTypeCodeIdValue;
          if (this.schemeReportData.reportingPeriod === '1') {
            fileName += this.schemeReportData.monitoringDate;
          } else if (this.schemeReportData.reportingPeriod === '2') {
            fileName += this.$enum.monitoringMonth[this.schemeReportData.monitoringMonth];
          } else if (this.schemeReportData.reportingPeriod === '3') {
            fileName += this.$enum.monitoringQuarter[this.schemeReportData.monitoringQuarter];
          } else if (this.schemeReportData.reportingPeriod === '4') {
            fileName += this.$enum.monitoringYearHalf[this.schemeReportData.monitoringYearHalf];
          }
          fileName += row.docName;
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
    onClickDownload() {
      let fileName = '';
      fileName += this.schemeBasicData.schemeItem.psName || '管委会';
      fileName += this.schemeReportData.monitoringTypeCodeIdValue;
      if (this.schemeReportData.reportingPeriod === '1') {
        const date = this.schemeReportData.monitoringDate.split(' ')[0];
        fileName += date ? `${date.split('-')[0]}年${date.split('-')[1]}月${date.split('-')[2]}日` : '';
      } else if (this.schemeReportData.reportingPeriod === '2') {
        fileName += this.$enum.monitoringMonth[this.schemeReportData.monitoringMonth];
      } else if (this.schemeReportData.reportingPeriod === '3') {
        fileName += this.$enum.monitoringQuarter[this.schemeReportData.monitoringQuarter];
      } else if (this.schemeReportData.reportingPeriod === '4') {
        fileName += this.$enum.monitoringYearHalf[this.schemeReportData.monitoringYearHalf];
      }
      fileName = fileName.replace(/\\ | \/ | : | \* | \? | " | < | > | \| | -/g, '');
      this.downLoad([{ name: fileName, objectId: this.id }]);
    },
    // 点击下载
    downLoad(items) {
      this.$http.post('res/document/download', items, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const fileName = `${items[0].name}.zip`;
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
    // 移除附件
    onClickRemove() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('res/document', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.code === 200) {
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
    // 文件改变时
    onFileChange() {
      this.$refs.addFile.submit();
    },
  },
};
</script>

<style>

</style>
