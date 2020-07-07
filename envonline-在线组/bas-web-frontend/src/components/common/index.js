import ContextMenu from './ContextMenu';
import DateRange from './DateRange';
import DialogModal from './DialogModal';
import FieldsetFlex from './FieldsetFlex';
import PagingQuery from './PagingQuery';
import SelectPane from './SelectPane';
import SelectTree from './SelectTree';
import SelectTreeMod from './SelectTreeMod';
import HintText from './HintText';
// import SelectTreeLazy from './SelectTreeLazy';

const components = {
  ContextMenu,    // 右键菜单
  DateRange,      // 日期范围选择
  DialogModal,    // 模态对话框
  FieldsetFlex,   // 伸缩组
  PagingQuery,    // 分页查询
  SelectPane,     // 窗格选择器 -- 行业
  SelectTree,     // 树选择器   -- 行业
  SelectTreeMod,  // 树选择器 - 适应该项目版
  HintText,       // 说明悬浮提示
  // SelectTreeLazy, // 树选择器懒加载
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
