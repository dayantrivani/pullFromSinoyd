/**
 * @description 枚举常量配置
 * @param {string} name 名称
 * @param {string} code 代码
 * @param {array} list 枚举列表
 */

export default [
  {
    name: '许可证状态',
    code: 'LICENCE_STATUS',
    list: [
      { value: 0, label: '过期' },
      { value: 1, label: '有效' },
    ],
  },
  // 检查专用,后期删除
  {
    name: '数据类型',
    code: 'DATA_TYPE',
    list: [
      { value: 'Hour', label: '小时数据' },
      { value: 'Day', label: '日数据' },
    ],
  },
  {
    name: '因子选择',
    code: 'FACTORS',
    list: [
      { value: 'w01001-Avg', label: 'PH' },
      { value: 'w01018-Avg', label: 'COD' },
    ],
  },
];
