import Vue from 'vue';
// 前端维护的枚举
const state = {
  portItem: {},
  alarmType: {},
};
const getters = {};
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
      }, (response) => {
        Vue.hp.resp(response);
      });
    }
    return val;
  },
};
const mutations = {
  setPortItem(state, row) {
    state.portItem = row;
  },
  setAlarmType(state, data) {
    state.alarmType = data;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
