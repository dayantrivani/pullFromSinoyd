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
    path: 'BlowdownProgress',
    name: 'BlowdownProgress',
    meta: { title: '排污进度' },
    component: lazy('BlowdownProgress'),
  },
  {
    path: 'BlowdownProgressInfo',
    name: 'BlowdownProgressInfo',
    meta: { title: '排污详情' },
    component: lazy('BlowdownProgress/components/BlowdownProgressInfo'),
  },
  {
    path: 'SewageLicense',
    name: 'SewageLicense',
    meta: { title: '排污许可证' },
    component: lazy('SewageLicense'),
  },
  {
    path: 'SewageApproval',
    name: 'SewageApproval',
    meta: { title: '排污核定' },
    component: lazy('SewageApproval'),
  },
  {
    path: 'SewageThreshold',
    name: 'SewageThreshold',
    meta: { title: '排污阈值' },
    component: lazy('SewageThreshold'),
  },
  {
    path: 'ViewPortConfigScheme',
    name: 'ViewPortConfigScheme',
    meta: { title: '站点方案配置查看' },
    component: lazy('ViewPortConfigScheme'),
  },
  {
    path: 'OpenValveTimeSet',
    name: 'OpenValveTimeSet',
    meta: { title: '开阀时间段设置' },
    component: lazy('OpenValveTimeSet'),
  },
  {
    path: 'BatchSwitchValve',
    name: 'BatchSwitchValve',
    meta: { title: '批量开关阀' },
    component: lazy('BatchSwitchValve'),
  },
  {
    path: 'ValveOpeningCheck',
    name: 'ValveOpeningCheck',
    meta: { title: '阀门开启审核' },
    component: lazy('ValveOpeningCheck'),
  },
  {
    path: 'AlarmRecord',
    name: 'AlarmRecord',
    meta: { title: '报警记录' },
    component: lazy('AlarmManage/AlarmRecord'),
  },
  {
    path: 'AlarmSend',
    name: 'AlarmSend',
    meta: { title: '方案发送配置' },
    component: lazy('AlarmManage/AlarmSend'),
  },
  {
    path: 'AlarmUser',
    name: 'AlarmUser',
    meta: { title: '人员发送配置' },
    component: lazy('AlarmManage/AlarmUser'),
  },
  {
    path: 'EmissionQuery',
    name: 'EmissionQuery',
    meta: { title: '排放量数据查询' },
    component: lazy('DataQuery/EmissionQuery'),
  },
  {
    path: 'ConcentrationQuery',
    name: 'ConcentrationQuery',
    meta: { title: '浓度查询' },
    component: lazy('DataQuery/ConcentrationQuery'),
  },
  {
    path: 'ValveRecord',
    name: 'ValveRecord',
    meta: { title: '阀门关闭记录' },
    component: lazy('DataQuery/ValveRecord'),
  },
  {
    path: 'ICUserCard',
    name: 'ICUserCard',
    meta: { title: '卡管理' },
    component: lazy('ICCard/ICUserCard'),
  },
  {
    path: 'CardRecord',
    name: 'CardRecord',
    meta: { title: '管理卡刷卡记录' },
    component: lazy('ICCard/CardRecord'),
  },
  {
    path: 'EmissionStatistics',
    name: 'EmissionStatistics',
    meta: { title: '排放量统计' },
    component: lazy('ReportCenter/EmissionStatistics'),
  },
  {
    path: 'RechargeRecord',
    name: 'RechargeRecord',
    meta: { title: '充值记录' },
    component: lazy('RechargeManage/RechargeRecord'),
  },
  {
    path: 'Recharge',
    name: 'Recharge',
    meta: { title: '充值' },
    component: lazy('RechargeManage/Recharge'),
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
