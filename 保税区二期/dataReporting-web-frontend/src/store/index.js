import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import dict from './modules/dict';
import tagsView from './modules/tagsView';
import echarts from './modules/echarts';
import http from '@/global/libs/axios';
import { analyzeResp } from '@/global/libs/util';

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
    psInfo: window.sessionStorage.getItem('psInfo')
      ? JSON.parse(window.sessionStorage.getItem('psInfo'))
      : {},
  },
  getters: {

  },
  mutations: {
    SetIsFold(state, status) {
      state.isFold = status;
    },
    SetPsInfo(state, status) {
      state.psInfo = status;
      window.sessionStorage.setItem('psInfo', JSON.stringify(status || {}));
    },
  },
  actions: {
    GetPsInfo({ commit }, id) {
      return new Promise((resolve, reject) => {
        http.get(`bas/psBaseInfo/${id}`).then((response) => {
          if (response.status === 200 && response.data.success) {
            commit('SetPsInfo', response.data.data);
            resolve();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
          reject();
        }).finally(() => {
          this.formLoading = false;
        });
      });
    },
  },
});
