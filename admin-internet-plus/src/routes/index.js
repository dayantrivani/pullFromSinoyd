import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import config from '@/config/app.config';
import { getToken } from '@/libs/util';

const lazy = path => () => import(`@/layouts/_common/${path}`);

// 若被嵌入则引用嵌入布局（无顶栏与侧栏）
const Layout = lazy(`framework/${config.isTop ? 'IframeOut' : 'Default'}`);

Vue.use(Router);

/**
 * constantRoutes 初始路由
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: lazy('page/Login'),
  },
  {
    path: '/Register',
    name: 'register',
    meta: { title: '注册' },
    component: lazy('page/Register'),
  },
  {
    path: '/lock',
    name: 'lock',
    meta: { title: '锁定' },
    component: lazy('page/Lock'),
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: { name: store.state.auth.userMenu.length ? config.app.home : 'login' },
      },
      {
        path: '/404',
        name: 'ex-404',
        meta: { title: '404' },
        component: lazy('exception/404'),
      },
      {
        path: '/403',
        name: 'ex-403',
        meta: { title: '403' },
        component: lazy('exception/403'),
      },
      {
        path: '/500',
        name: 'ex-500',
        meta: { title: '500' },
        component: lazy('exception/500'),
      },
      {
        path: '/theme-config',
        name: 'theme-config',
        meta: { title: '主题设置', icon: 'theme' },
        component: lazy('page/Theme'),
      },
      {
        path: '/search-icon',
        name: 'search-icon',
        meta: { title: '图标检索', icon: 'search' },
        component: lazy('page/SearchIcon'),
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
export const resetRouter = (data = store.getters['auth/addRoutes']) => {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
  router.addRoutes([
    {
      path: '/',
      component: Layout,
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

// 是否已获取到导航，若没有，则同步获取
const asyncLoadNav = () => new Promise((resolve, reject) => {
  if (store.state.auth.userMenu.length) {
    resolve(store.getters['auth/addRoutes']);
  } else {
    store.dispatch('auth/GetUserNav')
      .then((data) => { resolve(data); })
      .catch(() => reject());
  }
});

// 在路由导航过程中出错时被调用
router.onError(() => {
  router.replace({ name: 'ex-500' });
});

// 全局前置守卫
router.beforeEach(async (to, form, next) => {
  // 当通过地址栏跳转时 name 偶尔会为空
  const toName = to.name || to.path.replace(/\//g, '');

  // 检测 token
  if ((toName !== 'login' && !getToken())) {
    next({ name: 'login', replace: true });
    return;
  }

  // 免登白名单
  if (/404|403|500|login|Dashboard|ThemeConfig/.test(toName)) {
    next({ replace: true });
    return;
  }

  // 检测刷新操作（同步）
  if (once && getToken()) {
    await asyncLoadNav()
      .then((data) => {
        resetRouter(data);
        next({ ...to, replace: true });
      })
      .catch(() => {
        next({ name: 'login', replace: true });
      });
    return;
  }

  next({ replace: true });
});

export default router;
