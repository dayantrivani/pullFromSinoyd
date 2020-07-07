// 基础信息配置 - 路由配置

const lazy = path => () => import(`@/views/ldar/${path}`);

export default [
  {
    path: 'LDARPlan',
    name: 'LDARPlan',
    meta: { title: '计划管理' },
    component: lazy('LDARPlan'),
  },
  {
    path: 'LDARProjectManage',
    name: 'LDARProjectManage',
    meta: { title: '项目管理' },
    component: lazy('LDARProjectManage'),
  },
  {
    path: 'LDARAlarmRecord',
    name: 'LDARAlarmRecord',
    meta: { title: '报警记录' },
    component: lazy('LDARAlarmRecord'),
  },
  {
    path: 'LDARAlarmRules',
    name: 'LDARAlarmRules',
    meta: { title: '报警规则' },
    component: lazy('LDARAlarmRules'),
  },
  {
    path: 'LDARHome',
    name: 'LDARHome',
    meta: { title: '首页' },
    component: lazy('LDARHome'),
  },
  {
    path: 'LDARTestCompanyInfo',
    name: 'LDARTestCompanyInfo',
    meta: { title: '检测机构管理' },
    component: lazy('LDARTestCompanyInfo'),
  },
  {
    path: 'DataInterfaceLog',
    name: 'DataInterfaceLog',
    meta: { title: '上传日志' },
    component: lazy('DataInterfaceLog'),
  },
];
