/** 枚举常量 -- 只适用于当前项目
 *  用法：this.$enum.level
 */

const enums = {
  // level: {
  //   1: '一级',
  //   2: '二级',
  //   3: '三级',
  //   4: '四级',
  // },

  // 报警级别
  alarmLevel: {
    1: '一级报警',
    2: '二级报警',
    3: '三级报警',
    4: '四级报警',
  },
  // 数据类型
  dataType: [
    { value: 'RT', label: '实时数据' },
    { value: 'Minute', label: '分钟数据' },
    { value: 'Hour', label: '小时数据' },
    { value: 'AuditHour', label: '审核小时数据' },
    { value: 'Day', label: '日数据' },
    { value: 'monthReport', label: '报表日数据' },
  ],
  // 超标统计数据类型
  ExceDataType: {
    1: '审核小时数据',
    2: '报表日数据',
  },
  // 报表数据类型
  reportType: [
    { value: 'dayReport', label: '日报表' },
    { value: 'monthReport', label: '月报表' },
    { value: 'quarterReport', label: '季度报表' },
    { value: 'yearReport', label: '年报表' },
  ],
  // 季度
  quarterLevel: {
    1: '第一季度',
    2: '第二季度',
    3: '第三季度',
    4: '第四季度',
  },
  // 监管级别
  keyPollutant: [
    { value: 0, label: '非重点' },
    { value: 1, label: '重点' },
  ],
  // 废水 | 废气名称
  labelName: {
    1: '废水',
    2: '废气',
  },
  // 废水 | 废气编码
  labelCode: {
    1: 'Water',
    2: 'Air',
  },
  // 废水 | 废气子类型值拼接 get 请求
  childPortTypes: {
    1: '1,2,3',     // 废水排除留样 4、总量5
    2: '1,2,3',
  },
  // 废水 | 废气子类型值集合 post 请求
  childPortTypesArr: {
    1: [1, 2, 3],   // 废水排除留样 4
    2: [1, 2, 3],
  },
  // 数据审核 状态枚举
  auditStatus: {
    '没有数据审核': -1,
    '待人工审核': 0,
    '自动审核通过': 1,
    '人工审核通过': 2,
  },
  // 文件分类
  classifyCode: [
    { name: '报表文档', code: 'FilingReport' },
    { name: '普通文档', code: 'PSSharingFiles' },
  ],
  // 各个协议对应命令
  protocol: {
    data: { // 数据命令
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
    argument: { // 参数命令
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
    control: { // 控制命令
      common: {
        3012: '即时采样',
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
};

export default enums;
