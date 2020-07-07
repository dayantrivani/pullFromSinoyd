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
  {
    name: '排污核定是否启用',
    code: 'APPROVAL_ISENABLE',
    list: [
      { value: 0, label: '停用' },
      { value: 1, label: '启用' },
    ],
  },
  {
    name: '排污阈值阈值模式',
    code: 'THRESHOLD_MODE',
    list: [
      { value: 1, label: '日' },
      { value: 2, label: '月' },
      { value: 3, label: '年' },
    ],
  },
  {
    name: '站点配置浓度下发状态',
    code: 'PORT_ISAVGSEND',
    list: [
      { value: 0, label: '未下发' },
      { value: 1, label: '命令下发中' },
      { value: 2, label: '下发失败' },
      { value: 5, label: '修改未下发' },
      { value: 6, label: '取消命令下发中' },
      { value: 7, label: '取消命令下发失败' },
      { value: 8, label: '取消命令下发成功' },
      { value: 10, label: '已下发' },
    ],
  },
  {
    name: '站点方案配置总量下发状态',
    code: 'PORT_ISCOUSEND',
    list: [
      { value: 0, label: '未下发' },
      { value: 1, label: '命令下发中' },
      { value: 2, label: '下发失败' },
      { value: 5, label: '修改未下发' },
      { value: 6, label: '取消命令下发中' },
      { value: 7, label: '取消命令下发失败' },
      { value: 8, label: '取消命令下发成功' },
      { value: 10, label: '已下发' },
    ],
  },
  // {
  //   name: '阈值类型',
  //   code: 'THRESHOLD_TYPE',
  //   list: [
  //     { value: 1, label: '总量阈值' },
  //     { value: 2, label: '浓度阈值' },
  //   ],
  // },
  {
    name: '开阀时段执行周期',
    code: 'TIME_EXECCYCLE',
    list: [
      { value: 1, label: '日' },
      { value: 2, label: '月' },
      { value: 3, label: '年' },
    ],
  },
  {
    name: '开阀时段配置是否启用',
    code: 'TIME_STATUS',
    list: [
      { value: 0, label: '停用' },
      { value: 1, label: '启用' },
    ],
  },
  {
    name: '开阀时段配置命令下发状态',
    code: 'TIME_EXECSTATUS',
    list: [
      { value: 0, label: '未下发' },
      { value: 1, label: '启用命令下发中' },
      { value: 2, label: '启用命令下发失败' },
      { value: 3, label: '停用命令下发中' },
      { value: 4, label: '停用命令下发失败' },
      { value: 10, label: '已下发' },
    ],
  },
  {
    name: '阀门申报审核状态',
    code: 'VALVE_CHECK_STATUS',
    list: [
      { value: 0, label: '保存中' },
      { value: 1, label: '申报中' },
      { value: 2, label: '已审核' },
      { value: 3, label: '已退回' },
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
            2881: '取阀门动态信息',
            2831: '提取日数据',
            2861: '提取小时数据',
            2873: '提取报警历史',
            1: '提取关阀总量阈值命令',
            2: '提取关阀浓度阈值命令',
            // 2022: '停止查看设备运行状态',
            // 2041: '取设备运行时间日历史数据',
          },
          0: {},
          1: {},
        },
      },
      {
        value: 'control',
        label: { // 控制命令
          common: {
            3812: '应急状态',
          },
          0: {},
          1: {},
        },
      },
      {
        value: 'valve',
        label: { // 控制命令
          common: {
            3810: '远程开阀',
            3811: '远程关阀',
            3812: '解除阀门控制',
          },
          0: {},
          1: {},
        },
      },
    ],
  },
  {
    name: '数据值类型',
    code: 'DATA——VALUE_TYPE',
    list: [
      { value: 1, label: '排放量' },
      { value: 2, label: '浓度' },
      { value: 0, label: '排放量与浓度' },
    ],
  },
  {
    name: '数据类型',
    code: 'DATA_TYPE',
    list: [
      { value: 'RT', label: '实时数据' },
      { value: 'Minute', label: '分钟数据' },
      { value: 'Hour', label: '小时数据' },
      { value: 'AuditHour', label: '审核小时数据' },
      { value: 'Day', label: '日数据' },
      { value: 'monthReport', label: '报表日数据' },
    ],
  },
  {
    name: '报警记录处理状态',
    code: 'ALARM_DEALTYPE',
    list: [
      { value: 0, label: '未处理' },
      { value: 1, label: '已处理' },
    ],
  },
  {
    name: '报警记录报警等级',
    code: 'ALARM_LEVEL',
    list: [
      { value: 1, label: '一级报警' },
      { value: 2, label: '二级报警' },
      { value: 3, label: '三级报警' },
      { value: 4, label: '四级报警' },
    ],
  },
  {
    name: 'IC卡状态',
    code: 'IC_CARD_STATUS',
    list: [
      { value: 1, label: '有效' },
      { value: 2, label: '无效' },
    ],
  },
  {
    name: '排放量统计数据类型',
    code: 'REPORT_TYPELIST',
    list: [
      { value: 'dayReport', label: '日' },
      { value: 'monthReport', label: '月' },
      { value: 'yearReport', label: '年' },
    ],
  },
  {
    name: 'IC卡类型',
    code: 'IC_CARD_TYPE',
    list: [
      { value: 1, label: '稽查卡' },
      { value: 2, label: '维护卡' },
    ],
  },
  {
    name: '控制状态',
    code: 'VALVE_CONTROL_WAY',
    list: [
      { value: '1', label: '强制控制' },
      { value: '2', label: '自动控制' },
    ],
  },
  {
    name: '阀门状态',
    code: 'VALVE_STATUS',
    list: [
      { value: '0', label: '关闭' },
      { value: '1', label: '开启' },
      { value: '5', label: '阀门故障' },
    ],
  },
  {
    name: '排口类型',
    code: 'PORT_TYPE',
    list: {
      1: {
        dictName: '废水',
        children: {
          1: { dictName: '废水常规' },
          2: { dictName: '污水厂' },
          3: { dictName: '重金属' },
          4: { dictName: '留样' },
          5: { dictName: '总量' },
        },
      },
      2: {
        dictName: '废气',
        children: {
          1: { dictName: '废气常规' },
          2: { dictName: '焚烧' },
          3: { dictName: 'VOC' },
        },
      },
      3: { dictName: '固废' },
      4: { dictName: '噪声' },
      5: {
        dictName: '雨水',
        children: {
          1: { dictName: '一拖二' },
          2: { dictName: '雨水排口' },
          3: { dictName: '清下水排口' },
        },
      },
    },
  },
  {
    name: '充值方式',
    code: 'RECHARGE_TYPE',
    list: [
      { value: 1, label: '远程充值' },
      { value: 2, label: 'IC卡充值' },
    ],
  },
];
