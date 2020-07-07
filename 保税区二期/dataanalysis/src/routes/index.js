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
          path: 'WasteWater',
          name: 'WasteWater',
          meta: { title: '污水排放专题', subtitle: true },
          component: lazy('WasteWater'),
        },
        {
          path: 'TotalStatistics',
          name: 'TotalStatistics',
          meta: { title: '', subtitle: '总量统计专题' },
          component: lazy('TotalStatistics'),
        },
        {
          path: 'RainWater',
          name: 'RainWater',
          meta: { title: '雨水排放专题', subtitle: true },
          component: lazy('RainWater'),
        },
        {
          path: 'WaterBalance',
          name: 'WaterBalance',
          meta: { title: '水平衡专题', subtitle: true },
          component: lazy('WaterBalance'),
        },
        {
          path: 'WaterControl',
          name: 'WaterControl',
          meta: { title: '水控制专题', subtitle: true },
          component: lazy('WaterControl'),
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
