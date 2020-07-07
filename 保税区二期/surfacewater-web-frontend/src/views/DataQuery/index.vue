<template>
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
      <el-form-item label="监测因子：">
        <select-port
          ref="factor"
          v-model="queryForm.factorCodes"
          filterable
          defaultExpandAll
          :options="factorList"
          :props="{ label: 'name', value: 'factorCode' }">
        </select-port>
      </el-form-item>
      <!-- <el-form-item label="数据类型：">
        <el-select v-model="queryForm.point">
          <el-option label="小时数据" value="1"></el-option>
        </el-select>
      </el-form-item> -->
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
    <el-tabs v-model="activeName" type="border-card" @tab-click="onTabClick">
      <el-tab-pane label="列表" name="list" lazy>
        <el-button
          type="primary"
          icon="fas fa-download"
          class="mar-y-xs mar-l-sm"
          :loading="downloading"
          @click="onExport"
        >导出 Excel</el-button>
        <!-- 列表 -->
        <el-table
          border
          class="border-cell"
          highlight-current-row
          height="calc(100% - 70px)"
          v-loading="loading"
          :data="itemList"
          :span-method="cellMerge"
        >
          <el-table-column align="center" label="No." width="60" type="index" :index="index" fixed></el-table-column>
          <el-table-column property="monitoringPointName" label="测点" min-width="120" show-overflow-tooltip fixed></el-table-column>
          <el-table-column property="tstamp" label="日期" min-width="160px" show-overflow-tooltip fixed></el-table-column>
          <!-- 因子列 循环选择的因子项生成 选择因子取自组件钩子 checkedFactorList -->
          <el-table-column
            v-for="item in checkedFactorList"
            show-overflow-tooltip
            class="fixed2-header-height"
            align="center"
            :key="item.factorCode"
            :min-width="getLabelWidth(item.name, item.unit)">
            <template slot-scope="{ row }" slot="header">
              <p style="line-height: 20px">{{ item.name }}</p>
              <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
              <span style="display: none">{{ row }}</span>
            </template>
            <template slot-scope="{ row }">
              <span :class="{ 'text-danger': isRed(row[item.factorCode]) }">
                {{ isOut(row[item.factorCode]) }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <paging-query :pager="pager" @query="getItemList"/>
      </el-tab-pane>
      <el-tab-pane label="图表" name="chart">
        <el-scrollbar
          v-loading="chartLoad"
          ref="scrollbar"
          class="hide-x"
          style="height:calc(100% - 32px)"
          :native="false"
          :noresize="false"
        >
          <div
            v-for="chart in this.chartData"
            style="height:78vh;width:100%"
            :ref="chart.pointId"
            :key="chart.pointId"
          ></div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import echarts from 'echarts';
import SelectPort from '@/components/select-port';
import { analyzeResp } from '@/global/libs/util';
import { getDay, tableTitleLen } from '@/libs/tools';

export default {
  name: 'DataQuery',
  components: { SelectPort },
  data() {
    return {
      once: true,
      loading: false,
      chartLoad: false,
      queryForm: {
        fromDate: getDay(-1, false, false),
        toDate: getDay(0, false, false),
        portIds: [],
        factorCodes: [],
      },
      itemList: [],
      pager: {
        rows: 15,
        page: 1,
        count: 0,
      },
      cellSpan1: {
        spanArr: [],
        pop: [],
      },
      portList: [],
      factorList: [],
      checkedFactorList: [],
      activeName: 'list',
      downloading: false,
      chartData: [],
      chartObj: {},
      allfactorCode: [],
      codeList: [],
    };
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
    this.getPortList();
    this.getFactorList();
    if (this.itemList.length) {
      this.getSpanArr(this.itemList);
    }
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 处理单位换行 & 列宽
    getUnit(label, unit) {
      const unitText = unit ? `(${unit})` : '';
      return `${label}${unitText}`;
    },
    getLabelWidth(label, unit) {
      return tableTitleLen(this.getUnit(label, unit));
    },
    isOut(val) {
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    isRed(val) {
      return typeof val === 'string' ? val.includes('red') : false;
    },
    getLabelLen(label, unit) {
      const labelText =  label.length > unit.length ? label : `（${unit}）`;
      return tableTitleLen(labelText);
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
      });
    },
    onTabClick(tab) {
      if (tab.name === 'chart') {
        this.getChartData();
      } else if (tab.name === 'list') {
        this.onQueryList();
      }
    },
    onQueryList() {
      this.pager.page = 1;
      if (this.activeName === 'chart') {
        this.getChartData();
      } else if (this.activeName === 'list') {
        this.$nextTick(() => {
          this.checkedFactorList = this.getLowestChildren(this.factorList)
            .filter(n => this.queryForm.factorCodes.includes(n.factorCode));
        });
        this.getItemList();
      }
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post('surfacewater/infectantBy60/origin', {
        ...this.queryForm,
        sortBy: '0',
      }, {
        params: {
          page,
          rows,
        },
      }).then((response) => {
        if (response.data.success) {
          this.cellSpan1 = { spanArr: [], pop: [] };
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
        this.queryForm.portIds = this.getLowestChildren(this.portList).map(n => n.id);
        // this.onQueryList();
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取报警类别列表数据
    getFactorList() {
      this.$http.get('surfacewater/userFactor/getAuthorityTree').then((response) => {
        this.factorList = response.data.data;
        const nac = [];
        // 获取到所有的列表内容
        this.factorList.forEach((res) => {
          nac.push(res.children);
        });
        nac.forEach((res) => {
          const nav = res;
          nav.forEach((el) => {
            this.allfactorCode.push(el);
          });
        });
        this.allfactorCode.forEach((res) => {
          this.codeList.push(res.factorCode);
        });
        this.queryForm.factorCodes = this.codeList;
        this.onQueryList();
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 处理echarts图数据
    handleChartData(source) {
      source.forEach((chart) => {
        const series = [];
        chart.factorNames.forEach((factor, index) => {
          series.push({
            name: factor,
            type: 'line',
            stack: '总量',
            data: chart.datas[index].map(e => e - 0),
          });
        });
        this.$nextTick(() => {
          this.chartObj[chart.pointId] = echarts.init(this.$refs[chart.pointId] && this.$refs[chart.pointId][0]);
          this.chartObj[chart.pointId].setOption({
            title: {
              text: chart.pointName,
              left: 'center',
              top: '3%',
            },
            tooltip: {
              trigger: 'axis',
            },
            legend: {
              data: chart.factorNames,
              bottom: '2%',
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '10%',
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: chart.dateTimes || source[0].dateTimes,
            },
            yAxis: {
              type: 'value',
              name: chart.units[0] || '',
            },
            series,
          });
        });
        window.addEventListener('resize', () => {
          this.chartObj[chart.pointId].resize();
        });
      });
    },
    // 获取echarts图数据
    getChartData() {
      this.chartLoad = true;
      this.$http.post('surfacewater/infectantBy60/chart', this.queryForm)
        .then((response) => {
          if (response.data.success) {
            this.chartData = response.data.data || [];
            this.handleChartData(this.chartData);
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              showClose: true,
            });
          }
        }, (({ response }) => {
          analyzeResp(response);
        })).finally(() => {
          this.chartLoad = false;
        });
    },
    // 导出
    onExport() {
      this.downloading = true;
      this.$http.post('surfacewater/infectantBy60/export', this.queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        this.exportExcel(response.data);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 导出excel
    exportExcel(data) {
      const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      const filename = `原始数据${new Date().toLocaleDateString()}.xls`;
      const linkNode = document.createElement('a');
      linkNode.download = filename;
      linkNode.style.display = 'none';
      linkNode.href = URL.createObjectURL(blob);
      document.body.appendChild(linkNode);
      linkNode.click();
      URL.revokeObjectURL(linkNode.href);
      document.body.removeChild(linkNode);
    },
    getLowestChildren(val) {  // 获取数组最底层值集合
      const arr = [];
      val.forEach((item) => {
        if (item.children) {
          arr.push(...(this.getLowestChildren(item.children)));
        } else {
          arr.push(item);
        }
      });
      return arr;
    },
  },
};
</script>

<style>

</style>
