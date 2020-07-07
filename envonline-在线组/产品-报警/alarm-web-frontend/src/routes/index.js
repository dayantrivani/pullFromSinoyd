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

import ListNav from '@/components/list-nav';

const Layout = window.self === window.top ? DefaultLayout : IframeLayout;

Vue.use(Router);

// 路由懒加载
const lazy = path => () => import(`@/views/${path}`);

const iframeRouter = store.state.auth.iframeRouter.map(v => ({
  path: v.path,
  name: v.name,
  meta: v.meta,
  component: IframePage,
}));

// 权限路由
export const asyncRoutesMap = [
  {
    path: 'Home',
    name: 'Home',
    meta: { title: '首页' },
    component: lazy('Home'),
  },
  {
    path: 'AlarmRules',
    name: 'AlarmRules',
    meta: { title: '报警规则' },
    component: ListNav,
    children: [
      {
        path: 'AlarmWarnForFullSample',
        name: 'AlarmWarnForFullSample',
        meta: { title: '满样预警', hide: true },
        component: lazy('AlarmRules/AlarmForFullSample'),
      },
      {
        path: 'AlarmForFullSample',
        name: 'AlarmForFullSample',
        meta: { title: '满样报警', hide: true },
        component: lazy('AlarmRules/AlarmForFullSample'),
      },
      {
        path: 'AlarmForOverSample',
        name: 'AlarmForOverSample',
        meta: { title: '超标留样报警', hide: true },
        component: lazy('AlarmRules/AlarmForFullSample'),
      },
      {
        path: 'AlarmOffLine',
        name: 'AlarmOffLine',
        meta: { title: '离线报警', hide: true },
        component: lazy('AlarmRules/AlarmForFullSample'),
      },
      {
        path: 'AlarmValveClose',
        name: 'AlarmValveClose',
        meta: { title: '关阀报警', hide: true },
        component: lazy('AlarmRules/AlarmForFullSample'),
      },
      {
        path: 'AlarmValveCloseHasCou',
        name: 'AlarmValveCloseHasCou',
        meta: { title: '阀门异常报警', hide: true },
        component: lazy('AlarmRules/AlarmForFullSample'),
      },
      {
        path: 'AlarmOverProofMinute',
        name: 'AlarmOverProofMinute',
        meta: { title: '分钟超标报警', hide: true },
        component: lazy('AlarmRules/AlarmOverProofDay'),
      },
      {
        path: 'AlarmOverProofHour',
        name: 'AlarmOverProofHour',
        meta: { title: '小时超标报警', hide: true },
        component: lazy('AlarmRules/AlarmOverProofDay'),
      },
      {
        path: 'ContinuousAlarmOverProofHour',
        name: 'ContinuousAlarmOverProofHour',
        meta: { title: '持续小时超标报警', hide: true },
        component: lazy('AlarmRules/AlarmOverProofDay'),
      },
      {
        path: 'AlarmCou',
        name: 'AlarmCou',
        meta: { title: '排放量报警', hide: true },
        component: lazy('AlarmRules/AlarmOverProofDay'),
      },
      {
        path: 'AlarmCouWarn',
        name: 'AlarmCouWarn',
        meta: { title: '排放量预警', hide: true },
        component: lazy('AlarmRules/AlarmOverProofDay'),
      },
      {
        path: 'AlarmOverProofDay',
        name: 'AlarmOverProofDay',
        meta: { title: '日超标报警', hide: true },
        component: lazy('AlarmRules/AlarmOverProofDay'),
      },
      {
        path: 'AlarmOverProof',
        name: 'AlarmOverProof',
        meta: { title: '超标报警', hide: true },
        component: lazy('AlarmRules/AlarmOverProofDay'),
      },
      {
        path: 'AlarmFlag',
        name: 'AlarmFlag',
        meta: { title: '标记位异常', hide: true },
        component: lazy('AlarmRules/AlarmFlag'),
      },
      {
        path: 'AlarmSuddenChange',
        name: 'AlarmSuddenChange',
        meta: { title: '突变报警', hide: true },
        component: lazy('AlarmRules/AlarmSuddenChange'),
      },
      {
        path: 'AlarmNegative',
        name: 'AlarmNegative',
        meta: { title: '负值报警', hide: true },
        component: lazy('AlarmRules/AlarmNegative'),
      },
      {
        path: 'AlarmDataDuplication',
        name: 'AlarmDataDuplication',
        meta: { title: '数据重复报警', hide: true },
        component: lazy('AlarmRules/AlarmDataDuplication'),
      },
      ...iframeRouter,
    ],
  },
  {
    path: 'AlarmSend',
    name: 'AlarmSend',
    meta: { title: '发送方案配置' },
    component: lazy('AlarmSend'),
  },
  {
    path: 'AlarmUser',
    name: 'AlarmUser',
    meta: { title: '人员短信发送配置' },
    component: lazy('AlarmUser'),
  },
  {
    path: 'MailBox',
    name: 'MailBox',
    meta: { title: '短信箱' },
    component: lazy('MailBox'),
  },
];

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
  if (to.path !== '/login' && !store.state.auth.token) {
    next({ path: '/login', replace: true });
    return;
  }
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
