import store from '../../store';
// 污染源设置布局
import PSConfigLayout from '@/components/layouts/PSConfig';
import FileUploadLayout from '@/components/layouts/FileUpload';

const lazy = path => () => import(`@/views/bas/${path}`);

export default [
  {
    path: 'EntPortMNQuery',
    name: 'EntPortMNQuery',
    meta: { title: '企业排口MN号查询' },
    component: lazy('EntPortMNQuery'),
  },
  {
    path: 'PSPollutantDischarge',
    name: 'PSPollutantDischarge',
    meta: { title: '重点排污单位' },
    component: lazy('PSPollutantDischarge'),
  },
  // 默认主页设置
  {
    path: 'PSManage', // PSInfo路径修改为PSManage 与污染源管理子页面区分
    alias: 'PSInfo',
    name: 'PSInfo',
    meta: { title: '污染源管理' },
    component: lazy('PSInfo'),
  },
  // 污染源管理
  {
    path: 'PSInfo',
    component: PSConfigLayout,
    beforeEnter: (to, from, next) => {
      store.commit('psInfo/setActivePage', to.name);
      next();
    },
    // 污染源配置页
    children: [
      // 设备信息-生产设施
      {
        path: 'PSInfoDetailProduce',
        name: 'PSInfoDetailProduce',
        meta: { title: '设备信息-生产设施' },
        component: lazy('PSInfoDetailProduce'),
      },
      // 设备信息-炉窑设施
      {
        path: 'PSInfoDetailStove',
        name: 'PSInfoDetailStove',
        meta: { title: '设备信息-炉窑设施' },
        component: lazy('PSInfoDetailStove'),
      },
      // 设备信息-烟囱设施
      {
        path: 'PSInfoDetailChimney',
        name: 'PSInfoDetailChimney',
        meta: { title: '设备信息-烟囱设施' },
        component: lazy('PSInfoDetailChimney'),
      },
      // 设备信息-监测设施
      {
        path: 'PSInfoDetailMonitor',
        name: 'PSInfoDetailMonitor',
        meta: { title: '设备信息-监测设施' },
        component: lazy('PSInfoDetailMonitor'),
      },
      // 设备信息-治理设施
      {
        path: 'PSInfoDetailGovern',
        name: 'PSInfoDetailGovern',
        meta: { title: '设备信息-治理设施' },
        component: lazy('PSInfoDetailGovern'),
      },
      // 设备信息-数采仪
      {
        path: 'PSInfoDetailDGI',
        name: 'PSInfoDetailDGI',
        meta: { title: '设备信息-数采仪' },
        component: lazy('PSInfoDetailDGI'),
      },
      // 设备信息-仪器管理
      {
        path: 'PSInfoDetaiInstrument',
        name: 'PSInfoDetaiInstrument',
        meta: { title: '设备信息-仪器管理' },
        component: lazy('PSInfoDetaiInstrument'),
      },
      // 排放口-废水
      {
        path: 'PSInfoDetailWater',
        name: 'PSInfoDetailWater',
        meta: { title: '排放口-废水' },
        component: lazy('PSInfoDetailWater'),
      },
      // 排放口-废气
      {
        path: 'PSInfoDetailGas',
        name: 'PSInfoDetailGas',
        meta: { title: '排放口-废气' },
        component: lazy('PSInfoDetailGas'),
      },
      // 排放口-雨水
      {
        path: 'PSInfoDetailRain',
        name: 'PSInfoDetailRain',
        meta: { title: '排放口-雨水' },
        component: lazy('PSInfoDetailRain'),
      },
    ],
  },
  {
    path: 'Upload',
    component: FileUploadLayout,
    beforeEnter: (to, from, next) => {
      store.commit('psInfo/setUploadPage', to.name);
      next();
    },
    children: [
      {
        path: 'UPSecureFourColorMap',
        name: 'UPSecureFourColorMap',
        meta: { title: '安全风险四色分布图' },
        component: lazy('UPSecureFourColorMap'),
      },
      {
        path: 'UPFactoryEmergencySupplies',
        name: 'UPFactoryEmergencySupplies',
        meta: { title: '厂区应急物质分布图' },
        component: lazy('UPFactoryEmergencySupplies'),
      },
      {
        path: 'UPFactoryPlaneMap',
        name: 'UPFactoryPlaneMap',
        meta: { title: '厂区平面布置图' },
        component: lazy('UPFactoryPlaneMap'),
      },
      {
        path: 'UPFactoryRainPollPipeMap',
        name: 'UPFactoryRainPollPipeMap',
        meta: { title: '厂区雨污管网图' },
        component: lazy('UPFactoryRainPollPipeMap'),
      },
      {
        path: 'UPFactoryWorkers',
        name: 'UPFactoryWorkers',
        meta: { title: '厂区人员疏散图' },
        component: lazy('UPFactoryWorkers'),
      },
      {
        path: 'UPOther',
        name: 'UPOther',
        meta: { title: '其他' },
        component: lazy('UPOther'),
      },
      {
        path: 'UPRecordEPClosTurn',
        name: 'UPRecordEPClosTurn',
        meta: { title: '企业关停并转记录' },
        component: lazy('UPRecordEPClosTurn'),
      },
    ],
  },
  // 企业管理 - 企业管理
  {
    path: '/Enterprise',
    name: 'Enterprise',
    meta: { title: '企业管理' },
    component: lazy('Enterprise'),
  },
  // 企业管理 - 客户管理
  {
    path: '/EnterpriseClient',
    name: 'EnterpriseClient',
    meta: { title: '客户管理' },
    component: lazy('EnterpriseClient'),
  },
  // 企业管理 - 分包商管理
  {
    path: '/EnterpriseSubconractor',
    name: 'EnterpriseSubconractor',
    meta: { title: '分包商管理' },
    component: lazy('EnterpriseSubconractor'),
  },
  // 企业管理 - 供应商管理
  {
    path: '/EnterpriseSupplier',
    name: 'EnterpriseSupplier',
    meta: { title: '供应商管理' },
    component: lazy('EnterpriseSupplier'),
  },
  // 企业管理 - 运营商管理
  {
    path: '/EnterpriseOperator',
    name: 'EnterpriseOperator',
    meta: { title: '运营商管理' },
    component: lazy('EnterpriseOperator'),
  },
  {
    path: 'FactorDirectory',
    name: 'FactorDirectory',
    meta: { title: '污染物特征因子名录库' },
    component: lazy('FactorDirectory'),
  },
];
