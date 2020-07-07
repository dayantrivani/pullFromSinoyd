import http from '@/global/libs/axios';
import { analyzeResp } from '@/global/libs/util';

const state = {

  baseUrl: 'sys/enumCode',  // 常量字典表接口地址

  FireHazardGrade: [],      // 火灾危险等级
  BuildType: [],            // 建筑物类型
};

const getters = {
};

const actions = {
  // 获取选择框下拉常量数据
  async GET_SELECT_TYPE({ state, commit }, field) {
    let val = state[field];
    await http.get(state.baseUrl, {
      params: { codeValue: field },
    }).then((response) => {
      val = response.data;
      commit('SET_SELECT_TYPE', field, response.data);
    }, ({ response }) => {
      analyzeResp(response);
    });
    return val;
  },
  async GET_SELECT_TYPE_URL({ state, commit }, key) {
    let val = state[key];
    await http.get(`${state.baseUrl}/${key}/0`).then((response) => {
      val = response.data;
      commit('SET_SELECT_TYPE_URL', key, response.data);
    }, ({ response }) => {
      analyzeResp(response);
    });
    return val;
  },
};

const mutations = {
  // 设置选择框下拉常量数据
  SET_SELECT_TYPE(state, field, data) {
    state[field] = data;
  },
  SET_SELECT_TYPE_URL(state, key, data) {
    state[key] = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
