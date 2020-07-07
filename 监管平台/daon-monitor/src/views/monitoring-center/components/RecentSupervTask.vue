<template>
  <!-- 近期监理一览 -->
  <a-card :bordered="false" class="recent_charts">
    <template #title>
      <img class="title_img" src="@/assets/img/liulanqi1.png"/>
      <span class="title">近期监理一览</span>
    </template>
    <chart :option="option"/>
  </a-card>
</template>

<script>

export default {
  name: 'RecentSupervTask',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        color: ['#ED465A', '#61A0A8', '#f9db07', '#482983'],
        legend: {
          data: ['督办任务', '例行检查', '协同检查'],
          right: 0,
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '4%',
          bottom: '12%',
        },
        xAxis: [
          {
            type: 'category',
            data: [],
          },
        ],
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#C8C8C8',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#EDEDED',
            },
          },
        },
        series: [
          {
            name: '督办任务',
            type: 'bar',
            barWidth: 16,
            barGap: '10%',
            stack: '任务',
            // itemStyle: {
            //   normal: {
            //     barBorderRadius: 12,
            //   },
            // },
            data: [],
          },
          {
            name: '例行检查',
            type: 'bar',
            barWidth: 16,
            barGap: '10%',
            stack: '任务',
            // itemStyle: {
            //   normal: {
            //     barBorderRadius: 12,
            //   },
            // },
            data: [],
          },
          {
            name: '协同检查',
            type: 'bar',
            barWidth: 16,
            barGap: '10%',
            stack: '任务',
            // itemStyle: {
            //   normal: {
            //     barBorderRadius: 12,
            //   },
            // },
            data: [],
          },
          {
            name: '总和',
            type: 'line',
            symbolSize: 20,
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    data: {
      handler(val) {
        /* eslint-disable */
        this.option.series[0].data = val[3];
        this.option.series[1].data = val[1];
        this.option.series[2].data = val[2];
        this.option.xAxis[0].data = val[0];
        this.option.series[3].data = this.option.series[0].data.map((val, index) =>
          val + this.option.series[1].data[index] + this.option.series[2].data[index]);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.recent_charts{
  // >.ant-card-head{
  //   border: none;
  // }
  .ant-card-head-title{
    user-select: none;
  }
}
</style>

<style lang="scss" scoped>
.recent_charts{
  height: calc(50% - 70px);
  margin-top: 10px;
}
.title_img{
  width: 20px;
  margin-right: 5px;
}
.title{
  color: #409eff;
  font-weight: 600;
}
</style>
