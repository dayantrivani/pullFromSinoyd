import Vue from 'vue';
// 前端维护的枚举
const state = {
  portItem: {},
  alarmType: JSON.parse(localStorage.getItem('alarmType')) || [],
  alarmSendConfigList: JSON.parse(localStorage.getItem('alarmSendConfigList')) || [],
  orgTypeList: JSON.parse(localStorage.getItem('orgTypeList')) || [],
  userList: JSON.parse(localStorage.getItem('userList')) || [],
  portTypeList: JSON.parse(localStorage.getItem('portTypeList')) || [],
  portTreeMap: JSON.parse(localStorage.getItem('portTreeMap')) || [],
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
    localStorage.setItem('alarmType', JSON.stringify(data));
    state.alarmType = data;
  },
  setAlarmSendConfigList(state, data) {
    localStorage.setItem('alarmSendConfigList', JSON.stringify(data));
    state.alarmSendConfigList = data;
  },
  setOrgTypeList(state, data) {
    localStorage.setItem('orgTypeList', JSON.stringify(data));
    state.orgTypeList = data;
  },
  setUserList(state, data) {
    localStorage.setItem('userList', JSON.stringify(data));
    state.userList = data;
  },
  setPortTypeList(state, data) {
    localStorage.setItem('portTypeList', JSON.stringify(data));
    state.portTypeList = data;
  },
  setPortTreeMap(state, data) {
    localStorage.setItem('portTreeMap', JSON.stringify(data));
    state.portTreeMap = data;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
