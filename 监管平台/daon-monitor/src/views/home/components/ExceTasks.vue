<!-- 任务类型占比 -->
<template>
  <div class="TaskType">
    <span class="title"><img src="@/assets/img/zhanbi.png"/>任务类型占比</span>
    <div class="chart_class">
      <chart :option="option" v-show="!is_noData"/>
      <img class="no_data" src="@/assets/img/no_data.gif" v-show="is_noData"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getMask } from '@/api/modules/home.js';

export default {
  name: 'TaskType',
  data() {
    return {
      indexData: [],
      is_noData: true, // 没有数据
      option: {
        title: {
          text: '',
          left: 'center',
          top: 30,
        },
        color: [],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: '45%',
            center: ['50%', '50%'],
            top: 250,
            label: {
              formatter: val => `${val.name}：${val.value}\n${val.percent}%`,
            },
            data: [],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState('home', ['homeParams', 'companyName']),
  },
  watch: {
    homeParams: {
      handler() {
        this.getMaskData();
        this.option.title.text = this.companyName;
      },
      deep: true,
      immediate: true,
    },
    companyName(val) {
      this.option.title.text = val;
    },
  },
  methods: {
    // 转换类型
    SwtichType(val) {
      switch (val) {
        case 1:
          return ['日常运维', '#314452'];
        case 2:
          return ['校准校验', '#639EAC'];
        case 3:
          return ['数据对比', '#D38264'];
        case 4:
          return ['故障处理', '#C43531'];
        case 5:
          return ['质控相关', '#91C7AF'];
        case 6:
          return ['易耗品更换', '#749F81'];
        case 7:
          return ['在线运维', '#CA8623'];
        case 8:
          return ['工程建设验收', '#BAA298'];
        case 9:
          return ['升级改造', '#6F7074'];
        case 100:
          return ['其他', '#54656F'];
        default:
          return ['日常运维', '#314452'];
      }
    },
    getMaskData() {
      getMask(this.homeParams).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          const { data } = res.data;
          this.indexData = Object.keys(data);
          // eslint-disable-next-line
          this.is_noData = Object.values(data).every(val => !val);
          this.option.series[0].data = Object.keys(data).map(val => ({
            value: data[val],
            name: this.SwtichType(+val)[0],
          }));
          this.option.series[0].data = this.option.series[0].data.filter(val => val.value);
          this.option.color = [];
          Object.keys(data).forEach((val) => {
            this.option.color.push(this.SwtichType(+val)[1]);
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.TaskType {
  overflow: hidden;
  height: 100%;
  background: #fff;
  position: relative;
  >.title{
    position: absolute;
    top: 0;
    left: 0;
    font-weight: 600;
    color: #409eff;
    z-index: 1000;
    height: 50px;
    width: 100%;
    line-height: 50px;
    padding-left: 10px;
    border-bottom: 1px solid #f7f3f3;
    >img{
      color: #409eff;
      width: 20px;
      margin-right: 5px;
    }
  }
  .no_data{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
  }
}
.chart_class{
  height: 100%;
  width: 100%;
  position: absolute;
  top: 50px;
}
</style>
