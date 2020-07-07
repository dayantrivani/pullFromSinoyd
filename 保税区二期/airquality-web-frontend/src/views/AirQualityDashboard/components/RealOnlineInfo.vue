<template>
  <div class="fill-h pr" v-loading="loading">
    <div class="et-text">
      <div class="et-text_num">{{ sum }}</div>
      <div class="et-text-total">总站点数</div>
    </div>
    <div ref="echarts" class="fill-h"></div>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  props: {
    echartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      itemList: [],
      myChart: null,                            // 图表
      loading: false,                           // 表格数据加载状态,父级操控
      option: {
        toolbox: {                              // 工具栏,内置有五个工具(包含保存为图片)
          show: true,
          right: 0,
          top: 0,
          feature: {                            // 各工具配置项
            saveAsImage: {                      // 保存为图片配置
              excludeComponents: ['toolbox'],   // 保存为图片时忽略的组件列表，默认忽略工具栏
              pixelRatio: 2,                    // 保存图片的分辨率比例,设置为大于1的值,可以保存为更高分辨率
              emphasis: {                       // 强调
                iconStyle: {                    // 强调 - 保存为图片 icon 样式设置
                  textPosition: 'bottom',       // 文本位置
                  textAlign: 'right',           // 文本对齐方式
                },
              },
            },
          },
        },
        tooltip: {                              // 设置全局的提示框
          trigger: 'item',                      // 触发类型
          formatter: '{b}：{c}<br/>占比：{d}%',  // 提示框格式设置
        },
        color: ['#FF9F7F', '#37A2DA', '#FFDB5C', '#AEFDCA', '#8378EA', '#FB7293', '#E7BCF3',
          '#E5D15F', '#5FAF5F', '#2ED6E8', '#955231', '#D64883', '#B48E71'],
        series: [                               // 一个对象代表一组数据的图形展现
          {
            name: '访问来源',
            type: 'pie',
            hoverAnimation: false,
            radius: ['40%', '62%'],                      // 外圈半径,设置圆环时使用<array>,第一参数为内圈半径,另一个为外圈半径
            center: ['50%', '50%'],             // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
            data: [
              {
                value: 0,
                name: '离线',
                itemStyle: {
                  color: 'red',
                },
              },
              {
                value: 0,
                name: '在线',
                itemStyle: {
                  color: 'green',
                },
              },
            ],
            itemStyle: {                        // 图形样式
              shadowBlur: 0,                    // 图形阴影的模糊大小
              shadowColor: 'rgba(0, 0, 0, .5)', // 图形阴影的颜色
            },
            label: {                            // 鼠标悬浮扇形区文本展示样式设置
              position: 'outside',
              formatter: '{b}：{c} | 占比：{d}%',
            },
          },
        ],
      },
      sum: 0,
    };
  },
  methods: {
    createQuery() {
      this.getEchartData();
    },
    getEchartData() {
      this.$http.get('airquality/portInfo/home')
        .then((response) => {
          if (response.status === 200) {
            const res = response.data.data || {};
            this.sum = res.sum || '';
            const { data } = this.option.series[0];
            this.$set(data[0], 'value', res.offline);
            this.$set(data[1], 'value', res.online);
            this.drawLine();
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
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(this.$refs.echarts);
      // 重新绘制之前先清除上一次的绘图
      this.myChart.clear();
      // 绘制图表
      this.myChart.setOption(this.option);
      window.onresize = () => { this.myChart.resize(); };
    },
  },
};
</script>

<style lang="scss" scoped>
.pr {
  position: relative;
}
.et-text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  color: rgb(187, 167, 53);
  text-align: center;
  .et-text_num{
    font-size: 30px;
  }
  .et-text_total{
    font-size: 14px;
  }
}
</style>
