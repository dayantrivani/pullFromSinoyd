import Vue from 'vue';
import Vuex from 'vuex';

import pages from './modules/pages';
import auth from './modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    pages,        // 默认布局
    auth,
  },
});
