const lazy = path => () => import(`@/views/wholeProcess/basInfo/${path}`);

export default [
  {
    path: 'ConfinedSpace',
    name: 'ConfinedSpace',
    meta: { title: '受限空间' },
    component: lazy('ConfinedSpace'),
  },
  {
    path: 'MetallurgicalInfo',
    name: 'MetallurgicalInfo',
    meta: { title: '冶金信息' },
    component: lazy('MetallurgicalInfo'),
  },
  {
    path: 'DustInfo',
    name: 'DustInfo',
    meta: { title: '粉尘信息' },
    component: lazy('DustInfo'),
  },
  {
    path: 'WorkShifts',
    name: 'WorkShifts',
    meta: { title: '作业班次' },
    component: lazy('WorkShifts'),
  },
  {
    path: 'ContractorInfo',
    name: 'ContractorInfo',
    meta: { title: '承包商信息' },
    component: lazy('ContractorInfo'),
  },
  {
    path: 'ChemicalEnergySourceInfo',
    name: 'ChemicalEnergySourceInfo',
    meta: { title: '化学能源信息' },
    component: lazy('ChemicalEnergySourceInfo'),
  },
];
