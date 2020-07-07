import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import tagsView from './modules/tags-view';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    tagsView,
  },
  state: {

  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },
});
