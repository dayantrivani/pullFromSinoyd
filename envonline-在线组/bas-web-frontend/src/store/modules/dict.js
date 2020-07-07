import Vue from 'vue';

const state = {
  DictUrl: '',
  // 当前页
  activePage: 'PSInfoDetailProduce',
  // 当前企业跳转记录
  PSHistory: '',
  // 当前设置的企业信息
  activeInfo: '',
  // 字典表 - 区域类
  RegionCodeIdType: [], // 行政区划编码
  // 字典表
  PSClass: [],                                // 污染源类别编码
  RegistType: [],                             // 注册类型编码
  EnterpriseUnitCategory: [],                 // 单位类别编码
  WaterFunctionalArea: [],                    // 水域功能区类别ID
  FlagInstallForm: [],                        // 标志牌安装形式编码
  OutputRule: [],                             // 排放规律编码
  Watershed: [],                              // 流域名称ID
  EmissionsType: [],                          // 直排/支流
  WaterDirection: [],                         // 排放去向编码
  InstrumentCategory: [],                     // 仪器类型
  DGIType: [],                                // 数采仪类型
  WaterTreatment: [],                         // 处理方法
  MonitoringInstrumentType: [],               // 监测仪器类型
  AirFunctionArea: [],                        // 气域功能区类别ID
  PollutionSourceScale: [],                   // 污染源规模编码
  SubjectionRelation: [],                     // 隶属关系编码
  IndustryCategory: [],                       // 行业类别编码
  NoiseFunctionArea: [],                      // 噪声功能区类别
  CoastalSeaAreaEnvironmentFunctionArea: [],  // 海域功能区类别ID
  DrinkingWaterSourceFunctionalArea: [],      // 水源保护区类别ID
  SewageTreatmentLevel: [],                   // 污水处理级别ID
  StoveKind: [],                              // 炉窑类型
  FuelType: [],                               // 燃料类型
  FurnacesType: [],                           // 炉窑种类
  FuelClassification: [],                     // 燃料分类
  BurningMode: [],                            // 燃烧方式id
  DoubleControlType: [],                      // 两控区类型
  ConnectCommunicationServer: [],             // 连接通讯服务器 ?
  TreatmentType: [],                          // 治理设施类型 ?
  // 污染物编码 ?
  PollutionClass: [],                         // 污染类别 ?
  SectionCode: [],                            // 断面编码 ?

  // 数据列表
  DGIList: [],                        // 数采仪列表
  StoveList: [],                      // 炉窑列表
  ChimneyList: [],                    // 烟囱列表
  GovernList: [],                     // 治理设施列表
  EvaluateList: [],                   // 评价标准列表
  FactorValueSource: [],  // 因子值数据源
  // 连接通讯服务器 ?
  // 治理设施类型 ?
  // 污染物编码 ?
  // 污染类别 ?
};
const getters = {
};
const actions = {
  // 获取选择框下拉数据
  async GET_SELECT_TYPE({ state, commit }, params = {}) {
    let val = state[params.codeValue];
    if (val.length === 0) {
      await Vue.http.get('sys/enumCode', {
        params: { ...params },
      }).then((response) => {
        const obj = {};
        obj.list = response.data;
        obj.params = params;
        val = response.data;
        commit('SET_SELECT_TYPE', obj);
      }, ({ response }) => {
        Vue.hp.resp(response);
      });
    }
    return val;
  },
  // 获取选择框下拉数据
  async GET_SELECT_FactorSource({ state, commit }, params = {}) {
    let val = state[params.codeValue];
    if (val.length === 0) {
      await Vue.http.get('sys/enumCode/FactorValueSource/0').then((response) => {
        const obj = {};
        obj.list = response.data;
        val = response.data;
        obj.params = params;
        commit('SET_SELECT_TYPE', obj);
      }, ({ response }) => {
        Vue.hp.resp(response);
      });
    }
    return val;
  },
  // 获取区域选择数据
  async GET_AREA_TYPE({ state, commit }, params = {}) {
    let val = state[params.codeValue];
    if (val.length === 0) {
      await Vue.http.get('sys/area').then((response) => {
        const obj = {};
        obj.list = response.data;
        obj.params = params;
        val = response.data;
        commit('SET_SELECT_TYPE', obj);
      }, ({ response }) => {
        Vue.hp.resp(response);
      });
    }
    return val;
  },
  // 获取数采仪列表
  async GET_DGI_LIST({ state, commit }) {
    let val = [];
    await Vue.http.get('bas/dgiInfo', {
      params: {
        page: 1,
        rows: 1000000,
        psId: state.activeInfo.rowGuid,
      },
    }).then((response) => {
      val = response.data;
      commit('SET_DGI_LIST', response.data);
    }, ({ response }) => {
      Vue.hp.resp(response);
    });
    return val;
  },
  // 获取炉窑列表
  async GET_STOVE_LIST({ state, commit }) {
    let val = [];
    await Vue.http.get('bas/stove', {
      params: {
        page: 1,
        rows: 1000000,
        psId: state.activeInfo.rowGuid,
      },
    }).then((response) => {
      val = response.data;
      commit('SET_STOVE_LIST', response.data);
    }, ({ response }) => {
      Vue.hp.resp(response);
    });
    return val;
  },
  // 获取烟囱列表
  async GET_CHIMNEY_LIST({ state, commit }) {
    let val = [];
    await Vue.http.get('bas/chimney', {
      params: {
        page: 1,
        rows: 1000000,
        psId: state.activeInfo.rowGuid,
      },
    }).then((response) => {
      val = response.data;
      commit('SET_CHIMNEY_LIST', response.data);
    }, ({ response }) => {
      Vue.hp.resp(response);
    });
    return val;
  },
  // 获取治理设施列表
  async GET_GOVERN_LIST({ state, commit }) {
    let val = [];
    await Vue.http.get('bas/goverFacilitiesInfo', {
      params: {
        page: 1,
        rows: 1000000,
        psId: state.activeInfo.rowGuid,
      },
    }).then((response) => {
      val = response.data;
      commit('SET_GOVERN_LIST', response.data);
    }, ({ response }) => {
      Vue.hp.resp(response);
    });
    return val;
  },
  // 获取治理设施列表
  async GET_MAINTAINPROVIDER_LIST({ commit }) {
    let val = [];
    await Vue.http.get('bas/psBaseInfo', {
      params: {
        page: 1,
        rows: 1000000,
        psTypes: '128',
      },
    }).then((response) => {
      val = response.data;
      commit('SET_GOVERN_LIST', response.data);
    }, ({ response }) => {
      Vue.hp.resp(response);
    });
    return val;
  },
  // 获取评价标准列表
  async GET_EVALUATE_LIST({ state, commit }) {
    let val = state.EvaluateList;
    if (val.length === 0) {
      await Vue.http.get('bas/evaluationCriteria', {
        params: {
          page: 1,
          rows: 1000000,
        },
      }).then((response) => {
        val = response.data;
        commit('SET_EVALUATE_LIST', response.data);
      }, ({ response }) => {
        Vue.hp.resp(response);
      });
    }
    return val;
  },
};
const mutations = {
  setRealtimeParameter(state, row) {
    state.RealtimeParameter = row;
  },
  setActivePage(state, link) {
    state.activePage = link;
  },
  setActiveInfo(state, row) {
    state.activeInfo = row;
  },
  setPSHistory(state, obj) {
    state.PSHistory = obj;
  },
  // 设置选择框下拉数据
  SET_SELECT_TYPE(state, obj) {
    const { codeValue } = obj.params;
    state[codeValue] = obj.list;
  },
  // 设置数采仪列表
  SET_DGI_LIST(state, val) {
    state.DGIList = val;
  },
  // 设置炉窑列表
  SET_STOVE_LIST(state, val) {
    state.StoveList = val;
  },
  // 设置烟囱列表
  SET_CHIMNEY_LIST(state, val) {
    state.ChimneyList = val;
  },
  // 设置治理设施列表
  SET_GOVERN_LIST(state, val) {
    state.GovernList = val;
  },
  // 设置评价标准列表
  SET_EVALUATE_LIST(state, val) {
    state.EvaluateList = val;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
