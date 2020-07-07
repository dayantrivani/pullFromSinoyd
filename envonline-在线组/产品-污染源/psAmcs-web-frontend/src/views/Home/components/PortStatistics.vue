<template>
  <!-- 排口统计信息饼图 -->
  <el-row class="fill-h">
    <el-col :span="8">
      <div class="fill" ref="onlineRate"></div>
    </el-col>
    <el-col :span="8">
      <div class="fill" ref="networkRate"></div>
    </el-col>
    <el-col :span="8">
      <div class="fill" ref="enableRate"></div>
    </el-col>

    <dialog-item ref="dialog"/>
  </el-row>
</template>

<script>
import DialogItem from './DialogItem';

export default {
  name: 'PortStatistics',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: {
    DialogItem,
  },
  data() {
    return {
      onlineChart: null,
      networkChart: null,
      enableChart: null,
    };
  },
  computed: {
    onlineOption() {
      return ({
        color: ['#5B9BD5', '#ED7D31'],
        title: {
          text: '在线率',
          x: 'center',
          y: 40,
          textStyle: {
            fontSize: 18,
            color: '#999',
          },
        },
        legend: {
          left: 'center',
          bottom: 40,
          selectedMode: false,
          data: ['在线', '离线'],
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            hoverAnimation: false,
            slient: true,
            startAngle: 180,
            avoidLabelOverlap: false,
            radius: ['50%', '60%'],
            center: ['50%', '50%'],
            labelLine: {
              show: false,
            },
            data: [
              {
                value: +(this.data.onlineRate.toString().replace(/.00%/, '')),
                name: '在线',
                label: {
                  show: true,
                  position: 'center',
                  rich: {
                    a: {
                      color: '#64AAEA',
                      align: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: '方正粗倩_GBK',
                    },
                    b: {
                      color: '#08a0df',
                      align: 'center',
                      fontSize: 16,
                    },
                    c: {
                      fontSize: 10,
                      fontFamily: '方正粗倩_GBK',
                      fontWeight: 'bold',
                    },
                  },
                  formatter(params) {
                    return `{a|${params.value}}{c|%}\n\n{b|在线率}`;
                  },
                },
                labelLine: {
                  show: false,
                },
              },
              {
                value: 100 - this.data.onlineRate.replace(/.00%/, ''),
                name: '离线',
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            ],
          },
        ],
      });
    },
    networkOption() {
      return ({
        color: ['#5B9BD5', '#ED7D31'],
        title: {
          text: '联网率',
          x: 'center',
          y: 40,
          textStyle: {
            fontSize: 18,
            color: '#999',
          },
        },
        legend: {
          left: 'center',
          bottom: 40,
          selectedMode: false,
          data: ['联网', '未联网'],
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            hoverAnimation: false,
            slient: true,
            startAngle: 180,
            avoidLabelOverlap: false,
            radius: ['50%', '60%'],
            center: ['50%', '50%'],
            labelLine: {
              show: false,
            },
            data: [
              {
                value: +this.data.netWorkingRate.replace(/.00%/, ''),
                name: '联网',
                label: {
                  show: true,
                  position: 'center',
                  rich: {
                    a: {
                      color: '#64AAEA',
                      align: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: '方正粗倩_GBK',
                    },
                    b: {
                      color: '#08a0df',
                      align: 'center',
                      fontSize: 16,
                    },
                    c: {
                      fontSize: 10,
                      fontFamily: '方正粗倩_GBK',
                      fontWeight: 'bold',
                    },
                  },
                  formatter(params) {
                    return `{a|${params.value}}{c|%}\n\n{b|联网率}`;
                  },
                },
                labelLine: {
                  show: false,
                },
              },
              {
                value: 100 - this.data.netWorkingRate.replace(/.00%/, ''),
                name: '未联网',
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            ],
          },
        ],
      });
    },
    enableOption() {
      return ({
        color: ['#5B9BD5', '#ED7D31'],
        title: {
          text: '启用率',
          x: 'center',
          y: 40,
          textStyle: {
            fontSize: 18,
            color: '#999',
          },
        },
        legend: {
          left: 'center',
          bottom: 40,
          selectedMode: false,
          data: ['启用', '停用'],
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            hoverAnimation: false,
            slient: true,
            startAngle: 180,
            avoidLabelOverlap: false,
            radius: ['50%', '60%'],
            center: ['50%', '50%'],
            labelLine: {
              show: false,
            },
            data: [
              {
                value: +this.data.enablingRate.replace(/.00%/, ''),
                name: '启用',
                label: {
                  show: true,
                  position: 'center',
                  rich: {
                    a: {
                      color: '#64AAEA',
                      align: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                      fontFamily: '方正粗倩_GBK',
                    },
                    b: {
                      color: '#08a0df',
                      align: 'center',
                      fontSize: 16,
                    },
                    c: {
                      fontSize: 10,
                      fontFamily: '方正粗倩_GBK',
                      fontWeight: 'bold',
                    },
                  },
                  formatter(params) {
                    return `{a|${params.value}}{c|%}\n\n{b|启用率}`;
                  },
                },
                labelLine: {
                  show: false,
                },
              },
              {
                value: 100 - this.data.enablingRate.replace(/.00%/, ''),
                name: '停用',
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            ],
          },
        ],
      });
    },
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.echartsInit(this.onlineChart, 'onlineRate', this.onlineOption);
          this.echartsInit(this.networkChart, 'networkRate', this.networkOption);
          this.echartsInit(this.enableChart, 'enableRate', this.enableOption);
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    echartsInit(target, dom, option) {    // 绘制echarts图表
      target = this.$echarts.init(this.$refs[dom]);
      target.clear();
      target.setOption(option);
      window.addEventListener('resize', () => {
        target.resize();
      });
    },
    openDialog() {                        // 打开离线数据对话框
      this.$refs.dialog.openDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
