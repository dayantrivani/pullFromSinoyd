<template>
<!-- 报警信息 -->
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm fn-no-wrap">
      <el-form-item label="测点：">
        <select-port
          v-model="queryForm.portIds"
          filterable
          defaultExpandAll
          :options="portList"
          :props="{ label: 'name', value: 'id' }">
        </select-port>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
      </el-form-item>
      <el-form-item label="报警类型：">
        <el-select
          style="width: 150px"
          v-model="queryForm.alarmTypes"
          multiple
          collapse-tags>
          <el-option v-for="item in alarmList"
            :key="item.id"
            :label="item.itemText"
            :value="item.itemValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          v-model="dateRange"
          :clearable="false"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <hr/>
    <!-- 列表 -->
    <el-table
      border
      class="border-cell"
      highlight-current-row
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      :span-method="cellMerge"
    >
      <!-- <el-table-column align="center" type="selection" width="37"></el-table-column> -->
      <el-table-column align="center" label="No." width="60" type="index" :index="index"></el-table-column>
      <el-table-column property="monitoringPointName" label="点位名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="recordDateTime" label="时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="itemText" label="报警类型" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="content" label="报警内容" min-width="200" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import SelectPort from '@/components/select-port';
import { getDay } from '@/libs/tools';

export default {
  name: 'AlarmInfo',
  components: { SelectPort },
  data() {
    return {
      loading: false,
      queryForm: {
        isAll: true,
        fromDate: getDay(0, false, false),
        toDate: getDay(0, false, false),
        alarmTypes: [],
        portIds: [],
      },
      pickStart: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerOneDate = minDate.getTime();
          if (maxDate) {
            this.pickerOneDate = '';
          }
          // 但第二次未选择时,maxDate为空, 在第二次选择后, 大小值视情况而定
        },
        // 设置禁用状态，参数为当期日期，要求返回Boolean
        disabledDate: (time) => {
          // 当我点击选中一个日期时
          if (this.pickerOneDate !== '') {
            const date = 30 * 24 * 3600000;
            const max = this.pickerOneDate + date - 24 * 3600 * 1000;
            const min = this.pickerOneDate - date;
            return time.getTime() > max || time.getTime() < min || time.getTime() > new Date();
          }
          // 当我点击选中第二个日期后, 或者点开日期控件时
          return time.getTime() > new Date();
        },
      },
      itemList: [],
      alarmList: [], // 报警类型列表
      portList: [], // 测点列表
      pager: {
        rows: 15,
        page: 1,
        count: 0,
      },
      // 新增的合并列数据字段
      cellSpan1: {
        spanArr: [],
        pop: [],
      },
      cellSpan2: {
        spanArr: [],
        pop: [],
      },
    };
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this.queryForm, 'isAll', false);
        } else {
          this.$set(this.queryForm, 'isAll', true);
        }
      },
      deep: true,
    },
  },
  computed: {
    dateRange: {
      get() {
        // 为何为'', 当dateRange值不为 '' 时,时间选项会从 1970年1月1日开始
        return (!this.queryForm.fromDate && !this.queryForm.toDate)
          ? ''
          : [this.queryForm.fromDate, this.queryForm.toDate];
      },
      set(val) {
        [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
      },
    },
  },
  created() {
    this.getAlarmList();
    this.getPortList();
    this.onQueryList();
    if (this.itemList.length) {
      this.getSpanArr(this.itemList);
    }
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    onChangeCheck(val) {         // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    // 合并单元格行列
    cellMerge({ rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.cellSpan1.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      if (columnIndex === 3) {
        const _row = this.cellSpan2.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      return undefined;
    },
    // 数据处理相关
    getSpanArr(data) {
      data.forEach((item, index) => {
        if (index === 0) {
          this.cellSpan1.spanArr.push(1);
          this.cellSpan1.pos = 0;
        } else if (data[index].monitoringPointName === data[index - 1].monitoringPointName) {
          // 判断当前元素与上一个元素是否相同
          this.cellSpan1.spanArr[this.cellSpan1.pos] += 1;
          this.cellSpan1.spanArr.push(0);
        } else {
          this.cellSpan1.spanArr.push(1);
          this.cellSpan1.pos = index;
        }
        if (index === 0) {
          this.cellSpan2.spanArr.push(1);
          this.cellSpan2.pos = 0;
        } else if (data[index].itemText === data[index - 1].itemText) {
          // 判断当前元素与上一个元素是否相同
          this.cellSpan2.spanArr[this.cellSpan2.pos] += 1;
          this.cellSpan2.spanArr.push(0);
        } else {
          this.cellSpan2.spanArr.push(1);
          this.cellSpan2.pos = index;
        }
      });
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post('surfacewater/alarmRecord', this.queryForm, {
        params: {
          page,
          rows,
          sort: 'recordDateTime-',
        },
      }).then((response) => {
        if (response.data.success) {
          this.cellSpan1 = { spanArr: [], pop: [] };
          this.cellSpan2 = { spanArr: [], pop: [] };
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
          this.getSpanArr(this.itemList);
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
    // 获取测点列表数据
    getPortList() {
      this.$http.get('surfacewater/userPort/getAuthorityTree').then((response) => {
        this.portList = response.data.data;
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取报警类别列表数据
    getAlarmList() {
      this.$http.get('surfacewater/alarmType', {
        params: {
          page: '',
          rows: '',
          alarmType: '',
        },
      }).then((response) => {
        this.alarmList = response.data.data;
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
  },
};
</script>

<style>

</style>
