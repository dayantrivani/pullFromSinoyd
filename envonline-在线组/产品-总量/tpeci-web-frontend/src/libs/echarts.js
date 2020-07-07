// import echarts from 'echarts';
// 加载echarts，注意引入文件的路径
import echarts from 'echarts/lib/echarts';

// 再引入你需要使用的图表类型，标题，提示信息等
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';

export default {
  install(Vue) {
    // eslint-disable-next-line
    Vue.chart = Vue.prototype.$echarts = echarts;
  },
};
