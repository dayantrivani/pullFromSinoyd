<!-- 数据查询 -->
<template>
  <el-card>
    <!-- <template slot="header"> -->
    <el-form :model="queryForm" inline class="fn-no-wrap mar-t-xs mar-l-sm">
      <el-form-item label="测点：">
        <tree-select
          v-model="queryForm.monitoringPointUid"
          isCheckAll
          defaultExpandAll
          :options="stationList"
          :props="{ value: 'id', label: 'name', children: 'children' }"
          @getTreeData="getPointData"
        ></tree-select>
      </el-form-item>
      <el-form-item label="监测因子：" v-show="activeName === 'list'">
        <tree-select
          ref="treeselectfactor"
          v-model="queryForm.pollutantCode"
          :options="factorList"
          :props="{ value: 'factorCode', label: 'name', children: 'children' }"
          @getTreeData="getPollutantData"
        ></tree-select>
      </el-form-item>
      <el-form-item label="排序：">
        <el-select v-model="queryForm.sortBy">
          <el-option :value="1" label="时间正序"></el-option>
          <el-option :value="0" label="时间倒序"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="数据类型：">
          <el-select v-model="dataType">
            <el-option :value="10" label="十分钟"></el-option>
            <el-option :value="60" label="一小时"></el-option>
      </el-select>-->
      <!-- </el-form-item> -->
      <el-form-item label="开始时间：">
        <el-date-picker
          style="width: 140px"
          v-model="fromDate"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          :picker-options="pickStart"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker
          style="width: 140px"
          v-model="toDate"
          type="date"
          value-format="yyyy-MM-dd 23:59:59"
          :picker-options="pickEnd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <!-- </template> -->
    <el-tabs v-model="activeName" type="border-card" @tab-click="toggleTab">
      <el-tab-pane label="列表" name="list" lazy>
        <el-button
          type="primary"
          icon="fas fa-download"
          class="mar-y-xs mar-l-sm"
          :loading="downloading"
          @click="onExport"
        >导出 Excel</el-button>
        <el-table
          border
          highlight-current-row
          height="calc(100% - 70px)"
          v-loading="loading"
          :data="itemList"
          @selection-change="onChangeSelected"
        >
          <el-table-column fixed align="center" :index="index" label="No." width="50" type="index"></el-table-column>
          <el-table-column
            fixed
            label="测点"
            prop="monitoringPointName"
            min-width="180"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column fixed label="日期" prop="tstamp" min-width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-show="scope.row.tstamp !== '1900-01-01 00:00:00'">{{ scope.row.tstamp }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item) in dynamicCol"
            align="center"
            :key="item.id"
            :prop="item.factorCode"
            :min-width="140"
          >
            <template slot="header" slot-scope="{ row }">
              <p>{{ item.name }}</p>
              <p>({{ item.unit }})</p>
              <span v-show="false">{{ row }}</span>
            </template>
            <template slot-scope="{ row }">
              <span
                :class="{ 'text-danger': isRed(row[item.factorCode]) }"
              >{{ isOut(row[item.factorCode]) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <paging-query :pageSize="[24, 48, 96]" :pager="pager" @query="getItemList"></paging-query>
      </el-tab-pane>
      <el-tab-pane label="图表" name="chart">
        <el-form label-width="80px" inline>
          <el-form-item label="监测因子：">
            <tree-select
              ref="echartTreeselectfactor"
              v-model="echartPollutantCode"
              :options="factorList"
              :props="{ value: 'factorCode', label: 'name', children: 'children' }"
              @getTreeData="getPollutantData"
            ></tree-select>
          </el-form-item>
        </el-form>
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
// import { queryList } from '@/global/libs/mixins';
import echarts from 'echarts';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { getDay } from '@/libs/tools';
import { analyzeResp } from '@/global/libs/util';
import TreeSelect from '@/components/select-tree';

export default {
  name: 'QueryData',
  // mixins: [queryList],
  components: {
    TreeSelect,
  },
  data() {
    return {
      activeName: 'list',
      // dataType: 10,
      loading: false,
      chartLoad: false,
      downloading: false,
      pickStart: {
        disabledDate: (time) => {
          if (this.queryForm.toDate === '' || this.queryForm.toDate === null) {
            return time.getTime() > Date.now();
          }
          return time.getTime() > new Date(this.queryForm.toDate).getTime();
        },
      },
      pickEnd: {
        disabledDate: time => time.getTime() < new Date(this.queryForm.fromDate).getTime()
          || time.getTime() > Date.now(),
      },
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
      queryForm: {
        monitoringPointUid: [],
        pollutantCode: [],
        fromDate: getDay(-1),
        toDate: getDay(0, true, true),
        sortBy: 0,
      },
      echartPollutantCode: [], // echart图监测因子选择
      chartData: [],
      chartObj: {},
      itemList: [], // 列表数据
      stationList: [],  // 测点数据
      factorList: [],  //  因子数据
      dynamicCol: [],
    };
  },
  computed: {
    fromDate: {
      get() {
        return this.queryForm.fromDate === '1900-01-01 00:00:00'
          ? ''
          : this.queryForm.fromDate;
      },
      set(val) {
        this.queryForm.fromDate = val || '1900-01-01 00:00:00';
      },
    },
    toDate: {
      get() {
        return this.queryForm.toDate === '1900-01-01 00:00:00'
          ? ''
          : this.queryForm.toDate;
      },
      set(val) {
        this.queryForm.toDate = val || '1900-01-01 00:00:00';
      },
    },
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.pollutantCode': function () {
      this.onQueryList();
    },
    echartPollutantCode() {
      if (this.activeName === 'chart') {
        this.getChartData();
      }
    },
  },
  created() {
    this.getStation();
    this.getFactor();
    // this.onQueryList();
  },
  mounted() { },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    /** 特殊方法 */
    isRed(val) {                   // 因子是否显示为红色
      return typeof val === 'string' ? val.includes('red') : false;
    },
    isOut(val) {                   // 因子显示的值
      return this.isRed(val) ? val.split(':')[1] : val;
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
          }, true);
        });
        window.addEventListener('resize', () => {
          this.chartObj[chart.pointId].resize();
        });
      });
    },
    // 获取echarts图数据
    getChartData() {
      this.chartLoad = true;
      this.$http.post('airquality/infectantBy60/chart', { ...this.queryForm, pollutantCode: this.echartPollutantCode })
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
      // eslint-disable-next-line
      const { monitoringPointUid, pollutantCode, fromDate, toDate } = this.queryForm;
      this.$http.post('airquality/infectantBy60/export', {
        monitoringPointUid, pollutantCode, fromDate, toDate,
      }, { 'responseType': 'blob' })
        .then((response) => {
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
    onChangeSelected() { },
    onQueryList() {
      if (this.activeName === 'chart') {
        this.getChartData();
      } else {
        this.pager.page = 1;
        this.dynamicCol = [];
        this.getItemList();
        this.handleTabelData();
      }
    },
    handleTabelData() {
      if (!this.queryForm.pollutantCode.length) { return; }
      /**
       * 通过已选择的因子id取出该因子的name, factorCode,unit 属性
       */
      const temp = this.queryForm.pollutantCode.map(
        code => this.factorList.map(
          factor => factor.children.find(child => child.factorCode === code)
        )
      );
      // this.dynamicCol = temp.map(row => row.filter(e => e !== undefined)).flat(Infinity); IE不兼容flat方法
      this.dynamicCol = temp.map(row => row.filter(e => e !== undefined)).map(n => n[0]);
    },
    // 获取树形下拉框的数据
    getPollutantData() { },
    getPointData() { },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      // const origin = this.dataType === 10 ? '' : 'origin';
      this.$http.post('airquality/infectantBy60/origin', this.queryForm, {
        params: { page, rows },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
    // 全选测点
    setStationValue(arr) {
      if (!arr.length) { return; }
      arr.forEach((ele) => {
        if (!ele.children) { this.queryForm.monitoringPointUid.push(ele.id); }
        ele.children.forEach((e) => {
          this.queryForm.monitoringPointUid.push(e.id);
        });
      });
    },
    // 获取测点数据
    getStation() {
      this.$http.get('airquality/userPort/getAuthorityTree')
        .then((response) => {
          if (response.data.success) {
            this.stationList = response.data.data;
            this.setStationValue(this.stationList);
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
    // 默认选中常规因子
    setFactorValue(arr) {
      if (!arr.length) { return; }
      arr.forEach((item) => {
        if (item.name !== '气象参数') {
          this.$refs.treeselectfactor.onClickNode(item || {});
        }
        if (item.name === '常规参数') {
          this.$refs.echartTreeselectfactor.onClickNode(item || {});
        }
      });
      // arr.find(ele => ele.name === '常规参数').children.forEach((e) => {
      //   this.queryForm.pollutantCode.push(e.factorCode);
      // });
    },
    // 获取因子数据
    getFactor() {
      this.$http.get('airquality/userFactor/getAuthorityTree')
        .then((response) => {
          if (response.data.success) {
            this.factorList = response.data.data;
            this.setFactorValue(this.factorList);
          } else {
            this.$message.warning({
              message: response.data.msg,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
    toggleTab(tab) {
      if (tab.name === 'chart') {
        this.getChartData();
      }
    },
  },
};
</script>
