import Vue from 'vue';
import Vuex from 'vuex';

// eslint-disable-next-line import/no-cycle
import auth from './modules/auth';
import tagsView from './modules/tags-view';
import home from './modules/home';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    tagsView,
    home,
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
