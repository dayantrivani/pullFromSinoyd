<template>
  <!-- 扇形进度条 -->
  <div class="echarts-pie-progress">
    <div ref="EchartsPieProgress"></div>
    <div>
      <div class="title-box">
        <div class="title">{{title}}</div>
        <div class="subtitle">{{subtitle}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EchartsPieProgress',
  props: {
    value: {
      default: 0,
      type: [String, Number],
    },
    title: {
      default: '',
      type: [String, Number],
    },
    subtitle: {
      default: '',
      type: [String, Number],
    },
    showLabel: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    const echarts = this.$echarts;
    return {
      options: {
        series: [{
          type: 'pie',
          hoverAnimation: false,
          radius: ['100%', '100%'],
          center: ['50%', '70%'],
          startAngle: 180,
          itemStyle: {
            borderWidth: 10,
            shadowColor: '#0093ee', // 默认透明
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 10,
            opacity: 1,
          },
          labelLine: {
            show: false,
          },
          cursor: 'normal',
          data: [{
            name: '',
            value: 100,
            itemStyle: {
              normal: {
                color: '#f00',
                borderColor: '#162a55',
              },
            },
          }, {
            name: '',
            value: 100,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: 'transparent',
              },
            },
          }],
        }, {
          type: 'pie',
          hoverAnimation: false,
          radius: ['100%', '100%'],
          center: ['50%', '70%'],
          startAngle: 180,
          itemStyle: {
            borderWidth: 10,
            borderColor: new echarts.graphic.LinearGradient(0, 1, 1, 0, [{
              offset: 0,
              color: '#4015e0',
            }, {
              offset: 1,
              color: '#129ff7',
            }]),
          },
          labelLine: {
            show: false,
          },
          cursor: 'normal',
          z: 3,
          data: [{
            name: '',
            value: 10,
            label: {
              show: true,
              position: 'inside',
              formatter: () => `${this.value}%`,
              fontSize: 10,
              // textShadowColor: '#fff',
              // textShadowBlur: 5,
            },
            itemStyle: {
              normal: {
                color: 'transparent',
              },
            },
          }, {
            name: '',
            value: 10,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: 'transparent',
              },
            },
          }],
        }],
      },
    };
  },
  computed: {
    dataArr() {
      const dataArr = [0, 100];
      dataArr[0] = this.value / 2;
      dataArr[1] = 100 - dataArr[0];
      return dataArr;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawScatter();
    });
  },
  methods: {
    drawScatter() {
      const myChart = this.$echarts.init(this.$refs.EchartsPieProgress);
      myChart.clear();
      if (!this.$tools.IEVersion()) {
        this.options.series[1].data[0].label.textShadowColor = '#fff';
        this.options.series[1].data[0].label.textShadowBlur = '5';
      }
      [this.options.series[1].data[0].value, this.options.series[1].data[1].value] = this.dataArr;
      this.options.series[1].data[0].label.show = this.showLabel;
      myChart.setOption(this.options);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.echarts-pie-progress {
  position: relative;
  width: 100%;
  height: 100%;
  >div {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    >.title-box {
      position: absolute;
      top: 65%;
      width: 100%;
      transform: translateY(-50%);
      text-align: center;
      >.title {
        font-size: 0.14rem;
        color: #3396fb;
      }
      >.subtitle {
        font-size: 0.1rem;
        color: #ccc;
      }
    }
  }
}
</style>
