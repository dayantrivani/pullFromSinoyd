<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="large"
    scrollbar
    :view="true"
    :title="title"
    @close="closeDialog"
  >
    <button
      v-if="queryForm.transferType === 3"
      slot="download"
      class="el-dialog__headerbtn"
      title="导出"
      :loading="downloading"
      @click="onDownload">
      <i class="icon el-icon-download"></i>
    </button>
    <!-- <el-button
      v-if="queryForm.transferType === 3"
      type="primary"
      icon="fas fa-download"
      :loading="downloading"
      @click="onDownload">
        导 出
    </el-button> -->
    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
      @sort-change="onChangeSort"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="区域" width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span @click="onRegionClick(row.regionCodeId)">{{row.regionName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="queryForm.transferType === 2 || queryForm.transferType === 3"
        sortable="custom"
        label="企业名称"
        prop="psName"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        v-if="queryForm.transferType === 1"
        label="考核企业数"
        prop="psCount"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        v-if="queryForm.transferType !== 3"
        label="考核测点数"
        prop="portCount"
        show-overflow-tooltip
        min-width="160"
      ></el-table-column>
      <el-table-column
        v-if="queryForm.transferType === 3"
        label="测点"
        prop="portName"
        show-overflow-tooltip
        min-width="160"
      ></el-table-column>
      <el-table-column sortable="custom" label="传输率" prop="dataTransfer" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            placement="top-start"
            :content="`${row.actualDataItem}/${row.shouldDataItem}`"
          >
            <div
              :style="{
                'position': 'relative',
                'color': 'inherit',
                'width': '100%',
                'height': '15px',}"
              :class="{
                'bg-success': parseInt(row.dataTransfer) >= 90,
                'bg-danger': parseInt(row.dataTransfer) < 90,
              }"
            >
              <div :style="{
                'position': 'absolute',
                'left': '0px',
                'top': '0px',
                'width': `${row.dataTransfer}`,
                'height': '100%',}"
                :class="{
                  'bg-success': parseInt(row.dataTransfer) >= 90,
                  'bg-danger': parseInt(row.dataTransfer) < 90,
                }"
              ></div>
              <div :style="{
                'position': 'absolute',
                'right': '0px',
                'top': '0px',
                'background-color': '#f7f7f7',
                'height': '100%',
                'width': `${100 - parseInt(row.dataTransfer)}%`,
              }"></div>
              <span :style="{
                'position': 'absolute',
                'left': '50%',
                'top': '50%',
                'transform': 'translate(-50%, -50%)'}"
              >{{ row.dataTransfer }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  data() {
    return {
      isAuto: false,
      downloading: false,
      url: 'amcs/dataTransfer',  // 必须, 接口地址
      queryForm: {},
      sort: 'dataTransferSort-', // 排序字段
      title: '',           // 弹窗标题
      itemList: [],        // 表格绑定数据
    };
  },
  computed: {},
  methods: {
    // 打开对话框
    openDialog(row) {
      this.queryForm = row.queryForm;
      this.title = row.title;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onChangeSort(sortItem) {
      let prop = `${sortItem.prop ? sortItem.prop : 'dataTransferSort'}`;
      if (prop === 'dataTransfer') prop = 'dataTransferSort';
      let order = '-';
      if (sortItem.order) {
        order = sortItem.order.includes('ascending') ? '+' : '-';
      }
      this.sort = `${prop}${order}`;
      this.onQueryList();
    },
    /* 请求接口 */
    getItemList() { // 获取列表数据
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post(this.url, this.queryForm, {
        params: { page, rows, sort: this.sort },
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
    onDownload() { // 导出Excel
      this.downloading = true;
      this.$http.post('amcs/dataTransfer/export/', this.queryData, {
        'responseType': 'blob',
        params: { sort: this.sort },
      }).then((response) => {
        const filename = `数据传输率${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
  },
};
</script>
