<template>
  <el-card type="title">
    <template slot="header">
      实时在线信息
    </template>
    <div ref="onlineInfo" style="height:100%"></div>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
// 引入 ECharts 主模块
import Echarts from 'echarts';

export default {
  name: 'OnlineInfo',
  mixins: [],
  components: {},
  data() {
    return {
      chart: null,
      onlineInfo: {},
    };
  },
  computed: {
    option() {
      return ({
        color: ['#97D25C', '#EA7B82'],
        title: {
          text: `${+this.onlineInfo.online + (+this.onlineInfo.offline) || 0}`,
          subtext: '总点位数',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 30,
            fontWeight: 'normal',
            color: ['#333'],
          },
          subtextStyle: {
            color: '#666',
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {d}% {c} 个',
        },
        series: [
          {
            name: '实时在线信息',
            type: 'pie',
            radius: ['50%', '80%'],
            label: {
              fontSize: 16,
              formatter: '{b}: {c} 个',
            },
            labelLine: {
              show: true,
              length: 40,
              length2: 20,
            },
            data: [
              { value: this.onlineInfo.online, name: '在线' },
              { value: this.onlineInfo.offline, name: '离线' },
            ],
          },
        ],
      });
    },
  },
  watch: {},
  created() {
    this.getOnlineInfo();
  },
  methods: {
    echartsInit() {
      this.chart = Echarts.init(this.$refs.onlineInfo);
      this.chart.setOption(this.option);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
    getOnlineInfo() {
      this.$http.get('surfacewater/portInfo/home')
        .then((response) => {
          if (response.data.success) {
            this.onlineInfo = response.data.data || {};
            this.echartsInit();
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'warning',
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
