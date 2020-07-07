<template>
  <!-- 泵站对应企业 -->
  <el-card>
    <!-- <template slot="header"> -->
      <el-form :model="queryForm" class="mar-t-xs mar-l-xs" inline>
        <el-form-item label="泵站名称：">
          <el-input
            v-model="queryForm.pumpStationName"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item label="企业名称：">
          <el-input
            v-model="queryForm.psName"
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
    <!-- </template> -->

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <!-- <el-table-column align="center" type="selection" width="37"></el-table-column> -->
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="泵站名称" prop="pumpStationName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业营业执照代码" prop="psCreditCode" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否直排" prop="c" min-width="152" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.isDirectDrainage ? '是' : '否' }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'PumpStation2PS',
  mixins: [queryList],
  data() {
    return {
      url: 'pump/pumpStation2PS',
      isAuto: false,
      loading: false,
      downloading: false,
      queryForm: {                  // 检索表单项
        pumpStationName: '',        // 泵站名称
        psName: '',                 // 企业名称
      },
      itemList: [],
    };
  },
  computed: {
  },
  created() {
    this.onQueryList();
  },
  methods: {
    /* 接口请求 */
    getItemList() {
      this.itemList = [];
      this.loading = true;
      this.selectedIds = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          ...this.queryForm,
          sort: 'pumpStationName',
        },
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
