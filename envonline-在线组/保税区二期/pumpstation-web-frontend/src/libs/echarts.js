import echarts from 'echarts';

export default {
  install(Vue) {
    // eslint-disable-next-line
    Vue.chart = Vue.prototype.$echarts = echarts;
  },
};
