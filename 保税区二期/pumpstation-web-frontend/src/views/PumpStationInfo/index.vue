<template>
  <!-- 泵站基础信息 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>

        <el-form-item label="泵站名称：">
          <el-input
            v-model="queryForm.pumpStationName"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item label="泵站负责人：">
          <el-input
            v-model="queryForm.contactName"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <!-- <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-pencil-alt"
        :disabled="!selectedIds.length"
        @click="onClickAllEdit">批量处理
      </el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div> -->

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="117">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-eye" @click="onClickDetails(scope.row)">监测污染物</el-button>
        </template>
      </el-table-column>
      <el-table-column label="泵站名称" prop="pumpStationName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="泵站负责人" prop="contactName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="泵站负责人联系电话" prop="contactPhone" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="地址" prop="address" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="运维商" prop="opsEnterprise" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="运维联系人" prop="opsContactName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="运维联系方式" prop="opsContactPhone" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="经度" prop="longitude" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="纬度" prop="latitude" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-item ref="dialog" @query="getItemList"/>
  </el-card>
</template>

<script>
// import { getDay } from '@/libs/tools.js';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import DialogItem from './components/DialogItem';

export default {
  name: 'PumpStationInfo',
  mixins: [queryList],
  components: {
    DialogItem,
  },
  data() {
    return {
      url: 'pump/pumpStationInfo',
      isAuto: false,
      loading: false,
      downloading: false,
      queryForm: {                  // 检索表单项
        pumpStationName: '',        // 泵站名称
        contactName: '',            // 负责人姓名
        sort: 'pumpStationName',
      },
      itemList: [],                // 左侧列表
    };
  },
  created() {
    this.onQueryList();
  },
  methods: {
    onClickDetails(row) {              // 监测污染物按钮
      this.$refs.dialog.openDialog(row);
    },

    /* 接口请求 */
    getItemList() {
      this.itemList = [];
      this.loading = true;
      this.selectedIds = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
        this.loading = false;
      });
    },
    onDownload() {                 // 导出按钮
      this.downloading = true;
      const { page, rows } = this.pager;
      this.$http.post(`${this.url}/export`, {
        page,
        rows,
        ...this.queryForm,
      }, {
        'responseType': 'blob',
        params: { sort: 'pumpStationName' },
      }).then((response) => {
        const filename = `泵站基础信息${new Date().toLocaleDateString()}.xls`;
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

<style lang="scss" scoped>
</style>
