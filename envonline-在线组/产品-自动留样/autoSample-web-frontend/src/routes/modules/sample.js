const lazy = path => () => import(`@/views/${path}`);

export default [
  {
    path: 'OverSampleRecord',
    name: 'OverSampleRecord',
    meta: { title: '超标留样记录' },
    component: lazy('OverSampleRecord'),
  }, {
    path: 'RemoteSampleRecord',
    name: 'RemoteSampleRecord',
    meta: { title: '远程留样记录' },
    component: lazy('RemoteSampleRecord'),
  }, {
    path: 'OverSampleSetting',
    name: 'OverSampleSetting',
    meta: { title: '超标留样配置' },
    component: lazy('OverSampleSetting'),
  }, {
    path: 'SampleQuery',
    name: 'SampleQuery',
    meta: { title: '留样数据' },
    component: lazy('SampleQuery'),
  }, {
    path: 'TimingSampleSetting',
    name: 'TimingSampleSetting',
    meta: { title: '定时留样配置' },
    component: lazy('TimingSampleSetting'),
  }, {
    path: 'LeaveSamplesSetting',
    name: 'LeaveSamplesSetting',
    meta: { title: '立即留样下达' },
    component: lazy('LeaveSamplesSetting'),
  }, {
    path: 'RTOnlineListQuery',
    name: 'RTOnlineListQuery',
    meta: { title: '实时在线列表' },
    component: lazy('RTOnlineListQuery'),
  }, {
    path: '',
    name: 'Home',
    meta: { title: '首页' },
    component: lazy('Home'),
  }, {
    path: 'AutoSampleQuery',
    name: 'AutoSampleQuery',
    meta: { title: '自动监测数据查询' },
    component: lazy('AutoSampleQuery'),
  }, {
    path: 'AlarmRecord',
    name: 'AlarmRecord',
    meta: { title: '报警记录' },
    component: lazy('AlarmRecord'),
  }, { // 门禁记录
    path: 'AccessCardRecord',
    name: 'AccessCardRecord',
    meta: { title: '门禁记录' },
    component: lazy('AccessCardRecord'),
  }, { // 组态图
    path: 'SampleWorking',
    name: 'SampleWorking',
    meta: { title: '工况组态图' },
    component: lazy('SampleWorking'),
  },
];
