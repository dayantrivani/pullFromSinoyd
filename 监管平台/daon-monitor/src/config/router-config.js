/**
 * @description 动态路由定义
 * @param {boolean} meta.hide     是否隐藏标签 false
 * @param {boolean} meta.lock     是否锁定页面 false
 * @param {boolean} meta.cache    是否允许缓存页面 false
 */
export default [
  {
    path: 'home',
    name: 'home',
    component: () => import('@/views/home'),
  },
  // {
  //   path: 'EpLegal',
  //   name: 'EpLegal',
  //   component: () => import('@/views/ep-legal'),
  // },
  {
    path: 'WaterDataQuery',
    name: 'WaterDataQuery',
    component: () => import('@/views/water-data-query'),
  },
  {
    path: 'WaterAlarmManage',
    name: 'WaterAlarmManage',
    component: () => import('@/views/water-alarm-manage'),
  },
  {
    path: 'RankDetail',
    name: 'RankDetail',
    component: () => import('@/views/monitor-center/rank-detail'),
  },
  {
    path: 'ItemRegister',
    name: 'ItemRegister',
    component: () => import('@/views/monitor-center/item-register'),
  },
  {
    path: 'AutoScoreConfig',
    name: 'AutoScoreConfig',
    component: () => import('@/views/scheme-config/auto-score-config'),
  },
  {
    path: 'ManualScoreConfig',
    name: 'ManualScoreConfig',
    component: () => import('@/views/scheme-config/manual-score-config'),
  },
  {
    path: 'ScoreCycleConfig',
    name: 'ScoreCycleConfig',
    component: () => import('@/views/scheme-config/score-cycle-config'),
  },
  {
    path: 'Notice',
    name: 'Notice',
    component: () => import('@/views/notice'),
  },
  {
    path: 'EnterManagement',
    name: 'EnterManagement',
    component: () => import('@/views/enter-management'),
  },
  {
    path: 'UserManagement',
    name: 'UserManagement',
    component: () => import('@/views/user-management'),
  },
  {
    path: 'RoleManagement',
    name: 'RoleManagement',
    component: () => import('@/views/role-management'),
  },
  {
    path: 'EnterDeclare',
    name: 'EnterDeclare',
    component: () => import('@/views/enter-declare'),
  },
  {
    path: 'FaultAlarmQuery',
    name: 'FaultAlarmQuery',
    component: () => import('@/views/fault-alarm-query'),
  },
  {
    path: 'RealStandManage',
    name: 'RealStandManage',
    component: () => import('@/views/real-stand-manage'),
  },
  {
    path: 'OperatRecords',
    name: 'OperatRecords',
    component: () => import('@/views/operat-records'),
  },
  {
    path: 'ExcessNotice',
    name: 'ExcessNotice',
    component: () => import('@/views/excess-notice'),
  },
  {
    path: 'ExceptionLogGPush',
    name: 'ExceptionLogGPush',
    component: () => import('@/views/exception-log-push'),
  },
  {
    path: 'AbnormalDivision',
    name: 'AbnormalDivision',
    component: () => import('@/views/abnormal-division'),
  },
  {
    path: 'MaintainRankDetail',
    name: 'MaintainRankDetail',
    component: () => import('@/views/maintain-company/maintain-rank-detail'),
  },
  {
    path: 'MaintainItemRegister',
    name: 'MaintainItemRegister',
    component: () => import('@/views/maintain-company/maintain-item-register'),
  },
  {
    path: 'MaintainAutoScoreConfig',
    name: 'MaintainAutoScoreConfig',
    component: () => import('@/views/maintain-company/maintain-auto-score-config'),
  },
  {
    path: 'MaintainManualScoreConfig',
    name: 'MaintainManualScoreConfig',
    component: () => import('@/views/maintain-company/maintain-manual-score-config'),
  },
  {
    path: 'MaintainScoreCycleConfig',
    name: 'MaintainScoreCycleConfig',
    component: () => import('@/views/maintain-company/maintain-score-cycle-config'),
  },
  {
    path: 'MaintainManagement',
    name: 'MaintainManagement',
    component: () => import('@/views/maintain-company/maintain-management'),
  },
  {
    path: 'FormSet',
    name: 'FormSet',
    component: () => import('@/views/form-set'),
  },
  {
    path: 'SupervisionTasks',
    name: 'SupervisionTasks',
    component: () => import('@/views/supervision-tasks'),
  },
  {
    path: 'MonitoringCenter',
    name: 'MonitoringCenter',
    component: () => import('@/views/monitoring-center'),
  },
];
