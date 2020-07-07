// 注册全局组件，无需引入，直接使用

import InputNumberAppend from './input-number-append.vue';

const components = {
  InputNumberAppend,      // 计数器带单位插槽
};

const install = (Vue) => {
  // 注册全局组件
  Object.keys(components).forEach((key) => {
    Vue.component(components[key].name, components[key]);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default { install, ...components };
