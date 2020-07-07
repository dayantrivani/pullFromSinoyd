/* eslint-disable */

// 资源管理
const resourceManage = {
  icon: 'icon icon-ziyuanguanli',
  label: '资源管理',
  moduleCode: 'resourceManage',
  children: [
    {
      icon: 'icon icon-wenjianguanli1',
      label: '文件管理',
      moduleCode: 'DocumentManage',
      children: [],
    },
    {
      icon: 'fas fa-slash',
      label: '测试项目管理',
      moduleCode: 'TestManage',
      children: [],
    },
    {
      icon: 'fas fa-slash',
      label: '测试项目参数管理',
      moduleCode: 'TestParams',
      children: [],
    },
    {
      icon: 'icon icon-fenxixiangmuguanli1',
      label: '分析项目管理',
      moduleCode: 'AnalyzeItemManage',
      children: [],
    },
    {
      icon: 'icon icon-fenxifangfaguanli',
      label: '分析方法管理',
      moduleCode: 'AnalyzeMethodManage',
      children: [],
    },
    {
      icon: 'fas fa-slash',
      label: '试剂配制记录',
      moduleCode: 'AnalyzeMethodReagentConfig',
      children: [],
    },
    {
      icon: 'icon icon-fenxixiangmupaixu',
      label: '分析项目排序',
      moduleCode: 'AnalyzeItemSort',
      children: [],
    },
    {
      icon: 'fas fa-slash',
      label: '分析项目关系配置',
      moduleCode: 'AnalyzeItemRelationParams',
      children: [],
    },
    {
      icon: 'icon icon-gongyingshangguanli',
      label: '供应商管理',
      moduleCode: 'EntSupplierManage',
      children: [],
    },
    {
      icon: 'icon icon-cheliangguanli',
      label: '车辆管理',
      moduleCode: 'CarManage',
      children: [],
    },
    {
      icon: 'fas fa-slash',
      label: '环境管理',
      moduleCode: 'EnvironmentalManage',
      children: [],
    },
  ],
};

// 基础信息配置
const basicInfoConfig = {
  icon: 'icon icon-jichupeizhi',
  label: '基础信息配置',
  moduleCode: 'basicInfoConfig',
  children: [
    {
      icon: 'icon icon-lianggangguanli1',
      label: '量纲管理',
      moduleCode: 'DimensionManage',
      children: [],
    },
    {
      icon: 'icon icon-hangyeleixing',
      label: '行业类型',
      moduleCode: 'IndustryType',
      children: [],
    },
    {
      icon: 'icon icon-yangpinleixing',
      label: '检测类型',
      moduleCode: 'SampleType',
      children: [],
    },
    {
      icon: 'icon icon-jiancemobanpeizhia1',
      label: '检测模板配置',
      moduleCode: 'SampleTypeTemplate',
      children: [],
    },
    {
      icon: 'icon icon-yangpinfenpingguize',
      label: '样品分组配置',
      moduleCode: 'SampleTypeGroup',
      children: [],
    },
  ],
};

// 财务管理
const finance = {
  icon: 'icon icon-caiwuguanli',
  label: '财务管理',
  moduleCode: 'finance',
  children: [
    {
      icon: 'icon icon-hetongguanli',
      label: '合同管理',
      moduleCode: 'ContractManage',
      children: [],
    },
    {
      icon: 'fas fa-slash',
      label: '付款管理',
      moduleCode: 'PayRecord',
      children: [],
    },
    {
      icon: 'icon icon-shoukuanguanli',
      label: '收款管理',
      moduleCode: 'RecRecord',
      children: [],
    },
    {
      icon: 'icon icon-shoukuanguanli',
      label: '合同收付款记录',
      moduleCode: 'RecAndPayRecord',
      children: [],
    },
    {
      icon: 'icon icon-shoukuanguanli',
      label: '非合同支出列表',
      moduleCode: 'OtherExpenditure',
      children: [],
    },
  ],
};

// 质控管理
const qualityManage = {
  icon: 'fas fa-cogs',
  label: '质控管理',
  moduleCode: 'qualityManage',
  children: [
    {
      icon: 'icon icon-jiancecanshupeizhi1',
      label: '文件管理',
      moduleCode: 'FileControl',
      children: [],
    },
    {
      icon: 'icon icon-jiancecanshupeizhi1',
      label: '文件发放与回收管理',
      moduleCode: 'FileGrantRecovery',
      children: [],
    },
  ],
};

// 系统管理
const system = {
  icon: 'fas fa-cogs',
  label: '系统管理',
  moduleCode: 'system',
  children: [
    {
      icon: 'icon icon-jiancecanshupeizhi1',
      label: '参数管理',
      moduleCode: 'ParamsManage',
      children: [],
    },
  ],
};

export default {
  code: 200,
  count: 1,
  success: true,
  msg: '操作成功',
  data: [
    {
      blank: false,
      can: true,
      checked: false,
      icon: '',
      id: '@word(32)',
      label: 'LIMS 管理云平台',
      moduleCode: 'dynamic',
      moduleGuid: '@word(32)',
      moduleCode: '',
      parentId: '0',
      webAppGuid: '@word(32)',
      children: [
        resourceManage,
        basicInfoConfig,
        system,
        finance,
        qualityManage,
      ],
    },
  ],
};
