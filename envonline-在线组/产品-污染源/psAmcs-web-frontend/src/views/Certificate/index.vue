<template>
  <!-- 凭证管理 -->
  <el-card>
    <!-- 查询条件 -->
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm" v-show="showSearch">
      <el-form-item label="凭证时间：">
        <el-date-picker
          style="width:160px"
          v-model="queryForm.fromTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:160px"
          v-model="queryForm.toTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="站点：">
        <select-port
          v-model="queryForm.portIds"
          filterable
          :options="stationList"
          :field="[
              { name: 'psName', key: 'psId' },
              { name: 'portName', key: 'id' }
            ]"
          @query="getStation()"
        ></select-port>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input placeholder="污染源名称、站点名称" style="width:240px" v-model="queryForm.key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="fas fa-download"
          :loading="downloading"
          @click="onDownload"
        >导 出</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      :height="tableHeight"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @expand-change="getDetailList"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            border
            highlight-current-row
            v-loading="detailLoading"
            :data="props.row.detailList"
            :row-class-name="rowClassName"
          >
            <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
            <el-table-column label="数据时间" prop="dataTime" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="修约因子" prop="factorName" min-width="130" show-overflow-tooltip></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-file-invoice" @click="onFileClick(scope.row.id)">附件</el-button>
        </template>
      </el-table-column>
      <el-table-column label="区域" prop="regionName" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="凭证时间" prop="beginTime" min-width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- 网上报备显示时间范围，数据审核显示单一时间 -->
          {{ `${scope.row.beginTime} ~ ${scope.row.endTime}` }}
        </template>
      </el-table-column>
      <el-table-column label="凭证名称" prop="certificateName" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="修约原因" prop="reason" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="createDate" min-width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="上传人员" prop="creatorName" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList" />
    <!-- 附件框 -->
    <dialog-modal
      ref="dialog"
      size="small"
      title="附件列表"
      minWidth="950px"
      @close="onCloseDialog"
      :append-to-body="true"
    >
      <!-- 操作按钮 -->
      <div class="pad-t-xs pad-l-sm pad-b-xs" style="border-top: 1px solid #EBEEF5">
        <el-button
          type="danger"
          icon="fas fa-trash-alt"
          :disabled="!selectedIds.length"
          @click="onDeleteItem(getFileList)"
        >删 除</el-button>
      </div>
      <el-table
        class="mar-b-sm"
        border
        v-loading="loading"
        :data="fileList"
        :row-class-name="rowClassName"
        @select="onChangeCheck"
        @select-all="onChangeCheckAll"
        @selection-change="onChangeSelected"
      >
        <el-table-column align="center" type="selection" width="38"></el-table-column>
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column label="文件名称" prop="docName" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="onDownloadFile(scope.row)">{{ scope.row.docName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="文件类型" prop="fileType" width="155" show-overflow-tooltip></el-table-column>
        <el-table-column label="上传时间" prop="uploadTime" width="155" show-overflow-tooltip></el-table-column>
      </el-table>
      <div style="height: 10px"></div>
    </dialog-modal>
  </el-card>
</template>
<script>
import { mapState } from 'vuex';
import { getDay } from '@/libs/tools';
import { queryList, deleteItem } from '@/global/libs/mixins';
import SelectPort from '@/components/widget/select-port';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'Certificate',
  components: {
    SelectPort,
  },
  mixins: [queryList, deleteItem],
  data() {
    return {
      isAuto: false,
      queryForm: {
        isAll: false,
        portType: '',
        portIds: [],
        fromTime: getDay(-7, true, false),
        toTime: getDay(0, true, false),
        key: '',
      },
      stationList: [],
      fileList: [],
      downloading: false,
      detailLoading: false,
      showSearch: true, // 显示查询条件
      tableHeight: 'calc(100% - 30px)',
      url: 'res/document', // 删除地址
      currentFileId: '', // 当前的附件id
    };
  },
  created() {
    if (this.portId) { // 是否外部调用
      this.showSearch = false;
      this.queryForm.portIds = [this.portId];
      this.queryForm.fromTime = this.dtBegin;
      this.queryForm.toTime = this.dtEnd;
      this.tableHeight = '100%';
      setTimeout(() => {
        this.getItemList();
      }, 200);
    } else {
      this.getStation();
      this.onQueryList();
    }
  },
  props: {
    dtBegin: String,
    dtEnd: String,
    portId: String,
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType, // 1 废水 2 废气
    }),
  },
  watch: {},
  methods: {
    // 查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      const url = 'audit/certificate/query';
      const sort = 'createDate-';
      const queryForm = { ...this.queryForm };
      queryForm.isAll = queryForm.portIds.length === 0;
      queryForm.portType = this.amcsType;
      this.$http.post(url, queryForm, {
        params: { page, rows, sort },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
    // 获取数据列表
    getDetailList(row, expandedRows) {
      if (!expandedRows.includes(row)) {
        return;
      }
      this.$http.get('audit/certificateFactor', {
        params: {
          page: 1,
          rows: 10000,
          sort: 'dataTime+',
          certificateId: row.id,
        },
      }).then((response) => {
        if (response.data.success) {
          row.detailList = response.data.data;
          // 强制刷新
          this.detailLoading = true;
          this.detailLoading = false;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取附件列表
    getFileList() {
      this.$http.get('res/document', {
        params: {
          objectId: this.currentFileId,
          sort: 'uploadTime-',
        },
      }).then((response) => {
        if (response.data.success) {
          this.fileList = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 下载数据
    onDownload() {
      this.downloading = true;
      const url = 'audit/certificate/export';
      const sort = 'regionName+,psName+,portName+,beginTime-';
      const queryForm = { ...this.queryForm };
      queryForm.isAll = queryForm.portIds.length === 0;
      queryForm.portType = this.amcsType;
      this.$http.post(url, queryForm, {
        'responseType': 'blob',
        params: { sort },
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}凭证管理${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 下载附件
    onDownloadFile(row) {
      const url = 'res/document/download';
      const queryForm = {
        id: row.id,
      };
      this.$http.get(url, {
        'responseType': 'blob',
        params: queryForm,
      }).then((response) => {
        const filename = row.docName;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取站点
    getStation() {
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES', this.amcsType),
          portType: this.amcsType,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.stationList = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 附件按钮
    onFileClick(id) {
      this.currentFileId = id;
      this.getFileList();
      this.$refs.dialog.openDialog();
    },
    // 弹窗关闭前触发
    onCloseDialog() {
      this.fileList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
