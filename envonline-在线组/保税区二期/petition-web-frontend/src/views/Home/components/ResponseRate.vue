<template>
  <!-- 信访按时回复率统计 -->
  <div style="height: 100%">
    <query-control @queryList="onQueryList"></query-control>
    <div ref="echart" style="height: calc(100% - 40px)" :class="{ 'empty-box': isEmpty }"></div>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import QueryControl from './QueryControl';

export default {
  name: 'ResponseRate',
  components: {
    QueryControl,
  },
  data() {
    return {
      isEmpty: false, // 标记echarts是否有数据渲染
      queryForm: {
        fromDate: `${new Date().getFullYear()}-01-01`,
        toDate: `${new Date().getFullYear()}-12-01`,
      },
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        legend: {
          left: 'center',
          bottom: 10,
          data: ['保税区管委会', '生态环境局', '全部'],
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} %',
            },
          },
          // {
          //   type: 'value',
          //   min: 0,
          //   max: 25,
          //   interval: 5,
          //   axisLabel: {
          //     formatter: '{value} °C',
          //   },
          // },
        ],
        series: [
          {
            name: '保税区管委会',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          },
          {
            name: '生态环境局',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          },
          {
            name: '全部',
            type: 'line',
            // yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
          },
        ],
      },
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    onQueryList(queryForm) {
      this.queryForm = { ...queryForm };
      this.getItemList();
    },
    // 查询趋势数据
    getItemList() {
      this.$http.get('petition/petitionInfo/replyQuantityChart', {
        params: { fromDate: this.queryForm.fromDate, toDate: this.queryForm.toDate },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data || {};
          this.isEmpty = data.xDate.length <= 0;
          this.option.xAxis[0].data = data.xDate;
          this.option.series[0].data = data.man;
          this.option.series[1].data = data.env;
          this.option.series[2].data = data.all;
          this.$nextTick(() => {
            this.drawEchart();
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    drawEchart() {
      const myChart = this.$echarts.init(this.$refs.echart);
      myChart.clear();
      myChart.setOption(this.option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style>

</style>
