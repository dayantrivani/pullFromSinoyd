const lazy = path => () => import(`@/views/wholeProcess/index/${path}`);

export default [
  {
    path: 'IndexAssignmentSelfEvaluation',
    name: 'IndexAssignmentSelfEvaluation',
    meta: { title: '自评考核' },
    component: lazy('IndexAssignmentSelfEvaluation'),
  },
  {
    path: 'IndexAssignment',
    name: 'IndexAssignment',
    meta: { title: '指标分配' },
    component: lazy('IndexAssignment'),
  },
  {
    path: 'IndexSetting',
    name: 'IndexSetting',
    meta: { title: '指标设置' },
    component: lazy('IndexSetting'),
  },
  {
    path: 'IndexAssignmentConfirm',
    name: 'IndexAssignmentConfirm',
    meta: { title: '指标考核' },
    component: lazy('IndexAssignmentConfirm'),
  },
];
