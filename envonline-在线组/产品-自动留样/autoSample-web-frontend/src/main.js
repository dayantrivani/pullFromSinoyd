import Vue from 'vue';

import ElementUI from 'element-ui';

import '@fortawesome/fontawesome-free/css/all.min.css'; // 第三方fa图标引入
import './styles/index.scss'; // 样式入口引入
import 'handsontable/dist/handsontable.full.min.css'; // 电子表格样式引入

import App from './App.vue';
import router from './routes';
import store from './store';

import Axios from './plugins/axios';            // HTTP库
import Helper from './plugins/helper';          // 助手方法
import Directives from './plugins/directives';  // 指令
import Filters from './plugins/filters';        // 过滤器
import Mixins from './plugins/mixins/global';   // 混合

// 引入公共组件
import GlobalElement from './components/global';

// import './mock'; // 模拟数据，联调时请注释该行代码(TODO: 会影响到Element上传组件进度条的显示)

Vue.use(ElementUI, { size: 'mini', zIndex: 2000 });
Vue.use(GlobalElement);

Vue.use(Axios);
Vue.use(Helper);
Vue.use(Filters);
Vue.use(Directives);
Vue.use(Mixins);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
