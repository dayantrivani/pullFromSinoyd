// 注册全局组件，无需引入，直接使用

import CardFlex from './card-flex';
import ContextMenu from './context-menu';
import DateRange from './date-range';
import DialogModal from './dialog-modal';
import DragList from './drag-list';
import EditorTinymce from './editor-tinymce';
import FieldsetFlex from './fieldset-flex';
import HintText from './hint-text';
import PagingQuery from './paging-query';
import SearchFlex from './search-flex';
import SelectIcon from './select-icon';
import SelectPane from './select-pane';
import SelectTree from './select-tree';
import UploadFile from './upload-file';
import WangEditor from './wang-editor';

const components = {
  CardFlex,       // 弹性卡片
  ContextMenu,    // 右键菜单
  EditorTinymce,  // 富文本编辑器
  DateRange,      // 日期范围选择
  DialogModal,    // 模态对话框
  DragList,       // 可拖拽列
  FieldsetFlex,   // 伸缩组
  HintText,       // 提示文字
  PagingQuery,    // 分页查询
  SearchFlex,     // 高级检索
  SelectIcon,     // 图标选择器
  SelectPane,     // 窗格选择器
  SelectTree,     // 树选择器
  UploadFile,     // 附件上传
  WangEditor,     // 富文本编辑器
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
