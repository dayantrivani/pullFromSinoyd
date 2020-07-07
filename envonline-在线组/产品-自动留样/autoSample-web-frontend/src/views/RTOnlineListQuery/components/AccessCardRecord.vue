<template>
  <!-- 门禁卡查询 -->
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
        <el-form-item label="门禁卡类型：">
          <el-select v-model="queryForm.cardType">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="运维卡" :value="1"></el-option>
            <el-option label="管理卡" :value="2"></el-option>
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
      <el-table-column prop="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="portName" label="排口名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="i33001" label="门禁开关" show-overflow-tooltip>
        <!-- <template slot-scope="scope"><span>{{ scope.row.isOnline === 1 ? '开' : '关' }}</span></template> -->
      </el-table-column>
      <el-table-column prop="tstamp" label="门禁开始时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="i32001" label="门禁状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardTypeName" label="卡类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardCode" label="卡号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardStatusName" label="卡状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardHolderName" label="持卡人" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AccessCardRecord',
  data() {
    return {
      loading: false, // 下拉表格加载
      queryForm: {
        fromDate: this.$hp.formatDate(new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6)),
          'Y-m-d'),
        toDate: this.$hp.formatDate(new Date(), 'Y-m-d'),
        portId: '',
        cardType: 1,
      },
      itemList: [],
      selectedIds: [],
      pager: {
        page: 1,
        rows: 15,
        total: 1,
      },
    };
  },
  created() {
    // console.log(this.portItem);
    this.queryForm.portId = this.portItem.portId;
    this.getItemList();
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
      this.$http.get('autoSample/accessCardRecord', {
        params: {
          rows,
          page,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.total = response.data.total || response.data.count;
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
    onExport() {
      this.$http.get('autoSample/accessCardRecord/export', {
        params: {
          ...this.queryForm,
        },
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `门禁卡信息${new Date().getTime()}.xls`;
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
