import Vue from 'vue';
import Router from 'vue-router';
import { MessageBox } from 'element-ui';

import store from '../store';
import config from '@/config';
// 默认布局
import DefaultLayout from '@/global/layouts/Default';
// 嵌套布局（去除顶栏与侧栏）
import IframeLayout from '@/global/layouts/Iframe';
import IframePage from '@/views/auth/IframePage';

const Layout = window.self === window.top ? DefaultLayout : IframeLayout;

Vue.use(Router);

// 路由懒加载
const lazy = path => () => import(`@/views/${path}`);

// 嵌套页路由
const iframeRouter = store.state.auth.iframeRouter.map(v => ({
  path: v.path,
  name: v.name,
  meta: v.meta,
  component: IframePage,
}));
const amcsType = [1, '1'].includes(store.state.auth.amcsType) ? '废水' : '废气';

// 项目框架中存在的页面的路由集合
export const asyncRoutesMap = [
  ...iframeRouter,
  {
    path: 'home',
    name: 'home',
    meta: { title: '首页' },
    component: lazy('Home'),
  },
  {
    path: 'RealTimeMonitor',
    name: 'RealTimeMonitor',
    meta: { title: `${amcsType}实时监控` },
    component: lazy('RealTimeMonitor'),
  },
  {
    path: 'RealTimeMonitorDetails',
    name: 'RealTimeMonitorDetails',
    meta: { title: '单点详情' },
    component: lazy('RealTimeMonitor/components/RealTimeMonitorDetails'),
  },
  {
    path: 'DataQuery',
    name: 'DataQuery',
    meta: { title: `${amcsType}数据查询` },
    component: lazy('DataQuery'),
  },
  {
    path: 'RemoteControl',
    name: 'RemoteControl',
    meta: { title: `${amcsType}远程控制` },
    component: lazy('RemoteControl'),
  },
  {
    path: 'AlarmRecord',
    name: 'AlarmRecord',
    meta: { title: `${amcsType}报警管理` },
    component: lazy('AlarmRecord'),
  },
  {
    path: 'AuditLog',
    name: 'AuditLog',
    meta: { title: '审核日志' },
    component: lazy('AuditLog'),
  },
  {
    path: 'OnlineReportSubmit',
    name: 'OnlineReportSubmit',
    meta: { title: '网上报备' },
    component: lazy('OnlineReport/Submit'),
  },
  {
    path: 'OnlineReportAudit',
    name: 'OnlineReportAudit',
    meta: { title: '报备审核' },
    component: lazy('OnlineReport/Audit'),
  },
  {
    path: 'Certificate',
    name: 'Certificate',
    meta: { title: '凭证管理' },
    component: lazy('Certificate'),
  },
  {
    path: 'DocuManagement',
    name: 'DocuManagement',
    meta: { title: '文档管理' },
    component: lazy('DocuManagement'),
  },
  {
    path: 'DataAudit',
    name: 'DataAudit',
    meta: { title: '数据审核' },
    component: lazy('DataAudit'),
  },
  {
    path: 'IntegratedManage',
    name: 'IntegratedManage',
    meta: { title: '综合管理' },
    component: lazy('IntegratedManage'),
  },
  {
    path: 'RegionTransfer',
    name: 'RegionTransfer',
    meta: { title: '区域传输率' },
    component: lazy('IntegratedManage/DataTransfer'),
  },
  {
    path: 'PSTransfer',
    name: 'PSTransfer',
    meta: { title: '企业传输率' },
    component: lazy('IntegratedManage/DataTransfer'),
  },
  {
    path: 'DataTransmissionEfficiency',
    name: 'DataTransmissionEfficiency',
    meta: { title: '数据传输有效率' },
    component: lazy('IntegratedManage/DataTransmissionEfficiency'),
  },
  {
    path: 'ComplementRate',
    name: 'ComplementRate',
    meta: { title: '数据有效补集率' },
    component: lazy('IntegratedManage/ComplementRate'),
  },
  {
    path: 'OverStandard',
    name: 'OverStandard',
    meta: { title: '超标率' },
    component: lazy('IntegratedManage/OverStandard'),
  },
  {
    path: 'ExcessiveStatistics',
    name: 'ExcessiveStatistics',
    meta: { title: '超标统计' },
    component: lazy('IntegratedManage/ExcessiveStatistics'),
  },
  {
    path: 'DataAnalysis',
    name: 'DataAnalysis',
    meta: { title: '数据分析' },
    component: lazy('IntegratedManage/DataAnalysis'),
  },
  {
    path: 'DataComparison',
    name: 'DataComparison',
    meta: { title: '数据比对曲线' },
    component: lazy('IntegratedManage/DataComparison'),
  },
  {
    path: 'StatisticsReport',
    name: 'StatisticsReport',
    meta: { title: `${amcsType}报表统计` },
    component: lazy('StatisticsReport'),
  },
  {
    path: 'AlarmRecordForContinuous',
    name: 'AlarmRecordForContinuous',
    meta: { title: '超标通告单' },
    component: lazy('AlarmRecordForContinuous'),
  },
];

// 递归获取需要过滤调的路由名称集合
const getHideMap = (array) => {
  const result = [];
  const fn = (data) => {
    data.forEach((item) => {
      if (item.meta.hide) {
        result.push(item.name);
      }
      if (item.children) {
        fn(item.children);
      }
    });
  };
  fn(array);
  return result;
};

export const hideRoutesMap = getHideMap(asyncRoutesMap);

// 静态路由
export const routesMap = [
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: lazy('auth/Login'),
  },
  {
    path: '/lock',
    name: 'lock',
    component: lazy('auth/Lock'),
  },
  {
    path: '/404',
    name: '404',
    component: lazy('404'),
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: { name: config.home },
      },
      ...asyncRoutesMap,
      {
        path: 'Empty',
        name: 'Empty',
        meta: { title: '空白页' },
        component: lazy('Empty'),
      },
      {
        path: '*',
        name: 'NotFound',
        component: lazy('auth/NotFound'),
      },
    ],
  },
  { path: '*', redirect: '/404' },
];

const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: routesMap,
});

// 登录控制
router.beforeEach((to, form, next) => {
  // 如果不是跳登录并且不存在token的话, 直接跳转到登录页面
  if (to.path !== '/login' && !store.state.auth.token) {
    next({ path: '/login', replace: true });
    return;
  }
  // 以下页面可以直接跳转
  if (/login|lock|NotFound|404|home/.test(to.name)) {
    next({ replace: true });
    return;
  }
  // 访问路由是否存在
  const route = store.state.tagsView.cachedViews.filter(v => !hideRoutesMap.includes(v));
  if (route.length >= 12) {
    next(false);
    MessageBox.alert('选项卡数目已经达到上限，请先关闭不必要的选项卡!', '提示', {
      confirmButtonText: '确定',
      customClass: 'no-icon',
    });
  }
  next({ replace: true });
});

export const route = router;

export default router;
