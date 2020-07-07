<template>
  <!-- 监理任务数 -->
  <a-col :span="12" class="numSuperTasks">
    <a-card  class="busin_card recent_charts" :bordered="false">
      <template #title>
        <img class="title_img" src="@/assets/img/renwu1.png"/>
        <span class="title">监理任务数</span>
      </template>
      <div class="charts">
        <div v-if="!is_noData" style="height: 100%;position:relative">
          <chart :option="option"/>
        </div>
        <img class="no_data" src="@/assets/img/no_data.gif" v-else/>
      </div>
    </a-card>
  </a-col>
</template>

<script>
export default {
  name: 'numSuperTasks',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      is_noData: true, // 是否暂无数据
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        grid: {
          top: '4%',
        },
        color: ['#ED465A', '#61A0A8', '#f9db07'],
        legend: {
          orient: 'horizontal',
          data: ['督办任务', '例行检查', '协同检查'],
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            bottm: 50,
            center: ['50%', '70%'],
            data: [
              { value: 0, name: '督办任务' },
              { value: 0, name: '例行检查' },
              { value: 0, name: '协同检查' },
            ],
            label: {
              formatter: val => `${val.percent}%`,
            },
          },
        ],
      },
    };
  },
  watch: {
    data: {
      handler(val) {
        /* eslint-disable */
        this.option.series[0].data[0].value = val[3];
        this.option.series[0].data[1].value = val[1];
        this.option.series[0].data[2].value = val[2];
        this.is_noData = Object.values(val).every(val => !val);
        // const one = this.sum(Object.values(val)[3]);
        // const two = this.sum(Object.values(val)[1]);
        // const tre = this.sum(Object.values(val)[2]);
        // this.option.series[0].data[0].value = one;
        // this.option.series[0].data[1].value = two;
        // this.option.series[0].data[2].value = tre;
        // this.is_noData = [one, two, tre].every(val => !val);
      },
      deep: true,
    },
  },
  methods: {
    // 数组求和
    sum(arr) {
      return arr.reduce((pre, cur) => pre + cur);
    },
  },
};
</script>

<style lang="scss" scoped>
.numSuperTasks{
  height: 100%;
  .busin_card{
    height: 100%;
    .charts{
      height: 100%;
    }
  }
}
.title_img{
  width: 20px;
  margin-right: 5px;
}
.title{
  color: #409eff;
  font-weight: 600;
}
.no_data{
  width: 200px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
