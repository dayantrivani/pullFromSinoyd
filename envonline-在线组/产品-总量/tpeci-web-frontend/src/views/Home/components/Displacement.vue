<template>
  <!-- 出口/入口排水量 -->
  <el-row class="fill-h">
    <el-col :span="24" :h="6">
      <section data-mod-margin data-mod-radius>
        <model-title title="进口排水量" rightStr="select">
          <div class="charts" ref="enterCharts"></div>
          <div class="content">
            <div style="flex: 1;"></div>
            <div class="title-icon">总排水量</div>
            <div class="num" title="985140">985140</div>
            <div class="unit">立方米</div>
            <div style="flex: 1;"></div>
          </div>
        </model-title>
      </section>
    </el-col>
    <el-col :span="24" :h="6" class="mar-t-xs">
      <section data-mod-margin data-mod-radius>
        <model-title title="出口排水量" rightStr="select">
          <div class="charts" ref="outCharts"></div>
          <div class="content">
            <div style="flex: 1;"></div>
            <div class="title-icon">总排水量</div>
            <div class="num" title="985140">985140</div>
            <div class="unit">立方米</div>
            <div style="flex: 1;"></div>
          </div>
        </model-title>
      </section>
    </el-col>
  </el-row>
</template>

<script>

export default {
  data() {
    return {
      enterCharts: {},
      outCharts: {},
      options: {
        series: [{
          color: ['#A1DFFC', '#50C5FD', '#3FBFFD'],
          center: ['50%', '50%'],
          radius: '80%',
          type: 'liquidFill',
          data: [0.5, 0.5, 0.5],
          backgroundStyle: {
            color: '#FFFFFF',
            shadowBlur: 10,
            shadowColor: '#A3E0FC',
          },
          itemStyle: {
            shadowBlur: 0,
          },
          outline: {
            show: false,
            // borderDistance: 0,
            // itemStyle: {
            //   borderWidth: 1,
            //   borderColor: '#A3E0FC',
            //   shadowBlur: 10,
            //   shadowColor: '#A3E0FC',
            // },
          },
          label: {
            // formatter: `${(0.5 * 100).toFixed(2)}%`,
            textStyle: {
              color: '#ffffff',
              insideColor: '#FFFFFF',
              fontSize: 20,
            },
            formatter: '50%',
            position: ['50%', '80%'],
          },
        }],
      },
    };
  },
  computed: {
    isFold() { return this.$store.state.isFold; },
  },
  watch: {
    isFold() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.enterCharts.resize();
          this.outCharts.resize();
        }, 200);
      });
    },
  },
  mounted() {
    this.drawEcharts('enterCharts');
    this.drawEcharts('outCharts');
  },
  methods: {
    drawEcharts(el) {
      this[el] = this.$echarts.init(this.$refs[el]);
      this[el].clear();
      this[el].setOption(this.options);
      window.addEventListener('resize', () => { this[el].resize(); });
    },
  },
};
</script>

<style lang="scss" scoped>
section[data-mod-margin][data-mod-radius]{
  width: calc(100% - 2.5px);
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  margin-left: 2.5px;
  .charts{
    float: left;
    width: 50%;
    height: 100%;
  }
  .content{
    float: left;
    width: 50%;
    height: 100%;
    letter-spacing: 1px;
    padding: 0 0px 0 20px;
    display: flex;
    flex-direction: column;
    .title-icon{
      display: flex;
      align-items: flex-end;
      width: 100%;
      height: 20px;
      color: #708388;
      font-size: 17px;
      font-weight: bold;
      margin-bottom: 10px;
      position: relative;
      &::after{
        position: absolute;
        bottom: 3px;
        left: 77px;
        content: '';
        display: inline-block;
        border-top: 4px solid #FFF;
        border-right: 4px solid #708388;
        border-left: 4px solid #FFF;
        border-bottom: 4px solid #708388;
      }
    }
    .num{
      width: 100%;
      height: 42px;
      line-height: 42px;
      font-size: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #3FBFFD;
    }
    .unit{
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-family: "黑体";
      font-size: 16px;
      color: rgb(186, 203, 211);
    }
  }
}
</style>
