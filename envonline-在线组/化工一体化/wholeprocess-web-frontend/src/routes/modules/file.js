const lazy = path => () => import(`@/views/wholeProcess/file/${path}`);

export default [
  {
    path: 'ManagementSystem',
    name: 'ManagementSystem',
    meta: { title: '管理制度', type: 'F001' },
    component: lazy('ManagementSystem'),
  }, {
    path: 'OperatingSystem',
    name: 'OperatingSystem',
    meta: { title: '操作规程', type: 'F002' },
    component: lazy('ManagementSystem'),
  }, {
    path: 'ManagementFile',
    name: 'ManagementFile',
    meta: { title: '文件管理', type: 'F003' },
    component: lazy('ManagementSystem'),
  },
];
