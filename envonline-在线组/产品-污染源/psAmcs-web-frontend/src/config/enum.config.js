/**
 * @description 枚举常量配置
 * @param {string} name 名称
 * @param {string} code 代码
 * @param {array} list 枚举列表
 */

export default [
  {
    name: '报警级别',
    code: 'ALARM_LEVEL',
    list: [
      { value: 1, label: '一级报警' },
      { value: 2, label: '二级报警' },
      { value: 3, label: '三级报警' },
      { value: 4, label: '四级报警' },
    ],
  },
  {
    name: '数据类型',
    code: 'DATA_TYPE',
    list: [
      { value: 'RT', label: '实时数据' },
      { value: 'Minute', label: '分钟数据' },
      { value: 'Hour', label: '小时数据' },
      // { value: 'AuditHour', label: '审核小时数据' },
      { value: 'Day', label: '日数据' },
      // { value: 'monthReport', label: '报表日数据' },
    ],
  },
  {
    name: '超标统计数据类型',
    code: 'EXCE_DATA_TYPE',
    list: [
      { value: 1, label: '审核小时数据' },
      { value: 2, label: '报表日数据' },
    ],
  },
  {
    name: '报表数据类型',
    code: 'REPORT_TYPE',
    list: [
      { value: 'dayReport', label: '日报表' },
      { value: 'monthReport', label: '月报表' },
      { value: 'quarterReport', label: '季度报表' },
      { value: 'yearReport', label: '年报表' },
    ],
  },
  {
    name: '季度',
    code: 'QUARTER_LEVEL',
    list: [
      { value: 0, label: '第一季度' },
      { value: 1, label: '第二季度' },
      { value: 2, label: '第三季度' },
      { value: 3, label: '第四季度' },
    ],
  },
  {
    name: '监管级别',
    code: 'KEY_POLLUTANT',
    list: [
      { value: 0, label: '非重点' },
      { value: 1, label: '重点' },
    ],
  },
  {
    name: '废水 | 废气名称',
    code: 'LABEL_NAME',
    list: [
      { value: 1, label: '废水' },
      { value: 2, label: '废气' },
    ],
  },
  {
    name: '废水 | 废气编码',
    code: 'LABEL_CODE',
    list: [
      { value: 1, label: 'Water' },
      { value: 2, label: 'Air' },
    ],
  },
  {
    name: '废水 | 废气子类型值拼接 get 请求',
    code: 'CHILD_PORT_TYPES',
    list: [
      { value: 1, label: '1,2,3' }, // 废水排除留样 4、总量5
      { value: 2, label: '1,2,3' },
    ],
  },
  {
    name: '废水 | 废气子类型值集合 post 请求',
    code: 'CHILD_PORT_TYPES_ARR',
    list: [
      { value: 1, label: [1, 2, 3] }, // 废水排除留样 4
      { value: 2, label: [1, 2, 3] },
    ],
  },
  {
    name: '数据审核', // 状态枚举
    code: 'AUDITSTATUS',
    list: [
      { value: -1, label: '没有数据审核' },
      { value: 0, label: '待人工审核' },
      { value: 1, label: '自动审核通过' },
      { value: 2, label: '人工审核通过' },
    ],
  },
  {
    name: '文件分类',
    code: 'CLASSIFY_CODE',
    list: [
      { value: 'FilingReport', label: '报表文档' },
      { value: 'PSSharingFiles', label: '普通文档' },
    ],
  },
  {
    name: '远程协议命令',
    code: 'REMOTE_PROYOCOL',
    list: [
      {
        value: 'data',
        label: { // 数据命令
          common: {
            2011: '取污染物实时数据',
            2012: '停止查看实时数据',
            2051: '取污染物分钟数据',
            2061: '取污染物小时数据',
            2031: '取污染物日数据',
            2021: '取设备运行状态',
            2022: '停止查看设备运行状态',
            2041: '取设备运行时间日历史数据',
          },
          0: {},
          1: {},
        },
      },
      {
        value: 'argument',
        label: { // 参数命令
          common: {
            1000: '设置超时时间及重发次数',
            1011: '提取现场机时间',
            1012: '设置现场机时间',
            1061: '提取实时数据间隔',
            1062: '设置实时数据间隔',
            1072: '设置现场机访问密码',
          },
          0: {},
          1: {
            1063: '提取分钟数据间隔',
            1064: '设置分钟数据间隔',
          },
        },
      },
      {
        value: 'control',
        label: { // 控制命令
          common: {
            3012: '即时采样',
            3099: '重启数采仪',
          },
          0: {
            3014: '设置采样时间周期',
          },
          1: {
            3015: '超标留样',
            3016: '设置采样时间周期',
          },
        },
      },
    ],
  },
];
