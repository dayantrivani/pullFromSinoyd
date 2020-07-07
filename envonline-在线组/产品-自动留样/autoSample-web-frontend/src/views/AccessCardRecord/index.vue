<template>
  <!--
    门禁记录 -- 新页面
  -->
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="时间：">
          <el-date-picker
            style="width:220px;"
            v-model="datetimerange"
            type="daterange"
            :clearable="false"
            range-separator="至"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="站点：">
          <el-select
            v-model="queryForm.portIds"
            style="width: 250px;"
            placeholder="请选择站点"
            multiple
            collapse-tags>
            <el-option
              v-for="(item, key) in options.portIds"
              :key="key"
              :label="item.portName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡类型：">
          <el-select v-model="queryForm.cardType" style="width: 160px;" placeholder="请选择卡类型">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="运维卡" :value="1"></el-option>
            <el-option label="管理卡" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          <el-button type="primary" icon="fas fa-upload" @click="onExport">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 记录列表 -->
    <el-table
      border
      height="calc(100% - 33px)"
      v-loading="loading"
      highlight-current-row
      :data="itemList">
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column prop="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="portName" min-width="200" label="排口名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="i33001" label="门禁开关" show-overflow-tooltip>
        <!-- <template slot-scope="scope"><span>{{ scope.row.isOnline === 1 ? '开' : '关' }}</span></template> -->
      </el-table-column>
      <el-table-column prop="tstamp" label="门禁开关时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="i32001" label="门禁状态" show-overflow-tooltip></el-table-column>
      <!-- 排口类型名称 -->
      <el-table-column prop="cardTypeName" label="卡类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardCode" label="卡号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardStatusName" label="卡状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cardHolderName" label="持卡人" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </el-card>
</template>

<script>
import { queryList } from '@/plugins/mixins';

export default {
  name: 'AccessCardRecord',
  mixins: [queryList],
  data() {
    return {
      url: 'autoSample/accessCardRecord',
      type: 'post',
      // 跳转到该页面会刷新
      isAuto: true,
      // 是否是动态路由
      isUrl: true,
      // 表单参数集合
      queryForm: {
        fromDate: '',            // 开始时间
        toDate: '',              // 结束时间
        cardType: -1,            // 卡类型
        portIds: [],             // 排口(站点)ID
        isAll: true,             // 是否选择了排口(站点)
        sort: 'DataId,Tstamp-',  // 排序
      },
      options: {
        portIds: [],             // 排口(站点)Id
      },
    };
  },
  computed: {
    portIds() { return this.queryForm.portIds; },
    _URL() {
      const { page, rows } = this.pager;
      return `autoSample/accessCardRecord?page=${page}&rows=${rows}`;
    },
    // 日期时间范围选择器的绑定值
    datetimerange: {
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
        // this.queryForm.fromDate = val[0];
        // this.queryForm.toDate = val[1];
        [this.queryForm.fromDate, this.queryForm.toDate] = val;
      },
    },
  },
  watch: {
    portIds: {
      handler(val) {
        if (val.length === 0) {
          this.queryForm.isAll = true;
        } else {
          this.queryForm.isAll = false;
        }
      },
      deep: true,
    },
  },
  created() {
    // if (this.isAuto) this.onQueryList();
    const date = new Date();
    this.queryForm.fromDate = `${date.getFullYear()}-01-01`;
    this.queryForm.toDate = this.$hp.formatDate(date, 'Y-m-d');
    // 获取站点的数据
    this.getPortIdsData();
  },
  methods: {
    getTreeData(val) {
      this.queryForm.portTypes = val || [];
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.msg.includes('成功')) {
          this.itemList = response.data.data;
          this.pager.total = response.data.count;
        } else {
          this.$message.warning({
            message: response.body.msg,
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
    // 获取值类型接口数据
    getPortIdsData() {
      this.$http.get('bas/portInfo/queryAuthority/', {
        params: {
          page: 1,
          rows: 100000,
          childPortType: 4,
          portType: 1,
          sort: 'portName',
        },
      }).then((response) => {
        if (response.status === 200) {
          this.options.portIds = response.data.data || [];
        } else {
          this.$message.error({
            duration: 3000,
            showClose: true,
          });
        }
      }).catch((response) => {
        this.$hp.resp(response);
      });
    },
    onExport() {
      this.$http.post('autoSample/accessCardRecord/export', {
        ...this.queryForm,
      }, {
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `门禁记录${new Date().getTime()}.xls`;
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
