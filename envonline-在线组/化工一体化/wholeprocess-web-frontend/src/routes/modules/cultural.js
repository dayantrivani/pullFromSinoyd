const lazy = path => () => import(`@/views/wholeProcess/cultural/${path}`);

export default [
  {
    path: 'SafetyConference',
    name: 'SafetyConference',
    meta: { title: '安全会议' },
    component: lazy('SafetyConference'),
  },
  {
    path: 'SafetyActivity',
    name: 'SafetyActivity',
    meta: { title: '安全活动' },
    component: lazy('SafetyActivity'),
  },
  {
    path: 'SafetyNews',
    name: 'SafetyNews',
    meta: { title: '安全动态' },
    component: lazy('SafetyNews'),
  },
  {
    path: 'RationalizationProposal',
    name: 'RationalizationProposal',
    meta: { title: '合理化建议' },
    component: lazy('RationalizationProposal'),
  },
  {
    path: 'RationalizationProposalReview',
    name: 'RationalizationProposalReview',
    meta: { title: '建议审核' },
    component: lazy('RationalizationProposalReview'),
  },
];
