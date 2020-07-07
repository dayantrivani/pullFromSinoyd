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
    /**
     * isFold    侧栏导航宽度是否默认展开
     * portInfo  实时监测页面点击row的数据
     */
    isFold: true,
    portInfo: window.sessionStorage.getItem('portInfo')
      ? JSON.parse(window.sessionStorage.getItem('portInfo'))
      : {},
  },
  getters: {

  },
  mutations: {
    SetIsFold(state, status) {
      state.isFold = status;
    },
    SetPortInfo(state, item) {
      state.portInfo = item;
      window.sessionStorage.setItem('portInfo', JSON.stringify(item || {}));
    },
  },
  actions: {

  },
});
