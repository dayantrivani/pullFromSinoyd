const state = {
  keyword: '',
};
const mutations = {
  SetKeyword: (state, view) => {
    state.keyword = view;
  },
};
export default {
  namespaced: true,
  state,
  mutations,
};
