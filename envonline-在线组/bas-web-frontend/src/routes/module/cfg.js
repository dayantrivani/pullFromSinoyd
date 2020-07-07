const lazy = path => () => import(`@/views/cfg/${path}`);

export default [
  {
    path: 'ConcernPort',
    name: 'ConcernPort',
    meta: { title: '排口关注' },
    component: lazy('ConcernPort'),
  }, {
    path: 'RolePort',
    name: 'RolePort',
    meta: { title: '排口权限' },
    component: lazy('RolePort'),
  },
  // 因子管理
  {
    path: 'FactorManage',
    name: 'FactorManage',
    meta: { title: '因子管理' },
    component: lazy('FactorManage'),
  },
  // 污染源因子管理
  {
    path: 'FactorPollution',
    name: 'FactorPollution',
    meta: { title: '污染源因子管理' },
    component: lazy('FactorPollution'),
  },
  // 评价标准管理
  {
    path: 'EvaluateStandard',
    name: 'EvaluateStandard',
    meta: { title: '评价标准管理' },
    component: lazy('EvaluateStandard'),
  },
  // 仪器型号管理
  {
    path: 'InstrumentModel',
    name: 'InstrumentModel',
    meta: { title: '仪器型号管理' },
    component: lazy('InstrumentModel'),
  },
  // 因子显示配置
  {
    path: 'FDConfiguration',
    name: 'FDConfiguration',
    meta: { title: '因子显示配置' },
    component: lazy('FDConfiguration'),
  },
  // 门禁卡配置
  {
    path: 'AccessCardConfig',
    name: 'AccessCardConfig',
    meta: { title: '门禁卡配置' },
    component: lazy('AccessCardConfig'),
  },
  {
    path: 'TransmissionEfficiencyConfig',
    name: 'TransmissionEfficiencyConfig',
    meta: { title: '传输有效率配置' },
    component: lazy('TransmissionEfficiencyConfig'),
  },
];
