import http from '@/libs/axios';
import { analyzeResp } from '@/libs/util';

const state = {

  baseUrl: 'sys/enumCode',  // 常量字典表接口地址

  Base_DimensionType: [],       // 量纲类型
  sys_dept_type: [],            // 部门类型
  sys_oa_processtype: [],       // 流程类型
};

const getters = {
};

const actions = {
  // 获取选择框下拉数据
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
};

const mutations = {
  // 设置选择框下拉数据
  SET_SELECT_TYPE(state, field, data) {
    state[field] = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
