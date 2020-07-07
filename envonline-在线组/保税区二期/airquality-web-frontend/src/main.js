import Vue from 'vue';
import ElementUI from 'element-ui';
import VueWechatTitle from 'vue-wechat-title';
import echarts from 'echarts';
import VueJsonp from 'vue-jsonp';

import App from './App.vue';
import router from './routes';
import store from './store';
import Components from './global/components';
import Directives from './global/libs/directives';
import Filters from './global/libs/filters';
import Mixins from './global/libs/mixins';
import axios from './global/libs/axios';
import enums from './libs/enum';
import config from './config';

import './styles/index.scss'; // 样式入口引入

Vue.use(ElementUI, { size: 'mini', zIndex: 2000 });
Vue.use(VueWechatTitle);
Vue.use(VueJsonp);

Vue.use(Components);  // 引入公共组件
Vue.use(Filters);     // 过滤器
Vue.use(Directives);  // 指令
Vue.use(Mixins);      // 混合


/**
 * @description 全局注册HTTP请求库
 */
Vue.prototype.$http = axios;

/**
 * @description 全局注册枚举常量
 */
Vue.prototype.$enum = enums;

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;

/**
 * @description 图表绘制配置
 */
Vue.prototype.$echarts = echarts;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
