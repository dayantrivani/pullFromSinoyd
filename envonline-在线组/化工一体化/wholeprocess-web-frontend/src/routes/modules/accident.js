const lazy = path => () => import(`@/views/wholeProcess/accident/${path}`);

export default [
  {
    path: 'AccidentFile',
    name: 'AccidentFile',
    meta: { title: '事故档案' },
    component: lazy('AccidentFile'),
  },
];
