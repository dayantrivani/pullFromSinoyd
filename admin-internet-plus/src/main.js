import Vue from 'vue';
import VueHighlightJS from 'vue-highlightjs';

import App from './App.vue';
import router from './routes';
import store from './store';

import Element from './libs/components';
import Components from './components/_global';
import Directives from './directives';
import Filters from './libs/filters';
import Enums from './libs/enums';

import config from './config/app.config';
import * as tools from './libs/tools';

// SVG 图标引入
import './assets/icons';
// IE兼容补丁
import './libs/patch';
// 样式入口引入
import './styles/index.scss';
// 文档代码高亮样式
import 'highlight.js/styles/github.css';

// 加载主题切换控件覆盖样式
if (config.app.useUITheme && !tools.IEVersion()) {
  // eslint-disable-next-line global-require
  require('@/styles/element/element.color.scss');
}

Vue.use(VueHighlightJS);

Vue.use(Element);     // 引入 element-ui 组件
Vue.use(Components);  // 引入全局 组件
Vue.use(Directives);  // 引入全局 指令
Vue.use(Filters);     // 引入全局 过滤器
Vue.use(Enums);       // 引入全局 枚举

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

/**
 * @description 全局方法库
 */
Vue.prototype.$tools = tools;

/**
 * @description 鉴权方法
 */
Vue.prototype.$auth = tools.auth;

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
