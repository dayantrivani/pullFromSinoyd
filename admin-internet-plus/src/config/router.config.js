// 加载返回异步组件
const loadComp = path => () => import(`@/views/${path}`);

/**
 * @description 动态路由配置
 * 默认从导航获取 title，这里设置的 title 是为了给导航里没有的页面准备的
 * @param {boolean} meta.hide     是否隐藏标签 false
 * @param {boolean} meta.lock     是否锁定页面 false
 * @param {boolean} meta.cache    是否允许缓存页面 false
 */

export default [
  {
    path: 'Dashboard',
    name: 'Dashboard',
    component: loadComp('Dashboard'),
  },

  // 表单
  {
    path: 'FormElement',
    name: 'FormElement',
    meta: { title: '表单元素' },
    component: loadComp('forms/FormElement'),
  },
  {
    path: 'FormGroup',
    name: 'FormGroup',
    meta: { title: '表单组合' },
    component: loadComp('forms/FormGroup'),
  },
  {
    path: 'FormDynamic',
    name: 'FormDynamic',
    meta: { title: '动态表单' },
    component: loadComp('forms/FormDynamic'),
  },

  // 表格
  {
    path: 'TableRadio',
    name: 'TableRadio',
    meta: { title: '单选表格' },
    component: loadComp('tables/TableRadio'),
  },
  {
    path: 'TableCheckbox',
    name: 'TableCheckbox',
    meta: { title: '多选表格' },
    component: loadComp('tables/TableCheckbox'),
  },
  {
    path: 'TableEdit',
    name: 'TableEdit',
    meta: { title: '编辑表格' },
    component: loadComp('tables/TableEdit'),
  },

  // 组件
  {
    path: 'SelectIcon',
    name: 'SelectIcon',
    meta: { title: '图标选择器' },
    component: loadComp('widget/SelectIcon'),
  },
  {
    path: 'Markdown',
    name: 'Markdown',
    meta: { title: 'Markdown 编辑器' },
    component: loadComp('widget/Markdown'),
  },
  {
    path: 'Echarts',
    name: 'Echarts',
    meta: { title: 'Echarts' },
    component: loadComp('widget/Echarts'),
  },

  // 业务组件
  {
    path: 'PersonSelect',
    name: 'PersonSelect',
    meta: { title: '人员选择' },
    component: loadComp('widget-pro/PersonSelect'),
  },
  {
    path: 'FormulaEdit',
    name: 'FormulaEdit',
    meta: { title: '公式编辑' },
    component: loadComp('widget-pro/FormulaEdit'),
  },

  // 布局
  {
    path: 'DocContent',
    name: 'DocContent',
    meta: { title: '目录内容' },
    component: loadComp('layouts/DocContent'),
  },
  {
    path: 'ListDetail',
    name: 'ListDetail',
    meta: { title: '列表详情' },
    component: loadComp('layouts/ListDetail'),
  },
  {
    path: 'ListRelevance',
    name: 'ListRelevance',
    meta: { title: '列表关联扩展' },
    component: loadComp('layouts/ListRelevance'),
  },
  {
    path: 'CustomLayout',
    name: 'CustomLayout',
    meta: { title: '自定义布局' },
    component: loadComp('layouts/CustomLayout'),
  },

  // 页面
  {
    path: 'Notice',
    name: 'Notice',
    meta: { title: '公告管理' },
    component: loadComp('example/Notice'),
  },
  {
    path: 'ProjectInquiry',
    name: 'ProjectInquiry',
    meta: { title: '项目进度' },
    component: loadComp('example/ProjectInquiry'),
  },
  {
    path: 'ReportEdit',
    name: 'ReportEdit',
    meta: { title: '报告编制' },
    component: loadComp('example/ReportEdit'),
  },
  {
    path: 'SampleType',
    name: 'SampleType',
    meta: { title: '检测类型' },
    component: loadComp('example/SampleType'),
  },
  {
    path: 'ReadtimeStatus',
    name: 'ReadtimeStatus',
    meta: { title: '实时状态查询' },
    component: loadComp('example/ReadtimeStatus'),
  },
];
