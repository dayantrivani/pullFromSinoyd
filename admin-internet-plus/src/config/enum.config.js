/**
 * @description 枚举常量配置
 * @param {string} name 名称
 * @param {string} code 代码
 * @param {array} list 枚举列表
 */

export default [
  {
    name: '公告类型',
    code: 'NOTICE_CATEGOTY',
    list: [
      { value: 1, label: '通知' },
      { value: 2, label: '行政' },
      { value: 4, label: '标准规范' },
      { value: 8, label: '内部管理' },
      { value: 16, label: '其他' },
    ],
  },
  {
    name: '公告标签',
    code: 'NOTICE_LABEL',
    list: [
      { value: 1, label: '一般' },
      { value: 2, label: '紧急' },
      { value: 4, label: '重要' },
    ],
  },
  {
    name: '处理状态',
    code: 'DISPOSE_STATUS',
    list: [
      { value: 1, label: '待处理', tag: 'danger' },
      { value: 2, label: '已处理', tag: 'success' },
    ],
  },
  {
    name: '样品分类',
    code: 'SAMPLE_TYPE_CATEGORY',
    list: [
      { value: 1, label: '大类' },
      { value: 2, label: '小类' },
      { value: 3, label: '模板' },
      { value: 4, label: '方案模板' },
    ],
  },
  {
    name: '项目等级',
    code: 'GRADE',
    list: [
      { value: 0, label: '一般', tag: 'info' },
      { value: 1, label: '紧急', tag: 'warning' },
      { value: 2, label: '特急', tag: 'danger' },
    ],
  },
  {
    name: '项目状态',
    code: 'PROJECT_STATUS',
    list: [
      { value: '项目登记中', label: '项目登记中', tag: 'info' },
      { value: '开展中', label: '开展中', tag: 'warning' },
      { value: '审核未通过', label: '审核未通过', tag: 'danger' },
      { value: '项目下达中', label: '项目下达中', tag: 'primary' },
      { value: '技术审核中', label: '技术审核中', tag: 'primary' },
      { value: '数据汇总中', label: '数据汇总中', tag: 'primary' },
      { value: '结果评价中', label: '结果评价中', tag: 'primary' },
      { value: '已办结', label: '已办结', tag: 'success' },
    ],
  },
  {
    name: '报告状态',
    code: 'REPORT_STATUS',
    list: [
      { value: 1, label: '编制报告中', tag: 'info' },
      { value: 2, label: '报告未通过', tag: 'danger' },
      { value: 3, label: '报告审核中', tag: 'warning' },
      { value: 4, label: '报告签发中', tag: 'success' },
      { value: 5, label: '已签发', tag: 'success' },
    ],
  },
];
