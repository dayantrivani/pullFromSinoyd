import Vue from 'vue';
import ElementUI from 'element-ui';

import App from './App.vue';
import router from './routes';
import store from './store';

// IE兼容补丁，添加未受支持部分方法
import './libs/ie.patch';
// 样式入口引入
import './styles/index.scss';

import Components from './components/global';
import Directives from './directives';
import Filters from './libs/filters';

import config from './config';
import axios from './libs/api.request';
import http from './libs/http';
import Echarts from './libs/echarts';            // 图表库
import enums from './libs/enums';
import * as tools from './libs/tools';

import { zIndex } from '@/styles/common/variables.scss';

Vue.use(ElementUI, { size: 'mini', zIndex });

Vue.use(Components);  // 引入全局 组件
Vue.use(Directives);  // 引入全局 指令
Vue.use(Filters);     // 引入全局 过滤器
Vue.use(Echarts);

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

/**
 * @description 全局注册HTTP请求库
 */
Vue.prototype.$axios = axios;

/**
 * @description 全局注册HTTP请求库
 */
Vue.prototype.$http = http;

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

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
