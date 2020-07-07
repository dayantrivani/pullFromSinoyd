// 枚举常量 Enum Constant

const enums = {
  // 重点源种类
  keyPollutantCategory: {
    1: '水环境',
    2: '大气环境',
    4: '土壤环境',
    8: '生环境',
    16: 'VOCS',
    32: '其他',
  },
  // PickingInfo
  pickingStatus: {
    1: '申请新建',
    2: '不发料',
    3: '申请提交',
    4: '审批通过',
    5: '已发料',
  },
  portTypes: {
  },
  status: {
    0: '停用',
    1: '启用',
  },
  // 所属类型
  category: {
    1: '废水',
    2: '废气',
    3: '固废',
    4: '噪声',
  },
  // 卡类型 -- -1 是指所有 写在门禁卡配置页面
  cardType: {
    1: '运维卡',
    2: '管理卡',
  },
  // 卡状态
  cardStatus: {
    1: '正常',
    2: '停用',
  },
  // 关注程度
  attentionDegree: {
    1: '国控',
    2: '省控',
    4: '市控',
    8: '区控',
  },
  // 报警状态  -1 代表所有
  alarmStatus: {
    1: '满样预警',
    2: '满样报警',
  },
  // 留样仪状态 -1 代表所有
  sampleInsStatus: {
    0: '待机',
    1: '工作中',
    98: '故障',
    99: '维护',
  },
  portType: {
    1: '废水',
    2: '废气',
    3: '固废',
    4: '噪声',
    5: '雨水',
  },
};

export default {
  install(Vue) {
    // eslint-disable-next-line
    Vue.enum = Vue.prototype.$enum = enums;
  },
};
