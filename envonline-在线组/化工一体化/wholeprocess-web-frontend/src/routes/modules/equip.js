const lazy = path => () => import(`@/views/wholeProcess/equip/${path}`);

export default [
  {
    path: 'SpecEquipInfo',
    name: 'SpecEquipInfo',
    meta: { title: '设备管理' },
    component: lazy('SpecEquipInfo'),
  },
  {
    path: 'UtilitySystemInfo',
    name: 'UtilitySystemInfo',
    meta: { title: '公用工程信息' },
    component: lazy('UtilitySystemInfo'),
  },
  {
    path: 'SafetyFacilities',
    name: 'SafetyFacilities',
    meta: { title: '安全设施' },
    component: lazy('SafetyFacilities'),
  },
  {
    path: 'SafetyDevice',
    name: 'SafetyDevice',
    meta: { title: '生产装置开停车管理' },
    component: lazy('SafetyDevice'),
  },
  {
    path: 'applyFor',
    name: 'applyFor',
    meta: { title: '变更申请', type: 1 },
    component: lazy('ChangeManagement'),
  },
  {
    path: 'audit',
    name: 'audit',
    meta: { title: '变更审核', type: 2 },
    component: lazy('ChangeManagement'),
  },
  {
    path: 'acceptance',
    name: 'acceptance',
    meta: { title: '变更验收', type: 3 },
    component: lazy('ChangeManagement'),
  },
];
