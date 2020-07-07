<template>
  <el-card type="title">
    <template slot="header">
      72小时单参数变化趋势分析
    </template>
    <el-form :model="queryForm" inline class="mar-t-sm mar-l-sm">
      <el-form-item label="测点：">
        <select-port
          v-model="queryForm.portIds"
          filterable
          :options="portList"
          :props="{ label: 'name', value: 'id' }">
        </select-port>
      </el-form-item>
      <el-form-item label="监测因子：">
        <select-tree
          defaultExpandAll
          v-model="queryForm.factorCode"
          :props="props"
          :options="factorList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="getTrendData">查 询</el-button>
      </el-form-item>
    </el-form>
    <div ref="trendAnalysis" style="height:calc(100% - 43px)"></div>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import SelectPort from '@/components/select-port';
import Echarts from 'echarts';

export default {
  name: 'TrendAnalysis',
  mixins: [],
  components: { SelectPort },
  data() {
    return {
      chart: null,
      portList: [], // 排口/站点数据
      factorList: [], // 因子数据
      queryForm: {  //  查询表单
        portIds: [],
        factorCode: '',
      },
      unit: 'mg/L',
      xAxis: [],
      series: [],
      legend: [],
      props: {
        label: 'name',
        value: 'factorCode',
      },
    };
  },
  computed: {
    option() {
      return ({
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b}: {c}',
        },
        legend: {
          data: this.legend,
          bottom: 10,
        },
        grid: {
          top: 40,
          left: 60,
          right: 50,
        },
        xAxis: {
          type: 'category',
          data: this.xAxis,
        },
        yAxis: {
          type: 'value',
          name: this.unit,
        },
        series: this.series,
      });
    },
  },
  watch: {},
  created() {
    this.getPortList();
    this.getFactorList();
    this.getTrendData();
  },
  methods: {
    // 初始化echarts
    echartsInit() {
      this.chart = Echarts.init(this.$refs.trendAnalysis);
      this.chart.setOption(this.option, true);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
    // 获取图表数据
    getTrendData() {
      if (this.queryForm.portIds.length === 0 || this.queryForm.factorCode === '') return;
      this.$http.post('surfacewater/infectantBy60/graph24', this.queryForm)
        .then((response) => {
          if (response.data.success) {
            this.trendData = response.data.data || [];
            this.handleData(this.trendData);
            this.$nextTick(() => {
              this.echartsInit();
            });
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
    // 处理图表数据
    handleData(source) {
      // 解构 times 和 unit 的值
      const { date, unit } = source[0] || {};
      this.xAxis = date || [];
      this.unit = unit || '';
      this.series = source.map(item => ({ name: item.pointName, data: item.value, type: 'line' })) || [];
      this.legend = source.map(item => item.pointName) || [];
    },
    // 获取排口数据
    getPortList() {
      this.$http.get('surfacewater/userPort/getAuthorityTree')
        .then((response) => {
          if (response.data.success) {
            this.portList = response.data.data;
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
    // 获取因子数据
    getFactorList() {
      this.$http.get('surfacewater/userFactor/getAuthorityTree')
        .then((response) => {
          if (response.data.success) {
            this.factorList = response.data.data || [];
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
  },
};
</script>

<style lang="scss" scoped>
</style>
