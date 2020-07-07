/**
 * @description 图表组件
 * @rely echarts lodash/debounce resize-detector
 */

// 按需加载，用到什么引什么
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/map';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/visualMap';

import debounce from 'lodash/debounce';
import { addListener, removeListener } from 'resize-detector';

// 获取 dom 元素属性
const getElemAttrVal = (elem, attrName = 'height') => {
  const oStyle = elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem, null);
  const attrValue = oStyle[attrName]
    ? oStyle[attrName]
    : oStyle[oStyle.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](attrName);
  return parseFloat(attrValue);
};

export default {
  name: 'Chart',
  render() {
    return (
      // 用容器元素包裹以实现宽高自适应
      <div class="chart-wrap" ref="chartWrap" style={`width: ${this.width}; height: ${this.height}`}>
        <div ref="chartDom" style="height: 100%"></div>
      </div>
    );
  },
  props: {
    // echart 配置项
    option: {
      type: Object,
      default: () => {},
    },
    // 图表宽度
    width: {
      default: '100%',
    },
    // 图表高度
    height: {
      default: '100%',
    },
  },
  data() {
    return {
      echarts,
    };
  },
  watch: {
    // 深度监听数据变化
    option: {
      handler(val) {
        this.chart.setOption(val);
      },
      deep: true,
    },
  },
  created() {
    // 防抖处理
    this.resize = debounce(this.resize, 300);
  },
  mounted() {
    this.renderChart();
    this.$once('hook:beforeDestroy', () => { this.removeChart(); });
  },
  // 组件激活时调用
  activated() {
    this.renderChart();
  },
  // 组件停用时调用
  deactivated() {
    this.removeChart();
  },
  methods: {
    // 响应变化
    resize() {
      if (this.chart) {
        this.chart.resize();
        this.wrapHeight = getElemAttrVal(this.$refs.chartWrap);
      }
    },
    // 图表渲染
    renderChart() {
      if (!this.chart) {
        addListener(this.$refs.chartWrap, this.resize);
        this.$refs.chartDom.style.height = `${this.wrapHeight}px`;
        // 基于准备好的 dom， 初始化 echarts 实例
        this.chart = echarts.init(this.$refs.chartDom);
        // 绘制图标
        this.chart.setOption(this.option);
      }
    },
    // 图表销毁
    removeChart() {
      if (this.chart) {
        removeListener(this.$refs.chartWrap, this.resize);
        // 解绑事件，销毁变量
        this.chart.dispose();
        this.chart = null;
      }
    },
  },
};
