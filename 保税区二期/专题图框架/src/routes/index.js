import Vue from 'vue';
import Router from 'vue-router';
import { getToken } from '@/libs/util';

// eslint-disable-next-line
const lazy = path => require(`@/views/${path}`).default;

Vue.use(Router);

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: lazy('Layout'),
      redirect: { name: 'WasteWater' },
      children: [
        /** meta: { title: 'titleName', subtitle: 'subtitleName' }
         * 必须，用于显示在头部、浏览器标签
         */
        {
          path: 'RainWater',
          name: 'RainWater',
          meta: { title: '雨水排放专题', subtitle: true },
          component: lazy('RainWater'),
        },
      ],
    },
  ],
});

// 登录控制
router.beforeEach((to, form, next) => {
  if (to.path === '/' && getToken()) {
    next({ name: 'WasteWater', replace: true });
    return;
  }
  if (/Login|Lock|404|Home/.test(to.name)) {
    next({ replace: true });
    return;
  }
  next({ replace: true });
});

export default router;
