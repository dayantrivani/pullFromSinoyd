/**
 * @description 枚举常量配置
 * @param {string} name 名称
 * @param {string} code 代码
 * @param {array} list 枚举列表
 */

export default [
  {
    name: '许可证状态',
    code: 'INDUSTRY_TYPE',
    list: [
      { value: 0, label: '负面清单' },
      { value: 1, label: '主导产业' },
    ],
  },
  {
    name: '摄像头状态',
    code: 'DEVSTATUS',
    list: [
      { value: 1, label: '正常' },
      { value: 2, label: '报废' },
    ],
  },
  {
    name: '摄像头类型',
    code: 'DEVTYPE',
    list: [
      { value: 'default', label: '默认' },
    ],
  },
  {
    name: '因子类型',
    code: 'FACTORS_TYPE',
    list: [
      { value: 1, label: '废水' },
      { value: 2, label: '废气' },
      { value: 3, label: '土壤' },
      { value: 4, label: '地下水' },
      { value: 5, label: '噪声' },
    ],
  },
];
