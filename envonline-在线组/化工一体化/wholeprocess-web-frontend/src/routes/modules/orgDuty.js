const lazy = path => () => import(`@/views/wholeProcess/orgDuty/${path}`);

export default [
  {
    path: 'ManagNetwork',
    name: 'ManagNetwork',
    meta: { title: '安全管理网络' },
    component: lazy('ManagNetwork'),
  },
  {
    path: 'JobSafetyDuty',
    name: 'JobSafetyDuty',
    meta: { title: '安全职责' },
    component: lazy('JobSafetyDuty'),
  },
  {
    path: 'SafetyRespIssue',
    name: 'SafetyRespIssue',
    meta: { title: '安全责任书下发' },
    component: lazy('SafetyRespIssue'),
  },
  {
    path: 'SafetyRespReceipt',
    name: 'SafetyRespReceipt',
    meta: { title: '安全责任书回执' },
    component: lazy('SafetyRespReceipt'),
  },
  {
    path: 'SafetyCommitment',
    name: 'SafetyCommitment',
    meta: { title: '安全承诺书' },
    component: lazy('SafetyCommitment'),
  },
];
