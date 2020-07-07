const lazy = path => () => import(`@/views/wholeProcess/workManage/${path}`);

export default [
  {
    path: 'SafetyTempManage',
    name: 'SafetyTempManage',
    meta: { title: '安全模板管理' },
    component: lazy('SafetyTempManage'),
  },
  {
    path: 'FireWork',
    name: 'FireWork',
    meta: { title: '动火作业' },
    component: lazy('FireWork'),
  },
  {
    path: 'ConfinedSpaceWork',
    name: 'ConfinedSpaceWork',
    meta: { title: '进入受限空间' },
    component: lazy('ConfinedSpace'),
  },
  {
    path: 'HeightWork',
    name: 'HeightWork',
    meta: { title: '高处作业' },
    component: lazy('HeightWork'),
  },
  {
    path: 'HoistingWork',
    name: 'HoistingWork',
    meta: { title: '吊装作业' },
    component: lazy('HoistingWork'),
  },
  {
    path: 'BlindBoardWork',
    name: 'BlindBoardWork',
    meta: { title: '盲板抽堵作业' },
    component: lazy('BlindBoard'),
  },
  {
    path: 'BreakGroundWork',
    name: 'BreakGroundWork',
    meta: { title: '动土作业' },
    component: lazy('BreakGround'),
  },
  {
    path: 'RoadBreakWork',
    name: 'RoadBreakWork',
    meta: { title: '断路作业' },
    component: lazy('RoadBreak'),
  },
  {
    path: 'TemporaryElectricityWork',
    name: 'TemporaryElectricityWork',
    meta: { title: '临时用电' },
    component: lazy('TemporaryElectricity'),
  },
  {
    path: 'DiseaseControl',
    name: 'DiseaseControl',
    meta: { title: '职业病防控' },
    component: lazy('DiseaseControl'),
  },
  {
    path: 'DiseaseRecord',
    name: 'DiseaseRecord',
    meta: { title: '职业病记录' },
    component: lazy('DiseaseRecord'),
  },
];
