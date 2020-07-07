// 注册全局组件，无需引入，直接使用

import ContextMenu from './ContextMenu';
import DialogModal from './DialogModal';
import FieldsetFlex from './FieldsetFlex';
import PagingQuery from './PagingQuery';
import SelectPane from './SelectPane';
import SelectTreeLazy from './SelectTreeLazy';
import SelectTree from './SelectTree';
import SelectTreeMod from './SelectTreeMod';
import DropQueryForm from './DropQueryForm';

const components = {
  ContextMenu,    // 右键菜单
  DialogModal,    // 模态对话框
  FieldsetFlex,   // 伸缩组
  PagingQuery,    // 分页查询
  SelectPane,     // 窗格选择器
  SelectTree,     // 树选择器
  SelectTreeLazy, // 懒加载树选择器
  SelectTreeMod,  // 多选树，带勾选框
  DropQueryForm, // 下拉检索栏
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
