/**
 * @deprecated  枚举常量
 *              不在快速开发平台中维护的、固定的常量
 *              调用：$enum[key]
 * @link 192.168.6.10:8080/frame
 */

const enums = {
  // 数据类型
  DATA_TYPE: [
    {
      value: 'R',
      label: '实时数据',
    },
    {
      value: 'M',
      label: '分钟数据',
    },
    {
      value: 'H',
      label: '小时数据',
    },
    {
      value: 'HA',
      label: '已审核小时数据',
    },
    {
      value: 'D',
      label: '日数据',
    },
    {
      value: 'DA',
      label: '已审核日数据',
    },
  ],
  // 公告状态
  NOTICE_STATUS: {
    '0': '未发布',
    '1': '发布',
  },
  // 关注程度
  ATTENTION_LEVEL: [
    {
      value: 1,
      label: '国控',
    },
    {
      value: 2,
      label: '省控',
    },
    {
      value: 4,
      label: '市控',
    },
    {
      value: 8,
      label: '区控',
    },
  ],

  // 企业运行状态
  RUN_STATUS: {
    '1': '停产',
    '2': '检修',
    '3': '停运',
  },

  // 审核状态
  CHECK_STATUS: {
    '1': '待审核',
    '2': '不通过',
    '3': '通过',
  },

  // 推送状态
  PUSH_STATE: {
    '1': '成功',
    '2': '失败',
  },

  // 计分周期
  SCORE_CYCLING: [
    {
      value: 'season',
      label: '季度',
    },
    {
      value: 'month',
      label: '月份',
    },
  ],
};

export default enums;
