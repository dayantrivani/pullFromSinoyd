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
