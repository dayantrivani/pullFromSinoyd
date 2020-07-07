const lazy = path => () => import(`@/views/wholeProcess/repository/${path}`);

export default [
  {
    path: 'TechStanrards',
    name: 'TechStanrards',
    meta: { title: '生产技术标准' },
    component: lazy('TechStanrards'),
  },
  {
    path: 'AccidentCase',
    name: 'AccidentCase',
    meta: { title: '事故案例' },
    component: lazy('AccidentCase'),
  },
  {
    path: 'ChemicalSafetyInfo',
    name: 'ChemicalSafetyInfo',
    meta: { title: '危化品安全信息' },
    component: lazy('ChemicalSafetyInfo'),
  },
];
