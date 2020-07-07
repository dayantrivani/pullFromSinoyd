// 注册全局组件，无需引入，直接使用
import LayoutHeader from './layout-header';
import DecorBorder from './decor-border';
import DecorButton from './decor-button';
import MainCase from './main-case';
import YdButton from './yd-button';

const components = {
  LayoutHeader,        // 布局标题头部
  DecorBorder,         // 背景装饰框
  DecorButton,         // 带背景按钮
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
