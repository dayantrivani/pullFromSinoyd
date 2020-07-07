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
];
