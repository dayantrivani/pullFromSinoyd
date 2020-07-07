/** 枚举常量 -- 只适用于当前项目
 *  用法：this.$enum.level
 */

const enums = {
  // 是否
  WHETHER: [
    { label: '是', value: true },
    { label: '否', value: false },
  ],
  // 除尘器种类
  DUSTERTYPE: [
    { label: '湿式', value: 1 },
    { label: '干式', value: 2 },
  ],
  // 除尘器种类
  ENUMSELFEVALUTE: [
    { label: '达标', value: 1 },
    { label: '未达标', value: 2 },
  ],
  // 公司级别
  RESPONSIBLE_LEVEL: [
    { label: '公司', value: 1 },
    { label: '部门', value: 2 },
    { label: '班组', value: 3 },
  ],
  // 公司级别
  QUARTER: [
    { label: '第一季度', value: 1 },
    { label: '第二季度', value: 2 },
    { label: '第三季度', value: 3 },
    { label: '第四季度', value: 4 },
  ],
  // 月份
  MONTHS: [
    { label: '一月份', value: 1 },
    { label: '二月份', value: 2 },
    { label: '三月份', value: 3 },
    { label: '四月份', value: 4 },
    { label: '五月份', value: 5 },
    { label: '六月份', value: 6 },
    { label: '七月份', value: 7 },
    { label: '八月份', value: 8 },
    { label: '九月份', value: 9 },
    { label: '十月份', value: 10 },
    { label: '十一月份', value: 11 },
    { label: '十二月份', value: 12 },
  ],
  NEWSTYPE: [
    { label: '公司新闻', value: 1 },
    { label: '公告通知', value: 2 },
    { label: '其他新闻', value: 3 },
  ],
  CONFERENCETYPE: [
    { label: '公司级', value: 1 },
    { label: '部门级', value: 2 },
    { label: '临时会议', value: 3 },
    { label: '其他会议', value: 4 },
  ],
  CONFERENCESTATUS: [
    { label: '待开', value: 1 },
    { label: '推迟', value: 2 },
    { label: '结束', value: 3 },
  ],
  AGREEMENTTYPE: [
    { label: '隐患', value: 1 },
    { label: '措施', value: 2 },
    { label: '经验', value: 3 },
    { label: '其他', value: 4 },
  ],
  REVIEWSTATUS: [
    { label: '待审核', value: 0 },
    { label: '通过', value: 1 },
    { label: '不通过', value: 2 },
  ],
  WORKTYPE: [
    { label: '动火作业', value: 1 },
    { label: '进入受限空间', value: 2 },
    { label: '高处作业', value: 4 },
    { label: '吊装作业', value: 8 },
    { label: '盲板抽堵', value: 16 },
    { label: '动土作业', value: 32 },
    { label: '断路作业', value: 64 },
    { label: '临时用电', value: 128 },
    { label: '其他', value: 256 },
  ],
  WORKSTATUS: [
    { label: '所有', value: -1 },
    { label: '未完成', value: 0 },
    { label: '已完成', value: 1 },
  ],
  FIREWORKLEVEL: [
    { label: '特殊', value: 0 },
    { label: '一级', value: 1 },
    { label: '二级', value: 2 },
  ],
  CONFINEDSPACE: [
    { label: '特殊', value: 0 },
    { label: '一般', value: 1 },
  ],
  HEIGHTWORKLEVEL: [
    { label: '一级', value: 1 },
    { label: '二级', value: 2 },
    { label: '三级', value: 3 },
    { label: '四级', value: 4 },
  ],
  SPECIALCASES: [
    { label: '阵风风力六级以上的强风高处作业', value: 1 },
    { label: '异温高处作业', value: 2 },
    { label: '雪天高处作业', value: 4 },
    { label: '雨天高处作业', value: 8 },
    { label: '夜间高处作业', value: 16 },
    { label: '带电高处作业', value: 32 },
    { label: '悬空高处作业', value: 64 },
    { label: '抢救高处作业', value: 128 },
  ],
  HOISTINGWORKLEVEL: [
    { label: '一级', value: 1 },
    { label: '二级', value: 2 },
    { label: '三级', value: 3 },
  ],
  TEMPORARYELECTRICITYWORKLEVEL: [
    { label: '涉及变配电所', value: 1 },
    { label: '内部临时用电', value: 2 },
  ],
  HEALTHCHECKTYPE: [
    { label: '定期', value: 1 },
    { label: '岗前', value: 2 },
    { label: '岗中', value: 3 },
    { label: '离岗', value: 4 },
  ],
  ACCIDENTTYPE: [
    { label: '死亡Fatal', value: 1 },
    { label: '损工事故', value: 2 },
    { label: '医疗处理事故', value: 3 },
    { label: '急救事故', value: 4 },
    { label: '幸免事故', value: 5 },
  ],
  ACCIDENTLEVEL: [
    { label: '一般', value: 1 },
    { label: '较大', value: 2 },
    { label: '重大', value: 3 },
    { label: '特大', value: 4 },
  ],
  ACCIDENTNATURE: [
    { label: '责任事故', value: 1 },
    { label: '意外事故', value: 2 },
    { label: '其他', value: 3 },
  ],
};
enums.getValue = (name, label) => {
  const temp = enums[name].find(p => p.label === label);
  return temp ? temp.value : '';
};
enums.getLabel = (name, value) => {
  const temp = enums[name].find(p => p.value === value);
  return temp ? temp.label : '';
};

export default enums;
