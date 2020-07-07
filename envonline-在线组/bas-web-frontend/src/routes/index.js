import Vue from 'vue';
import Router from 'vue-router';
import { MessageBox } from 'element-ui';

import store from '../store';
import config from '@/config';
import bas from './module/bas';
import cfg from './module/cfg';

// 默认布局
import DefaultLayout from '@/components/layouts/Default';

Vue.use(Router);

// 路由懒加载
const lazy = path => () => import(`@/views/${path}`);

// 权限路由
export const asyncRoutesMap = [
  ...bas,
  ...cfg,
  {
    path: 'Empty',
    name: 'Empty',
    meta: { title: '空白页' },
    component: lazy('demo/Empty'),
  },
];

// 静态路由
export const routesMap = [
  {
    path: '/login',
    name: 'login',
    component: lazy('auth/Login'),
  },
  {
    path: '/lock',
    name: 'lock',
    component: lazy('auth/Lock'),
  },
  {
    path: '/404',
    name: 'NotFound',
    component: lazy('auth/NotFound'),
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: { name: config.home },
      },
      ...asyncRoutesMap,
      // {
      //   path: '',
      //   name: 'home',
      //   meta: { title: '首页', icon: 's fa-home' },
      //   component: lazy('Home'),
      // },
      {
        path: '*',
        name: 'NotAccess',
        component: lazy('auth/NotDevelop'),
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
  if (/login|lock|NotFound|home/.test(to.name)) {
    next({ replace: true });
    return;
  }
  // 访问路由是否存在
  if (asyncRoutesMap.find(v => v.name === to.name) || asyncRoutesMap[3].children.find(v => v.name === to.name)
    || asyncRoutesMap[4].children.find(v => v.name === to.name)) {
    if (store.state.tagsView.cachedViews.length >= 12) {
      next(false);
      MessageBox.alert('选项卡数目已经达到上限，请先关闭不必要的选项卡!', '提示', {
        confirmButtonText: '确定',
        customClass: 'no-icon',
      });
    }
    // 是否有权限访问
    if (store.state.auth.addRouter.includes(to.name) || !store.state.auth.addRouter.length) {
      next({ replace: true });
    } else if (to.name === 'NotAccess') {
      next({ name: 'NotFound', replace: true });  // 无权限
    } else {
      next({ name: 'NotAccess', replace: true });
    }
  } else if (to.name !== 'NotAccess') {
    next({ name: 'NotAccess', replace: true });
  } else {
    next({ replace: true }); // 无权限
  }
  // next({ replace: true });
});

export default router;
