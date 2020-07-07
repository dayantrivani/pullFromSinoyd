<!-- 数据详情 -->
<template>
  <el-card>
    <el-form :model="queryForm" class="mar-t-xs mar-l-sm" inline>
      <el-form-item label="任务起止时间：">
        <el-date-picker
          style="width:135px"
          v-model="queryForm.fromTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:135px"
          v-model="queryForm.toTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 23:59:59"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      border
      highlight-current-row
      class="border-cell"
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
      @select="onChangeCheck">
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed property="latitude" label="经度" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column fixed property="longitude" label="纬度" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column fixed property="tstamp " label="监测时间" width="160"></el-table-column>
      <el-table-column
        v-for="item in colFactor"
        :key="item.id"
        show-overflow-tooltip
        class="fixed2-header-height"
        align="center"
        :min-width="getLabelWidth(item.factorName, item.unit)">
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.factorName }}</p>
          <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
          <span style="display: none">{{ row }}</span>
        </template>
        <template slot-scope="{ row }">
          <p :class="{ 'text-danger': isRed(row[item.factorCode]) }">
            {{ isOut(row[item.factorCode]) }}
          </p>
          <p v-if="row[`${item.factorCode}-Standard`] !== '' && isRed(row[item.factorCode])">
            {{ row[`${item.factorCode}-Standard`] }}
          </p>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList()"/>
  </el-card>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { tableTitleLen } from '@/libs/tools';

export default {
  name: 'DetailsData',
  mixins: [queryList],
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: 'voyage/historyData',
      isAuto: false,
      queryForm: {
        taskId: '',    // 任务Id
        fromTime: '',
        toTime: '',
        sort: 'Tstamp-',
      },
      colFactor: [],
      itemList: [],
    };
  },
  computed: {
  },
  watch: {
  },
  methods: {
    openDialog() {
      this.queryForm.taskId = this.mainrow.taskId;
      this.getFactorList();
    },

    /** 请求层 */
    getItemList() {        // 获取记录列表
      // this.selectedIndexs = [];
      const st = new Date(this.queryForm.fromTime.replace(/-/g, '/')).getTime();
      const et = new Date(this.queryForm.toTime.replace(/-/g, '/')).getTime();
      if (st > et) {
        this.$message({
          type: 'warning',
          message: '开始时间大于结束时间',
          showClose: true,
          duration: 3000,
        });
        this.loading = false;
        return;
      }
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data || [];
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
    getFactorList() {        // 获取因子列表
      this.loading = true;
      // this.selectedIndexs = [];
      // const { page, rows } = this.pager;
      this.$http.get('voyage/factorInfo', {
        params: {
          page: 1,
          rows: 10000000,
          sort: 'orderNum-',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.colFactor = (response.data.data || []).map(v => ({
            factorName: v.factorName,
            factorCode: v.factorCode,
            unit: v.unit,
          }));
          this.getItemList();
        } else {
          this.loading = false;
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        this.loading = false;
        analyzeResp(response);
      });
    },

    /** 特殊方法 */
    closeDialog() {
      this.colFactor = [];
      this.itemList = [];
      this.queryForm = {
        taskId: '',    // 任务Id
        fromTime: '',
        toTime: '',
        sort: 'Tstamp-',
      };
    },
    isRed(val) {                   // 因子是否显示为红色
      return typeof val === 'string' ? val.includes('red') : false;
    },
    isOut(val) {                   // 因子显示的值
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    getLabelWidth(label, unit) {   // 计算动态列宽度
      const labelLen = tableTitleLen(label);
      const unitLen = tableTitleLen(unit ? `(${unit})` : '');
      return labelLen >= unitLen ? labelLen : unitLen;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
