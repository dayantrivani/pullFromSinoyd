// 注册全局组件，无需引入，直接使用
import Pictrue from './pictrue/index.js';
import Animates from './Animates/index.vue';

const components = {
  Pictrue,
  Animates,
};

const install = (Vue) => {
  // 注册全局组件
  Object.keys(components).forEach((key) => {
    Vue.component(key, components[key]);
  });
};

export default { install, ...components };
