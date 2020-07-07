<template>
  <dialog-modal type="title" ref="dialog" size="small"
    scrollbar :view="true" title="阀门自动开关阀记录" @close="closeDialog">
    <el-form :model="queryForm" inline>

      <el-form-item label="时间：">
        <el-date-picker
          style="width:155px"
          v-model="queryForm.fromTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:155px"
          v-model="queryForm.toTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:59:59"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>

    </el-form>
    <!-- 列表 -->
    <el-table border highlight-current-row height="calc(100% - 71px)"
      v-loading="loading" :data="itemList" @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="135" show-overflow-tooltip></el-table-column>
      <el-table-column label="开启时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="关闭时间" prop="endTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="动作" prop="ctypeValue" min-width="160" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';

export default {
  mixins: [queryList],
  data() {
    return {
      url: 'tpeci/tPECIWaterValveStatus',
      isAuto: false,
      loading: false,
      queryForm: {                       // 查询条件
        fromTime: getDay(-2),            // 开始时间
        toTime: getDay(0, true, true),   // 结束时间
        portIds: [],                     // 站点数据
      },
      itemList: [],           // 表格绑定数据
    };
  },
  computed: {
  },
  methods: {
    // 打开对话框
    openDialog(row) {
      this.queryForm.portIds.push(row.portId);
      this.$refs.dialog.openDialog();
      this.getItemList();
    },
    closeDialog() {
      this.itemList = [];
      this.queryForm = {
        fromTime: getDay(-2),          // 开始时间
        toTime: getDay(0, true, true), // 结束时间
        portIds: [],                   // 站点数据
      };
    },
    /* 请求接口 */
    getItemList() { // 获取列表数据
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post(this.url, this.queryForm, {
        params: { page, rows, sort: 'Tstamp-' },
      }).then((response) => {
        if (response.data.success) {
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
  },
};
</script>
