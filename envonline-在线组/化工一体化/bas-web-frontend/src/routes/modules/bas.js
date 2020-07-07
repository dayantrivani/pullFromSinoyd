import store from '@/store';

const lazy = path => () => import(`@/views/bas/${path}`);

export default [
  {
    path: 'PSList',
    name: 'PSList',
    meta: { title: `企业${store.getters['auth/userType'] === 'gov' ? '列表' : '档案'}` },
    component: lazy('PSList'),
  },
  {
    path: 'PSInfo',
    name: 'PSInfo',
    meta: { title: '企业详情' },
    component: lazy('PSInfo'),
  },
  {
    path: 'EntPortMNQuery',
    name: 'EntPortMNQuery',
    meta: { title: '企业MN号查询' },
    component: lazy('EntPortMNQuery'),
  },
  {
    path: 'FactorDirectory',
    name: 'FactorDirectory',
    meta: { title: '污染物特征因子名录库' },
    component: lazy('FactorDirectory'),
  },
  {
    path: 'ProjectCreateInfo',
    name: 'ProjectCreateInfo',
    meta: { title: '项目建设信息' },
    component: lazy('ProjectCreateInfo'),
  },
  {
    path: 'FactorManagement',
    name: 'FactorManagement',
    meta: { title: '危险品因子管理' },
    component: lazy('FactorManagement'),
  },
  {
    path: 'FactorConfiguration',
    name: 'FactorConfiguration',
    meta: { title: '危险品因子显示配置' },
    component: lazy('FactorConfiguration'),
  },
  {
    path: 'EigenfactorDirectory',
    name: 'EigenfactorDirectory',
    meta: { title: '园区特征因子名录库' },
    component: lazy('EigenfactorDirectory'),
  },
];
