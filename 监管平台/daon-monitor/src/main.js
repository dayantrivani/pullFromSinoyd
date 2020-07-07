import '@babel/polyfill'; // 转译代码

import Vue from 'vue';
import VueAMap from 'vue-amap';
import ElementUI from 'element-ui';
// import { Carousel, CarouselItem } from 'element-ui';
// import VueHighlightJS from 'vue-highlightjs';

import VCharts from 'v-charts';
import VueKinesis from 'vue-kinesis';
import App from './App.vue';
import router from './routes';
import store from './store';

import Antd from './libs/ant-import';
import Components from './components/global'; // 全局公用组件
import Directives from './directives';    // 全局自定义指令
import Filters from './libs/filters';

import config from './config';
import axios from './libs/api-request';
import enums from './libs/enums';
import * as tools from './libs/tools';


// SVG 图标引入
import './assets/icons';
// IE兼容补丁
import './libs/ie-patch';
// 样式入口引入
import './styles/index.scss';
// 文档代码高亮样式
import 'highlight.js/styles/github.css';
import 'element-ui/lib/theme-chalk/index.css';

// Vue.use(VueHighlightJS);
Vue.use(ElementUI, { size: 'mini', zIndex: 2000 });
// Vue.use(Carousel);
// Vue.use(CarouselItem);

Vue.use(Antd);        // 引入 antd 组件
Vue.use(Components);  // 引入全局 组件
Vue.use(Directives);  // 引入全局 指令
Vue.use(Filters);     // 引入全局 过滤器
Vue.use(VueAMap);
Vue.use(VCharts);
Vue.use(VueKinesis);

// eslint-disable-next-line global-require
// if (process.env.NODE_ENV === 'production' || config.mock.use) require('@/mock');

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

/**
 * @description 全局注册HTTP请求库
 */
Vue.prototype.$axios = axios;

/**
 * @description 全局方法库
 */
Vue.prototype.$tools = tools;

/**
 * @description 全局注册枚举常量
 */
Vue.prototype.$enum = enums;

/**
 * @description 生产环境关闭提示
 */
Vue.config.productionTip = false;

/**
 * @description 开发环境开启性能监测
 */
// Vue.config.performance = process.env.NODE_ENV !== 'production';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
