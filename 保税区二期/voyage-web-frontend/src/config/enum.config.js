/**
 * @description 枚举常量配置
 * @param {string} name 名称
 * @param {string} code 代码
 * @param {array} list 枚举列表
 */

export default [
  {
    name: '走航任务状态',
    code: 'TASK_STATUS',
    list: [
      { value: 0, label: '未上传' },
      { value: 1, label: '已上传' },
    ],
  },
  {
    name: '走航结果',
    code: 'TASK_RESULT',
    list: [
      { value: 1, label: '正常' },
      { value: 2, label: '异常' },
      { value: 0, label: '结果未出' },
    ],
  },
  {
    name: '走航任务类型',
    code: 'TASK_TYPE',
    list: [
      { value: 1, label: '例行走航' },
      { value: 2, label: '应急走航' },
      { value: 3, label: '其他' },
    ],
  },
  {
    name: '异常管理处理状态',
    code: 'DEAL_STATUS',
    list: [
      { value: 0, label: '未处理' },
      { value: 1, label: '已处理' },
    ],
  },
];
