import Vue from 'vue';

import ElementUI from 'element-ui';

import '@fortawesome/fontawesome-free/css/all.min.css'; // 第三方fa图标引入
import './styles/style.scss'; // 样式入口引入
import 'handsontable/dist/handsontable.full.min.css'; // 电子表格样式引入

import App from './App.vue';
import router from './routes';
import store from './store';

import Axios from './plugins/axios';           // HTTP库
import Helper from './plugins/helper';         // 助手方法
import Enum from './plugins/enum';             // 枚举常量
import Filters from './plugins/filters';       // 过滤器
import Directives from './plugins/directives'; // 指令
import config from './config';

// 引入公共组件
import CommonElement from './components/common';

// import './mock'; // 模拟数据，联调时请注释该行代码

Vue.use(ElementUI, { size: 'mini', zIndex: 1500 });
Vue.use(CommonElement);

Vue.use(Axios);
Vue.use(Helper);
Vue.use(Enum);
Vue.use(Directives);
Vue.use(Filters);

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
