<!-- 排放量数据查询 -->
<template>
  <dialog-modal
    class="table-dialog table-fill-h dialog-body-fill-h"
    scrollbar
    type="title"
    ref="dialog"
    size="large"
    :before-close="onBeforeClose"
    :title="`${portName}排放量详情`"
  >
    <el-form :model="queryForm" inline class="mar-l-sm">
      <el-form-item label="数据时间：">
        <el-date-picker
          style="width:135px"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:135px"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
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
    <el-table
      border
      highlight-current-row
      height="calc(100% - 65px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." fixed width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="站点名称" prop="portName" fixed min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" fixed min-width="160" show-overflow-tooltip></el-table-column>
      <div v-for="item in queryForm.factorList" :key="item.factorShowCode">
        <el-table-column :label="`${item.factorName}已排放量${item.unitCou ?  `(${item.unitCou})` : ''}`" align="center">
          <el-table-column align="center">
            <template slot="header" slot-scope="{ row }">
              <span hidden>{{row}}</span>
              <span>当日</span>
            </template>
            <template slot-scope="{ row }">
              {{row[`${item.factorCode}-DPQ`]}}
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="{ row }">
              <span hidden>{{row}}</span>
              <span>当月</span>
            </template>
            <template slot-scope="{ row }">
              {{row[`${item.factorCode}-MPQ`]}}
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="{ row }">
              <span hidden>{{row}}</span>
              <span>当年</span>
            </template>
            <template slot-scope="{ row }">
              {{row[`${item.factorCode}-YPQ`]}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          align="center"
          :prop="`${item.factorCode}-YUQ`"
          :min-width="getLabelWidth(`${item.factorName}当年剩余量`, item.unitCou)"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }" slot="header">
            <p style="line-height: 20px">{{ `${item.factorName}当年剩余量` }}</p>
            <p v-show="item.unitCou" style="line-height: 20px">（{{ item.unitCou }}）</p>
            <span style="display: none">{{ row }}</span>
          </template>
        </el-table-column>
      </div>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay, tableTitleLen } from '@/libs/tools';

export default {
  name: 'EmissionQuery',
  mixins: [queryList],
  data() {
    return {
      url: 'tpeci/historyData/cou',
      portName: '',
      queryForm: {
        fromDate: getDay(-1, false, false),
        toDate: getDay(0, false, false),
        portId: '',
        isAll: true,
        factorList: [],
        sort: 'Tstamp-',
      },
      itemList: [],
      factorList: [],
      downloading: false,
    };
  },
  methods: {
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    openDialog(row) {
      this.portName = row.portName;
      this.queryForm.portId = row.portId;
      this.getFactorList(row.portId);
      this.$refs.dialog.openDialog(row);
    },
    onBeforeClose(done) {
      this.queryForm = {
        fromDate: getDay(-1, false, false),
        toDate: getDay(0, false, false),
        portId: '',
        isAll: true,
        factorList: [],
        sort: 'Tstamp-',
      };
      done();
    },
    /* 接口方法 */
    getFactorList() {              // 获取因子列表
      this.$http.get('cfg/pageShowItem', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          pageShowMainCode: 'TPECI_DataQueryCou',
          sort: 'orderNum-',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.factorList = response.data.data;
          this.queryForm.factorList = response.data.data.filter(n => n.valueType === 'Cou').map(n => ({
            factorShowCode: n.factorShowCode,
            factorShowName: n.factorShowName,
            factorName: n.factorName,
            factorCode: n.factorCode,
            unitCou: n.unitCou,
            unit: n.unit,
          }));
          this.onQueryList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post(this.url, { ...this.queryForm }, {
        params: { page, rows },
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
    // 下载数据
    onDownload() {
      this.downloading = true;
      this.$http.post(`${this.url}/export`, { ...this.queryForm }, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `${this.portName}排放量数据查询${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    /* 特殊方法 */
    getLabelWidth(label, unit) {   // 计算动态列宽度
      const labelLen = tableTitleLen(label);
      const unitLen = tableTitleLen(unit ? `(${unit})` : '');
      return labelLen >= unitLen ? labelLen : unitLen;
    },
  },
};
</script>

<style lang="scss">
  .table-dialog.table-fill-h.dialog-body-fill-h {
    .el-scrollbar__view {
      height: 100%;
      div.pad-x-sm {
        height: 100%;
      }
    }
  }
</style>
