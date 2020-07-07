<template>
  <!-- 排放量情况 -->
  <section data-mod-margin data-mod-radius>
    <model-title :title="`排放情况（${year}）`" rightStr="unit" :rightValue="'立方米'" path="SewageApproval">
      <div class="charts">
        <div class="content">
          <div class="num" :title="depositAmount">{{depositAmount}}</div>
          <div class="text">充值总量</div>
        </div>
        <div ref="echarts" class="echarts"></div>
      </div>
      <div class="legend">
        <div style="flex:1;"></div>
        <div class="total">
          <div class="text">核定总量</div>
          <div class="num" :title="tpeciAmount">{{ tpeciAmount }}</div>
        </div>
        <div class="total">
          <div class="text">排放总量</div>
          <div class="num" :title="alreadyEmissions">{{ alreadyEmissions }}</div>
        </div>
        <div class="residue">
          <div class="text">剩余排放量</div>
          <div class="num" :title="surplusEmissions">{{ surplusEmissions }}</div>
        </div>
        <div style="flex:1;"></div>
      </div>
    </model-title>
  </section>
</template>

<script>
export default {
  // props: ['tpeciAmount', 'alreadyEmissions', 'surplusEmissions'],
  data() {
    return {
      tpeciAmount: 0,        // 核定总量
      depositAmount: 0,      // 充值总量
      alreadyEmissions: 0,   // 排放总量
      surplusEmissions: 0,   // 剩余排放量
      ratio: 0,              // echarts图占比,小数
      chart: {},             // echarts图对象
      year: '',              // 标题年份
    };
  },
  computed: {
    isFold() { return this.$store.state.isFold; },
    options() {
      return {
        tooltip: {
          trigger: 'item',
          formatter: `排放量占比：<br/>${this.ratio}%`,
        },
        series: [
          {
            name: '排放情况',
            type: 'pie',
            startAngle: 180,
            hoverAnimation: false,
            labelLine: {
              show: false,
            },
            label: {
              show: false,
            },
            radius: ['116%', '145%'],
            center: ['46%', '90%'],
            data: [
              {
                name: '充值总量',
                value: this.alreadyEmissions,
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      { offset: 0, color: '#66a6ff' },
                      { offset: 1, color: '#89f7fe' },
                    ],
                    global: false,
                  },
                },
              },
              {
                name: '剩余排放量',
                value: this.depositAmount - this.alreadyEmissions,
                itemStyle: {
                  color: '#EBF4F7',
                },
              },
              {
                name: '隐藏',
                value: this.depositAmount,
                itemStyle: {
                  color: 'rgba(0, 0, 0, 0)',
                },
              },
            ],
          },
        ],
      };
    },
  },
  watch: {
    isFold() {
      this.$nextTick(() => {
        setTimeout(() => { this.chart.resize(); }, 200);
      });
    },
  },
  mounted() {
    this.year = new Date().getFullYear().toString();
  },
  methods: {
    dealBefore(row) {    // 内容渲染前处理
      this.tpeciAmount = row.tpeciAmount;
      this.depositAmount = row.depositAmount;
      this.alreadyEmissions = row.alreadyEmissions;
      this.surplusEmissions = row.surplusEmissions;
      if (row.depositAmount) {
        this.ratio = (row.alreadyEmissions / row.depositAmount * 100).toFixed(2);
      } else {
        this.ratio = 0;
      }
      this.drawEcharts();
    },
    drawEcharts() {
      this.chart = this.$echarts.init(this.$refs.echarts);
      this.chart.clear();
      this.chart.setOption(this.options);
      window.addEventListener('resize', () => { this.chart.resize(); });
    },
  },
};
</script>

<style lang="scss" scoped>
.charts{
  float: left;
  width: 65%;
  height: 100%;
  position: relative;
  > .echarts{
    width: 100%;
    height: 100%;
  }
  > .content{
    position: absolute;
    bottom: 8%;
    left: 46%;
    transform: translateX(-50%);
    text-align: center;
    > .num{
      height: 25px;
      line-height: 35px;
      font-size: 22px;
      color: #477CFF;
      font-weight: bold;
      margin-bottom: 5px;
    }
    > .text{
      height: 20px;
      line-height: 20px;
      color: #B7BEC7;
      font-size: 12px;
    }
  }
}
.legend{
  float: left;
  width: 35%;
  // height: 100%;
  margin: -2px 0 -8px;
  display: flex;
  flex-direction: column;
  > div {
    margin: 2px 0;
    .text{
      height: 14px;
      line-height: 14px;
      font-size: 12px;
      position: relative;
      color: #B7BEC7;
      padding-left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &::before{
        content: '';
        position: absolute;
        top: 50%;
        left: 4px;
        transform: translateY(-50%);
        width: 5px;
        height: 5px;
        border-radius: 4px;
        background-color: #3978FE;
      }
    }
    .num{
      height: 22px;
      line-height: 22px;
      color: #477CFF;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 1px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  // > .residue{
  //   .text{
  //     height: 16px;
  //     line-height: 16px;
  //     font-size: 14px;
  //     position: relative;
  //     color: #B7BEC7;
  //     padding-left: 20px;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //     &::before{
  //       content: '';
  //       position: absolute;
  //       top: 50%;
  //       left: 4px;
  //       transform: translateY(-50%);
  //       width: 8px;
  //       height: 8px;
  //       border-radius: 4px;
  //       background-color: #8F9CAB;
  //     }
  //   }
  //   .num{
  //     height: 30px;
  //     line-height: 30px;
  //     color: #B7BEC7;
  //     font-size: 28px;
  //     font-weight: bold;
  //     letter-spacing: 1px;
  //     overflow: hidden;
  //     white-space: nowrap;
  //     text-overflow: ellipsis;
  //   }
  // }
}
</style>
