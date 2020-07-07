
const state = {
  homeParams: {},
  type: 1,
  companyName: '',
};

const getters = {};

const actions = {};

const mutations = {
  // 修改报警类型
  SetHomeParams(state, value) {
    state.homeParams = value;
  },
  // 切换类型
  changeType(state, value) {
    state.type = value;
  },
  // 切换类型
  GetCompanyName(state, value) {
    state.companyName = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
