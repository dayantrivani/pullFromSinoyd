/**
 * @description 首页默认布局配置
 * @api https://github.com/jbaysolutions/vue-grid-layout
 * @params  title: 标题文字
 *          i: 组件名
 *          w: 宽度
 *          h: 高度
 *          x: 水平偏移
 *          y: 垂直
 *          dragAllowFrom: 可触发拖拽的元素
 *          dragIgnoreFrom: 不触发拖拽的元素
 *          isResizable: 是否允许改变大小
 */

export default () => ([
  {
    title: '待办事项',
    i: 'OmStatistics',
    w: 8,
    h: 4,
    x: 0,
    y: 0,
    moved: false,
    isResizable: true,
  },
  {
    title: '快捷方式',
    i: 'ShortcutLink',
    w: 4,
    h: 4,
    x: 8,
    y: 0,
    moved: false,
    isResizable: true,
  },
  {
    title: '重点项目',
    i: 'MajorProject',
    w: 6,
    h: 8,
    x: 0,
    y: 4,
    moved: false,
    isResizable: true,
  },
  {
    title: '通知公告',
    i: 'Notification',
    w: 6,
    h: 4,
    x: 6,
    y: 4,
    moved: false,
    isResizable: true,
  },
  {
    title: '办公审批',
    i: 'OfficeApproval',
    w: 6,
    h: 4,
    x: 6,
    y: 8,
    moved: false,
    isResizable: true,
  },
]);
