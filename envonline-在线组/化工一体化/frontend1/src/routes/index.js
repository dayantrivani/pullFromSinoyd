import Vue from 'vue';
import Router from 'vue-router';
import { getToken } from '@/libs/util';

import Home from '@/views/home'; // 默认布局

// eslint-disable-next-line
const lazy = path => require(`@/views/${path}`).default;

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      meta: { title: '登录' },
      component: lazy('login'),
    },
    {
      path: '/',
      name: 'Home',
      meta: { title: '首页' },
      component: Home,
    },
  ],
});

// 登录控制
router.beforeEach((to, form, next) => {
  if (to.name !== 'Login' && !getToken()) {
    next({ name: 'Login', replace: true });
    return;
  }
  if (/Login|Lock|404|Home/.test(to.name)) {
    next({ replace: true });
    return;
  }
  next({ replace: true });
});

export default router;
