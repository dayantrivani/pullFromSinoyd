// 枚举常量 Enum Constant

const enums = {
  // 样品类型
  sampleType: {
    0: '所有',
    1: '水和废水',
    2: '噪声、振动',
    4: '空气和废气',
    8: '土壤、底质',
  },

  // 曲线参数类型
  curveType: {
    1: '普通',
    2: '紫外',
    3: '荧光',
    4: '石墨炉',
  },

  // 计量单位
  dimensionUnit: {
    1: 'μs/cm',
    2: 'mmol/L',
    3: 'm/s',
    4: 'μg/kg',
    5: 'μg/L',
    6: 'KPa',
    7: '个/mL',
    8: '稀释倍数',
    9: '个/L',
    10: '℃',
    11: 'dB(A)',
    12: 'mg/L',
    13: '万吨',
    14: '无量纲',
  },

  // 分析项目
  analysisItem: {
    1: '铵离子',
    2: 'Lmin',
    3: '五日生化需氧量',
    4: '噪声源噪声',
    5: '叶绿素a',
    6: '镁离子',
    7: '夜间Leq',
    8: '藻密度',
  },

  // 分析方法
  analysisMethod: {
    '3.3.7.3': '钼酸铵分光光度法 《水和废水监测分析方法》（第四版） 国家环境保护总局 3.3.7.3',
    'GB/T10071': '《城市区域环境振动测量方法》',
    'HJ/T67': '《大气固定污染源氟化物的测定离子选择电极法》',
    'HJ/T64.1': '《大气固定污染源镉的测定火焰原子吸收分光光度法》',
    'HJ/T63.1': '《大气固定污染源锡的测定石墨炉原子吸收分光光度法》',
    'GB/T13580.4': '《大气降水PH值的测定电极法》',
  },

  // 资格
  // cert: {
  //   0: '非认可认证',
  //   1: '认可',
  //   2: '认证',
  //   3: '认证认可',
  // },

  // 控件类型
  componentType: {
    1: '文本控件',
    2: '数字控件',
    3: '日期控件',
    4: '下拉框控件',
    5: '单选组控件',
    6: '多选组控件',
    7: '日期时间控件',
    8: '文本区域控件',
    9: '时间控件',
  },

  // 进度条状态
  planStatus: {
    1: 'bg-success',
    2: 'bg-warning',
    3: 'bg-danger',
  },

  // 项目类型
  projectType: {
    1: '应急监制',
    2: '上级任务',
    3: '验收监制',
    4: '环境质量',
    5: '大队送样',
    6: '样品委托',
  },

  // 使用类型
  useTye: {
    1: '采样',
    2: '分析',
    4: '现场分析',
  },

  // 仪器类型
  instrumentType: {
    1: '现场设备',
    2: '玻璃仪器',
    3: '辅助设备',
    4: '采样设备',
    5: '一般仪器',
    6: '分析设备',
    7: '应急设备',
    8: '自动设备',
  },

  // 材料审核状态
  materialStatus: {
    1: '新建',
    2: '不发料',
    3: '申请提交',
    4: '审批通过',
    5: '已发料',
    6: '已领料',
  },

  // 领用日志类型
  typeData: {
    1: '高纯物质',
    2: '生物染色剂',
    3: '色谱纯试剂',
    4: '仪器设备',
    5: '特殊专用试剂',
    6: '指示剂',
    7: '生化试剂',
    8: '仪器配件',
    9: '滤膜滤纸',
    10: '高纯物质',
    11: '其他类',
    12: '优级纯',
  },

  // 领用人
  pickingData: {
    1: '刘笑蓉',
    2: '孙小峰',
    3: '系统管理员',
    4: '远大信息',
  },

  // 消耗品类别
  expendableType: {
    1: '危险品',
    2: '指示剂',
    3: '仪器配件',
  },

  // PickingInfo
  pickingStatus: {
    1: '申请新建',
    2: '不发料',
    3: '申请提交',
    4: '审批通过',
    5: '已发料',
  },

  // rowGuid 为空时传的值
  emptyRowGuid: '00000000-0000-0000-0000-000000000000',
  // 量纲类型为无量纲时
  dimensionTypeId: '5d053c050c49453781b96c4c67cd454a',

  // 检测类型分类
  category: {
    1: '废水',
    2: '废气',
    3: '固废',
    4: '噪声',
  },

  cert: [
    { value: 0, label: '非认可认证' },
    { value: 1, label: '认证' },
    { value: 2, label: '认可' },
    { value: 4, label: '认证认可' },
  ],

  contractStatus: [
    { value: 0, label: '未签' },
    { value: 1, label: '已签' },
  ],
  // 收款状态
  paymentStatus: [
    { value: 0, label: '未收款' },
    { value: 1, label: '部分收款' },
    { value: 2, label: '已收款' },
  ],

  // 收/付款类型
  moneyType: [
    { value: 1, label: '收款' },
    { value: 2, label: '付款' },
    { value: 3, label: '坏账' },
  ],

  // 付款类型
  moneyTypeLess: [
    { value: 1, label: '收款' },
    { value: 3, label: '坏账' },
  ],

  // 文件状态
  fileStatus: [
    { value: 1, label: '未受控' },
    { value: 2, label: '受控申请中' },
    { value: 3, label: '修订中' },
    { value: 4, label: '废止中' },
    { value: 5, label: '已受控' },
    { value: 6, label: '已废止' },
  ],


  // 车辆状态
  vehicleType: [
    { value: 1, label: '正常' },
    { value: 2, label: '维修' },
    { value: 3, label: '停用' },
    { value: 4, label: '报废' },
  ],

  // 文件操作权限
  operatingAuth: {
    addFolder: 1,
    deleteFolder: 2,
    upload: 4,
    download: 8,
    deleteFile: 16,
    updateFolder: 32,
  },

  // 关系类型
  relationshipType: [
    { value: 1, label: '自检' },
    { value: 2, label: '上报' },
  ],

  // 公式类型
  formulaType: [
    { portName: 'Abs', portId: 'Abs' },
    { portName: 'Acos', portId: 'Acos' },
    { portName: 'Asin', portId: 'Asin' },
    { portName: 'Atan', portId: 'Atan' },
    { portName: 'Ceiling', portId: 'Ceiling' },
    { portName: 'Floor', portId: 'Floor' },
    { portName: 'Pow', portId: 'Pow' },
    { portName: 'Exp', portId: 'Exp' },
    { portName: 'IEEERemainder', portId: 'IEEERemainder' },
  ],

  // 消费管理
  expenseCalendar: [
    { value: 1, label: '维修' },
    { value: 2, label: '保养' },
    { value: 3, label: 'ETC' },
    { value: 4, label: '年检' },
    { value: 5, label: '车险' },
    { value: 6, label: 'GIS流量费' },
    { value: 7, label: '其他' },
  ],

  // 仪器设备状态
  instrumentStatus: [
    { value: 0, label: '报废' },
    { value: 1, label: '正常' },
    { value: 2, label: '停用' },
    { value: 3, label: '过期' },
  ],


  // 溯源方式
  originType: [
    { value: 1, label: '检定' },
    { value: 2, label: '校准' },
    { value: 3, label: '自校' },
  ],

  // 文件类型
  fileType: [
    { value: 1, label: '常量程序文件' },
    { value: 2, label: '标准文件' },
    { value: 4, label: '质量手册' },
    { value: 16, label: '作业指导书' },
    { value: 32, label: '记录单' },
  ],

  // 评价状态
  evaluationState: [
    { value: 0, label: '未评价' },
    { value: 1, label: '已评价' },
  ],

  // 行业类型-大类-小类-条件项
  treeIcon: {
    2: 'icon icon-hangyeleixing1 text-warning',
    3: 'fas fa-tags text-success',
    4: 'fas fa-tag text-primary',
    5: 'fas fa-hashtag text-info',
  },

  // 组件类型
  componentsType: [
    { value: 1, label: '文本控件' },
    { value: 2, label: '文本区域控件' },
    { value: 3, label: '下拉控件' },
    { value: 4, label: '日期控件' },
    { value: 5, label: '时间控件' },
    { value: 6, label: '日期时间控件' },
    { value: 7, label: '单选控件' },
    { value: 8, label: '多选控件' },
    { value: 9, label: '数字控件' },
    { value: 10, label: '开关控件' },
  ],

  // 公告类型
  noticeTypes: [
    { value: 1, label: '通知' },
    { value: 2, label: '行政' },
    { value: 3, label: '标准规范' },
    { value: 4, label: '内部管理' },
    { value: 5, label: '其他' },
  ],
  // 符号按钮组
  symbolGroup: [
    '+', '-', '*', '/', '%', '<', '>', '<=', '>=', '=', '==', '!=', '<>',
    '(', ')', '>>', '<<', '!', 'not', '&', '|', '^', '~', '&&', 'and', '||', 'or', 'if()',
  ],
  // 参数类型
  paramType: {
    1: '公共参数',
    2: '样品参数',
    3: '分析项目参数',
  },
  // 企业类型
  psTypeList: {
    1: '废水',
    2: '烟气',
    3: '水气',
    4: '其他',
  },
  // 排放口类型
  PortTypeList: {
    1: '废水',
    2: '废气',
    3: '固废',
    4: '噪声',
  },
  // 排口类型(气)
  GasPortTypeList: {
    1: '烟气',
    2: '焚烧',
    3: 'VOC',
  },
  // 关注程度
  AttentionDegreeList: {
    1: '国控',
    2: '省控',
    4: '市控',
    8: '区控',
  },
  // 上传标识
  UpLoadFlagList: {
    0: '未上传',
    1: '已上传',
    2: '预上传',
  },
  evalTypeList: {
    1: '水和废水',
    2: '空气与废气',
    3: '固废',
    4: '噪声',
  },
  FactorsType: {
    1: '废水',
    2: '废气',
    3: '土壤',
    4: '地下水',
    5: '噪声',
  },
  // 因子类型
  FactorsTypeList: {
    1: '检测因子',
    2: '工作参数',
    3: '校零校满',
    4: '标液浓度',
  },
  // 所属类型
  CategoryList: {
    1: '废水',
    2: '废气',
    4: '噪声',
  },
  // 页面显示类型
  showNameTypeList: {
    1: '中文',
    2: '别名',
    3: '英文',
  },
  // 摄像头状态
  DevStatus: {
    1: '正常',
    2: '报废',
  },
  // 设备类型
  DevType: {
    default: '默认',
  },

  // 储罐类型
  storageTankType: [
    { value: 1, label: '立式圆筒形储罐' },
    { value: 2, label: '卧式圆筒形储罐' },
    { value: 3, label: '球形储罐' },
    { value: 4, label: '其他储罐' },
  ],
};

export default enums;
