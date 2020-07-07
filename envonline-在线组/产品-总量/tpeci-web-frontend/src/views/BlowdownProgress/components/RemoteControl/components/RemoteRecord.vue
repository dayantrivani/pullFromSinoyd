<template>
  <el-card type="title" fill>
    <!-- 检索条件 -->
    <el-form inline :model="queryForm" class="mar-t-xs mar-l-sm">
      <el-form-item label="起止时间：">
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表相关内容 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 30px)"
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column
        property="cmdDesc"
        label="命令描述"
        min-width="280"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column property="releaseStatus" label="下发情况" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="responseStatus" label="现场应答情况" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="execState" label="最终执行情况" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="addDate" label="操作时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="addUserName" label="发送人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="portName" label="排口名称" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="200" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </el-card>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { getDay } from '@/libs/tools';

export default {
  name: 'RemoteRecord',
  mixins: [queryList],
  props: ['portId'],
  data() {
    return {
      isAuto: false,
      url: 'tpeci/remoteControl',
      queryForm: {                            // 查询条件
        fromDate: getDay(-2, false, false),   // 开始时间
        toDate: getDay(0, false, false),      // 结束时间
      },
      downloading: false,
    };
  },
  watch: {
    portId() {
      this.getItemList();
    },
  },
  methods: {
    /** 请求层 */
    getItemList() {              // 获取记录列表
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post(this.url, { ...this.queryForm, portId: this.portId }, {
        params: {
          page,
          rows,
          sort: 'addDate-',
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
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export?sort=addDate-`, { ...this.queryForm, portId: this.portId }, {
        responseType: 'blob',
      }).then((response) => {
        const filename = `远程控制${new Date().toLocaleDateString()}.xls`;
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
