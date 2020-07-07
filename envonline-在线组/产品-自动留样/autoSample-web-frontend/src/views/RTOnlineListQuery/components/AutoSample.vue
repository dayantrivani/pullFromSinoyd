<template>
  <!-- 自动监测数据 -->
  <div style="height: calc(100% - 40px)">
    <!-- 查询表单 -->
    <div class="mar-t-xs mar-l-sm">
      <el-form inline :model="queryForm">
        <el-form-item label="时间：">
          <el-date-picker
            style="width:220px"
            v-model="date"
            unlink-panels
            :clearable="false"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="因子：">
          <el-select
            v-model="queryForm.factorCodes"
            placeholder="请选择因子"
            multiple style="width:235px"
            class="z-pointer">
            <el-option v-for="(item, key) in factorList"
              :key="key"
              :label="item.factorShowName"
              :value="item.factorShowCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-upload" @click="onExport">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column prop="portName" label="排口名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tstamp" label="数据时间" min-width="160" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="sampleType" label="留样类别" show-overflow-tooltip></el-table-column>
      <el-table-column prop="relationBottle" label="关联瓶号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sampleNum" label="留样瓶数" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        v-for="(item, index) in gridFactorList" :key="index"
        :property="item.factorShowCode"
        min-width="135"
        :label="item.factorShowName"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="scope.row[item.factorShowCode].includes(':') ? 'color: red;' : ''">
            {{scope.row[item.factorShowCode].split(':')[scope.row[item.factorShowCode].split(':').length - 1]}}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AutoSample',
  data() {
    return {
      loading: false, // 下拉表格加载
      queryForm: {
        fromDate: this.$hp.formatDate(new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6)),
          'Y-m-d'),
        toDate: this.$hp.formatDate(new Date(), 'Y-m-d'),
        portId: '',
        factorCodes: [],
        sort: 'Tstamp-',
      },
      itemList: [],
      factorList: [],
      selectedIds: [],
      gridFactorList: [],
      pager: {
        page: 1,
        rows: 15,
        total: 1,
      },
    };
  },
  created() {
    this.queryForm.portId = this.portItem.portId;
    this.getFactorList();
  },
  computed: {
    ...mapState({
      portItem: state => state.sample.portItem,
    }),
    date: {
      get() {
        let date;
        if (this.queryForm.fromDate !== '' && this.queryForm.toDate !== '') {
          date = [this.queryForm.fromDate, this.queryForm.toDate];
        } else {
          date = '';
        }
        return date;
      },
      set(val) {
        if (val) {
          [this.queryForm.fromDate, this.queryForm.toDate] = val;
        } else {
          [this.queryForm.fromDate, this.queryForm.toDate] = ['', ''];
        }
      },
    },
  },
  methods: {
    // 页面基本方法
    index(index) { // 表格索引衔接
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    getItemList() {
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.post('autoSample/historyData', { ...this.queryForm }, {
        params: {
          rows,
          page,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.total = response.data.total || response.data.count;
          this.gridFactorList = this.factorList.filter(n => this.queryForm.factorCodes.includes(n.factorShowCode));
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    getFactorList() {
      // this.loading = true;
      this.$http.get('cfg/pageShowItem?page=1&rows=100000', {
        params: {
          pageShowMainCode: 'historyForSample',
          isEnabled: true,
        },
      }).then((response) => {
        if (response.data.success) {
          this.factorList = response.data.rows || response.data.data || response.data;
          this.queryForm.factorCodes = this.factorList.filter(n => n.isShow).map(n => n.factorShowCode);
          this.getItemList();
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
    onExport() {
      let factorList = this.factorList.filter(n => this.queryForm.factorCodes.includes(n.factorShowCode));
      factorList = factorList.map(n => ({
        factorShowCode: n.factorShowCode,
        factorShowName: n.factorShowName,
        unit: n.unit,
      }));
      this.$http.post('autoSample/historyData/export', {
        ...this.queryForm,
        factorList,
      }, {
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `自动监控信息${new Date().getTime()}.xls`;
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
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
  },
};
</script>

<style>

</style>
