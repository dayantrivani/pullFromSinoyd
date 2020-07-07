<template>
  <!-- 信访归口类型统计 -->
  <div style="height: 100%">
    <query-control @queryList="onQueryList"></query-control>
    <div ref="echart" style="height: calc(100% - 40px)" :class="{ 'empty-box': isEmpty }"></div>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import QueryControl from './QueryControl';

export default {
  name: 'CentralizedType',
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
        title: {
          text: '信访归口类型统计',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        legend: {
          left: 'center',
          bottom: 10,
          data: ['大气', '水', '噪声'],
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            data: [
              { value: 72, name: '大气' },
              { value: 46, name: '水' },
              { value: 22, name: '噪声' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
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
      this.$http.get('petition/petitionInfo/attributeQuantityChart', {
        params: { fromDate: this.queryForm.fromDate, toDate: this.queryForm.toDate },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data || {};
          this.isEmpty = data.x.length <= 0;
          this.option.legend.data = data.x || [];
          const series = [];
          for (let i = 0; i < data.x.length; i++) {
            series[i] = {
              name: data.x[i],
              value: data.y[i],
            };
          }
          this.option.series[0].data = series;
          if (this.isEmpty) this.option.series[0].data = [];
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
