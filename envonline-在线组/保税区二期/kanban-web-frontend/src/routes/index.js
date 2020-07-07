import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

// eslint-disable-next-line
const lazy = path => require(`@/views/${path}`).default;

Vue.use(Router);

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录' },
      component: lazy('auth/Login'),
    },
    {
      path: '/',
      component: lazy('Layout'),
      redirect: { name: 'Board' },
      children: [
        /** meta: { title: 'titleName', subtitle: 'subtitleName' }
                                                 * 必须，用于显示在头部、浏览器标签
                                                 */
        {
          path: 'Board',
          name: 'Board',
          meta: { title: '数据看板', subtitle: true },
          component: lazy('Board'),
        },
        {
          path: 'WarningModule',
          name: 'WarningModule',
          meta: { title: '环境风险预警看板', subtitle: true },
          component: lazy('WarningModule'),
        },
      ],
    },
    {
      path: '/bigScreen',
      name: 'bigScreen',
      meta: { title: '环境风险预警看板', subtitle: true },
      component: lazy('bigScreen'),
    },
  ],
});

// 登录控制
router.beforeEach((to, form, next) => {
  // 如果不是跳登录并且不存在token的话, 直接跳转到登录页面
  if (to.path !== '/login' && !store.state.auth.token && !store.state.auth.userInfo.token) {
    next({ path: '/login', replace: true });
  }

  if (/Login|Lock|404|Home/.test(to.name)) {
    next({ replace: true });
    return;
  }
  next({ replace: true });
});

export default router;
