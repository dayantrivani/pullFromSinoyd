import Vue from 'vue';
import Router from 'vue-router';
// eslint-disable-next-line import/no-cycle
import store from '@/store';
import config from '@/config';
import { getToken } from '@/libs/util';
// import { getMenu } from '@/api/auth.js';
import { getSessionStorage } from '@/libs/tools';

import DefaultLayout from '@/layouts/default'; // 默认布局
import IframeLayout from '@/layouts/iframe';   // 嵌套布局（无顶栏与侧栏）

Vue.use(Router);

/**
 * constantRoutes 初始路由
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/views/auth/login'),
  },
  {
    path: '/institutions',
    name: 'institutions',
    meta: { title: '检测机构' },
    component: () => import('@/views/auth/institutions'),
  },
  {
    path: '/jgcode',
    name: 'jgcode',
    meta: { title: '二维码移动端下载' },
    component: () => import('@/views/auth/jgcode'),
  },
  {
    path: '/registered',
    name: 'registered',
    meta: { title: '注册' },
    component: () => import('@/views/auth/registered'),
  },
  {
    path: '/ThematicMap',
    name: 'ThematicMap',
    meta: { title: '专题图' },
    component: () => import('@/views/thematic-map'),
  },
  {
    path: '/ThematicMapNew',
    name: 'ThematicMapNew',
    meta: { title: '新专题图' },
    component: () => import('@/views/thematic-map-new'),
  },
  {
    path: '/',
    component: window.self === window.top ? DefaultLayout : IframeLayout,
    children: [
      {
        path: '',
        // redirect: { name: config.app.home },
        // redirect: { name: store.state.auth.userMenu.length ? config.app.home : 'login' },
        redirect: { name: getSessionStorage(config.localKey.navMenu) ? config.app.home : 'login' },
      },
      {
        path: '/403',
        name: 'page-403',
        meta: { hide: true },
        component: () => import('@/views/auth/page-403'),
      },
      {
        path: '/404',
        name: 'page-404',
        meta: { hide: true },
        component: () => import('@/views/auth/page-404'),
      },
      {
        path: '/transit',
        name: 'transit',
        meta: { hide: true },
        component: () => import('@/views/auth/transit'),
      },
      {
        path: '/500',
        name: 'page-500',
        meta: { hide: true },
        component: () => import('@/views/auth/page-500'),
      },
    ],
  },
];


const createRouter = () => new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});

const router = createRouter();

/**
 * @description 重置路由实例
 * @docs https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
 */
let once = true;
// let first = true;
export const resetRouter = (data = store.getters['auth/addRoutes']) => {
  // first = false;
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
  router.addRoutes([
    {
      path: '/',
      component: window.self === window.top ? DefaultLayout : IframeLayout,
      children: [
        ...data,
        {
          path: '*', name: '*', redirect: '/404', hidden: true,
        },
      ],
    },
  ]); // 添加动态路由
  once = false;
};

// 全局前置守卫
router.beforeEach((to, form, next) => {
  // console.log(to.name);
  // if (first && getToken()) {
  //   store.dispatch('auth/GetUserMenu').then((data) => {
  //     resetRouter(data);
  //     next({ ...to, replace: true });
  //   }).catch(() => {
  //     next({ name: 'login', replace: true });
  //   });
  // }
  // if (!form.name && getToken()) {
  // }
  // 免登白名单
  if (['login', 'page-404', 'transit', 'registered', 'jgcode'].includes(to.name)) {
    // console.log(to.name);
    next({ replace: true });
    return;
  }
  // 检测 token
  if ((to.name !== 'login' && !getToken())) {
    next({ name: 'login', replace: true });
    return;
  }
  // if (!store.state.auth.userMenu) {
  //   getMenu();
  // }
  // 检测刷新操作
  if (once && getToken()) {
    // console.log(to.name);
    new Promise((resolve, reject) => {
      if (form.name !== 'login' || store.state.auth.userMenu.length) {
        // console.log(form.name, store.state.auth.userMenu.length);
        resolve(store.getters['auth/addRoutes']);
        // resolve(store.getters['auth/newAddRoutes']);
      } else {
        // console.log(to.name);
        /* eslint-disable */
        if (!['institutions', 'registered'].includes(to.name)) {
          store.dispatch('auth/GetUserMenu')
            .then((data) => { resolve(data); })
            .catch(() => { reject(); });
        }
        // store.dispatch('auth/GetNewMenu')
        //   .then((data) => { resolve(data); })
        //   .catch(() => { reject(); });
      }
    }).then((data) => {
      resetRouter(data);
      // newResetRouter(data);
      // next({ ...to, replace: true });
      if (to.name !== 'institutions') {
        next({ ...to, replace: true });
      }
    }).catch(() => {
      next({ name: 'login', replace: true });
      // console.log(to.name);
    });
    // } else if (!store.state.auth.dynamicRoutes.includes(to.name) && to.name !== 'ThematicMap') {
  } else if (!store.state.auth.dynamicRoutes.includes(to.name) && !['ThematicMap', 'institutions', 'ThematicMapNew'].includes(to.name)) {
    // 访问未生成动态路由将重定向至404
    next({ name: 'page-404', replace: true });
  }
  next();
});

export default router;
