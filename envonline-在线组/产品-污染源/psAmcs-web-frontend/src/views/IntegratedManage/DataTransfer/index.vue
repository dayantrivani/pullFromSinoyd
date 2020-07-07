<!-- 数据传输率 -->
<template>
  <el-card>
    <template slot="header">
      <!-- 查询表单 -->
      <el-form :model="queryForm" inline>
        <!-- <el-form-item label="统计精度：">
          <el-select
            v-model="queryForm.transferType"
            @change="onChangeTransferType"
            style="width: 100px"
          >
            <el-option :value="1" label="区域"></el-option>
            <el-option :value="2" label="企业"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="行政区域：" v-show="queryForm.transferType === 1">
          <area-select
            style="width: 220px"
            v-model="regionCodeIds"
            lazy
            joint
            rootKey="0"
            url="sys/area"
            :props="{ label: 'areaName' }" />
        </el-form-item>
        <el-form-item label="企业：" v-show="queryForm.transferType === 2 && userType !== 'ent'">
          <select-ent v-model="psIds" style="width: 220px;"></select-ent>
        </el-form-item>
        <date-control v-model="dateControl"></date-control>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </template>
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
      <el-table-column label="区域" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <p @click="onRegionClick(row)" v-if="queryForm.transferType === 1">
            <a href="javascript:void(0)">{{row.regionName}}</a>
          </p>
          <span v-else>{{row.regionName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :sortable="queryForm.transferType === 2 ? 'custom' : ''"
        min-width="160"
        show-overflow-tooltip
        prop="psName"
      >
        <template slot="header" slot-scope="{ column }">
          <span hidden>{{column}}</span>
          <span v-if="queryForm.transferType === 1">考核企业数</span>
          <span v-if="queryForm.transferType === 2">企业名称</span>
        </template>
        <template slot-scope="{ row }">
          <p v-if="queryForm.transferType === 1">{{row.psCount}}</p>
          <p @click="onPsNameClick(row)" v-if="queryForm.transferType === 2">
            <a href="javascript:void(0)">{{row.psName}}</a>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="考核测点数" prop="portCount" show-overflow-tooltip min-width="160"></el-table-column>
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
    <region-dialog ref="dialog"></region-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import AreaSelect from './components/area-select';
import SelectEnt from './components/select-ent';
import RegionDialog from './components/RegionDialog';
import DateControl from './components/date-control';

export default {
  name: 'DataTransfer',
  components: {
    AreaSelect,
    RegionDialog,
    SelectEnt,
    DateControl,
  },
  mixins: [queryList],
  data() {
    return {
      isAuto: false,
      url: 'amcs/dataTransfer',
      queryForm: {
        transferType: 1,
        portType: '',
        // childPortTypes: [1, 2, 3],
      },
      sort: 'dataTransferSort-', // 排序字段
      regionCodeIds: [], // 查询条件选择行政区域 数组
      psIds: [], // 查询条件选择企业 数组
      dateControl: {
        queryDateType: 'day',
        fromDate: getDay(-1, false, false),
        toDate: getDay(-1, false, false),
      },
      downloading: false,
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.psIds = [this.orgGuid];
    }
    this.init();
  },
  watch: {
    $route() {
      this.init();
    },
  },
  computed: {
    ...mapGetters('auth', ['userType', 'userName', 'orgGuid']),
    amcsType() {
      return this.$store.state.auth.amcsType;
    },
    queryData() {
      let queryData = { ...this.queryForm, ...this.dateControl };
      if (this.queryForm.transferType === 1) {
        queryData = { ...queryData, regionCodeIds: this.regionCodeIds };
      } else if (this.queryForm.transferType === 2) {
        queryData = { ...queryData, psIds: this.psIds };
      }
      return queryData;
    },
  },
  methods: {
    init() { // 页面初始化，渲染默认值
      if (this.$route.name.includes('PS')) this.$set(this.queryForm, 'transferType', 2);
      else if (this.$route.name.includes('Region')) this.$set(this.queryForm, 'transferType', 1);
      this.queryForm.portType = this.amcsType;
      this.getItemList();
    },
    onQueryList() { // 查询列表
      this.pager.page = 1;
      this.getItemList();
    },
    onChangeTransferType() { // 选择统计精度
      this.itemList = [];
      this.onQueryList();
    },
    onRegionClick(row) { // 点击区域列
      const queryForm = {
        ...this.queryForm,
        ...this.dateControl,
        transferType: 2,
        regionCodeId: row.regionCodeId,
      };
      this.$refs.dialog.openDialog({ queryForm, title: `${row.regionName}企业信息` });
    },
    onPsNameClick(row) { // 点击企业名称
      const queryForm = {
        ...this.queryForm,
        ...this.dateControl,
        transferType: 3,
        psId: row.psId,
        childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType),
      };
      this.$refs.dialog.openDialog({ queryForm, title: `${row.psName}站点信息` });
    },
    onChangeSort(sortItem) {
      const prop = `${sortItem.prop ? sortItem.prop : 'dataTransferSort'}`;
      let order = '-';
      if (sortItem.order) {
        order = sortItem.order.includes('ascending') ? '+' : '-';
      }
      this.sort = `${prop}${order}`;
      this.onQueryList();
    },
    /* 请求接口 */
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
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post(this.url, this.queryData, {
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
  },
};
</script>

<style lang="scss" scoped>
</style>
