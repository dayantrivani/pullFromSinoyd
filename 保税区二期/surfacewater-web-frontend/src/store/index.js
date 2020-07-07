import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import dict from './modules/dict';
import tagsView from './modules/tagsView';
import echarts from './modules/echarts';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    dict,
    tagsView,
    echarts,
  },
  state: {
    // 是否默认展开
    isFold: true,
    stInfo: JSON.parse(window.sessionStorage.getItem('keyPointsStInfo')) || {}, // 工况信息 - 单点罐区信息
    tfInfo: JSON.parse(window.sessionStorage.getItem('keyPointsTfInfo')) || {}, // 有毒易燃气体浓度监测 - 单点区信息
  },
  getters: {

  },
  mutations: {
    SetIsFold(state, status) {
      state.isFold = status;
    },
    SetStInfo(state, info) {
      state.stInfo = info || {};
      window.sessionStorage.setItem('keyPointsStInfo', JSON.stringify(info));
    },
    SetTfInfo(state, info) {
      state.tfInfo = info || {};
      window.sessionStorage.setItem('keyPointsTfInfo', JSON.stringify(info));
    },
  },
  actions: {

  },
});
