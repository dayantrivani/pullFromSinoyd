const lazy = path => () => import(`@/views/cfg/${path}`);

export default [
  {
    path: 'ConcernPorts',
    name: 'ConcernPorts',
    meta: { title: '排口关注' },
    component: lazy('ConcernPorts'),
  },
  {
    path: 'EvaluateStandard',
    name: 'EvaluateStandard',
    meta: { title: '评价标准管理' },
    component: lazy('EvaluateStandard'),
  },
  {
    path: 'FactorManage',
    name: 'FactorManage',
    meta: { title: '因子管理' },
    component: lazy('FactorManage'),
  },
  {
    path: 'FactorPollution',
    name: 'FactorPollution',
    meta: { title: '污染源因子管理' },
    component: lazy('FactorPollution'),
  },
  {
    path: 'FactorShowConfig',
    name: 'FactorShowConfig',
    meta: { title: '因子显示配置' },
    component: lazy('FactorShowConfig'),
  },
  {
    path: 'InstrumentModel',
    name: 'InstrumentModel',
    meta: { title: '仪器型号管理' },
    component: lazy('InstrumentModel'),
  },
  {
    path: 'RolePorts',
    name: 'RolePorts',
    meta: { title: '排口权限' },
    component: lazy('RolePorts'),
  },
  {
    path: 'TransmissionEfficiencyConfig',
    name: 'TransmissionEfficiencyConfig',
    meta: { title: '传输有效率配置' },
    component: lazy('TransmissionEfficiencyConfig'),
  },
  {
    path: 'EigenfactorDirectory',
    name: 'EigenfactorDirectory',
    meta: { title: '园区特征因子名录库' },
    component: lazy('EigenfactorDirectory'),
  },
  {
    path: 'VideoDevice',
    name: 'VideoDevice',
    meta: { title: '企业摄像头管理' },
    component: lazy('VideoDevice'),
  },
];
