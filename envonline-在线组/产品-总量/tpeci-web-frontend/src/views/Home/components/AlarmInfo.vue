<template>
  <!-- 报警信息 -->
  <section data-mod-margin data-mod-radius>
    <model-title title="报警信息" rightStr="clocks" :rightValue="titleTstamp" path="AlarmRecord">
      <div class="charts" ref="echarts"></div>
      <div class="alarmInfo">
        <ul class="list" ref="list">
          <li v-for="(item,index) in alarmRecord" :key="index">
            <div class="icon-text"><div class="icon"></div>{{ item.alarmTstamp }}</div>
            <div class="content">{{ item.alarmContent }}</div>
          </li>
        </ul>
        <div class="decoration"></div>
      </div>
    </model-title>
  </section>
</template>

<script>
export default {
  data() {
    return {
      titleTstamp: '',
      alarmInfo: [],
      alarmRecord: [],
      tstamp: [],           // 日期
      over: [],             // 柱状图数据
      other: [],            // 折线图数据
      chart: {},
      scorll: null,         // 自动滚动的计时器名称
    };
  },
  computed: {
    isFold() { return this.$store.state.isFold; },
    options() {
      return {
        color: ['#7C6AF6'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          show: true,
          left: 40,
          top: 0,
          itemGap: 10,
          data: [
            { name: '超标' },
            { name: '其他' },
          ],
        },
        grid: {
          left: '60',
          right: '8',
          bottom: '30',
          top: '30',
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F9F9F9',
              },
            },
            axisLine: {
              lineStyle: {
                color: '#F9F9F9',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#B9B9B9',
              formatter(value) {
                return `${value.slice(-2)}`;
              },
            },
            data: this.tstamp,
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F9F9F9',
              },
            },
            axisLine: {
              lineStyle: {
                color: '#F9F9F9',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: '#B9B9B9',
              margin: 20,
            },
          },
        ],
        series: [
          {
            name: '超标',
            type: 'bar',
            barMaxWidth: '30',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#FA6C54',
                }, {
                  offset: 1, color: '#ED5564',
                }],
                global: false,
              },
              barBorderRadius: [50, 50, 0, 0],
            },
            data: this.over,
          },
          {
            name: '其他',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              color: '#7C6AF6',
              shadowBlur: 5,
              shodowColor: '#7C6AF6',
              shadowOffsetX: 3,
              shadowOffsetY: 3,
            },
            // areaStyle: {
            //   color: {
            //     type: 'linear',
            //     x: 0,
            //     y: 0,
            //     x2: 0,
            //     y2: 1,
            //     colorStops: [{
            //       offset: 0, color: '#C4C0F6',
            //     }, {
            //       offset: 1, color: '#ffffff',
            //     }],
            //     global: false,
            //   },
            //   shadowColor: '#B8AFF7',
            //   shadowOffsetY: 2,
            //   shadowBlur: 10,
            // },
            data: this.other,
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
  created() {
    const now = new Date();
    const old = new Date(new Date().getTime() - 6 * 24 * 3600 * 1000);
    const nowFormat = this.$tools.formatDate(now, 'Y年m月d日');
    const oldFormat = this.$tools.formatDate(old, 'Y年m月d日');
    this.titleTstamp = `${oldFormat} - ${nowFormat}`;
  },
  methods: {
    dealBefore(row) {
      this.alarmInfo = row.alarmInfo || [];
      this.tstamp = this.alarmInfo.map(item => item.alarmTstamp);
      this.over = this.alarmInfo.map(item => +item.overAlarm);
      this.other = this.alarmInfo.map(item => +item.otherAlarm);
      this.alarmRecord = row.alarmRecord || [];
      this.drawEcharts();
      this.autoLoop();
    },
    autoLoop() {     // 自动滚动效果
      /*
        scrollHeight: 指元素的内容高度，即如果有滚动条，它的值会等于内容实际高度加padding，
          并不包含border和margin,在没有内容溢出的情况下它的值等于clientHeight
        clientHeight: 指的是元素的内部高度的px值，包括content和padding值之和，并不包含横向
          滚动条（horizontal scrollbar）、border和margin的值。
      */
      this.$nextTick(() => {
        const e = this.$refs.list;
        if (e.scrollHeight > e.clientHeight) {
          // 含有滚动条
          this.scroll = setInterval(() => {
            e.scrollTop++;
            if (e.scrollTop + e.clientHeight >= e.scrollHeight) {
              e.scrollTop = 0;
            }
          }, 50);
          e.onmouseenter = () => {
            if (this.scroll) {
              clearInterval(this.scroll);
            }
          };
          e.onmouseleave = () => {
            this.scroll = setInterval(() => {
              e.scrollTop++;
              if (e.scrollTop + e.clientHeight >= e.scrollHeight) {
                e.scrollTop = 0;
              }
            }, 50);
          };
        }
      });
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
.charts {
  height: calc(100% + 15px);
  width: 62.5%;
  margin: 0 5px 0px -15px;
  float: left;
}
.alarmInfo {
  float: left;
  height: 100%;
  width: 37.5%;
  margin-right: -15px;
  position: relative;
  ul {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    margin: 0px -15px 0 0;
    overflow: auto;
    > li {
      border: 1px solid #ebeef5;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      margin: 5px;
      padding: 10px;
      border-radius: 6px;
      > .icon-text {
        font-size: 12px;
        line-height: 20px;
        color: #B1BBC9;
        > .icon {
          float: left;
          margin: 3px 5px 5px 0px;
          width: 12px;
          height: 12px;
          background: url('/img/home/time.png');
          background-size: 100% 100%;
        }
      }
      > .content {
        color: #596777;
        font-size: 14px;
        font-weight: bold;
        line-height: 16px;
        letter-spacing: 0px;
      }
    }
  }
  .decoration {
    width: 118px;
    height: 53px;
    position: absolute;
    top: 15px;
    right: -28px;
    transform: translateY(-50%);
    background: url('/img/home/decor.png');
    z-index: 2;
  }
}
</style>
