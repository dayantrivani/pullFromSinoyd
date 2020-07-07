// 注册全局组件，无需引入，直接使用
import MainCase from './main-case';
import YdButton from './yd-button';

const components = {
  MainCase,            // 内容容器
  YdButton,            // 按钮
};

const install = (Vue) => {
  // 注册全局组件
  Object.keys(components).forEach((key) => {
    Vue.component(components[key].name, components[key]);
  });
};

export default { install, ...components };
