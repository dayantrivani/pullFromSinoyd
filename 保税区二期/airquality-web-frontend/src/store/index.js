import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import dict from './modules/dict';
import tagsView from './modules/tagsView';
import echarts from './modules/echarts';
import sample from './modules/sample';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    dict,
    tagsView,
    echarts,
    sample,
  },
  state: {
    // 是否默认展开
    isFold: true,
  },
  getters: {

  },
  mutations: {
    SetIsFold(state, status) {
      state.isFold = status;
    },
  },
  actions: {

  },
});
