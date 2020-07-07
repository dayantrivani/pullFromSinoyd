const lazy = path => () => import(`@/views/wholeProcess/safety/${path}`);

export default [
  {
    path: 'safetyProductionCostBudget',
    name: 'safetyProductionCostBudget',
    meta: { title: '费用预算' },
    component: lazy('safetyProductionCostBudget'),
  },
  {
    path: 'safetyProductionCostUse',
    name: 'safetyProductionCostUse',
    meta: { title: '费用使用' },
    component: lazy('safetyProductionCostUse'),
  },
  {
    path: 'safetyProductionCostWithdraw',
    name: 'safetyProductionCostWithdraw',
    meta: { title: '费用提取' },
    component: lazy('safetyProductionCostWithdraw'),
  },
  {
    path: 'safetyProductionInputInfo',
    name: 'safetyProductionInputInfo',
    meta: { title: '安全生产投入' },
    component: lazy('safetyProductionInputInfo'),
  },
];
