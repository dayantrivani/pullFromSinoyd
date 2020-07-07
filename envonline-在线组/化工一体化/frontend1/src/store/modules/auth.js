// 路由与登陆权限控制
import { Message } from 'element-ui';
import config from '@/config';
import {
  analyzeResp, setToken, getToken, removeToken,
} from '@/libs/util';
import {
  login, getUserNav, refreshToken, getUserList,
} from '@/api/auth';

const state = {
  // jwtToken
  token: getToken(),
  // 用户信息
  userInfo: window.sessionStorage.getItem('user')
    ? JSON.parse(window.sessionStorage.getItem('user'))
    : {},
  // 用户导航菜单
  userMenu: window.sessionStorage.getItem('userMenu')
    ? JSON.parse(window.sessionStorage.getItem('userMenu'))
    : [],
  // 用户列表
  userList: [],
  status: 200,
};

const getters = {
  // 用户名
  userName: state => (state.userInfo.userName || '子曾经曰过'),
  // 用户类型 gov: 政府段， ent: 企业端
  userType: state => (state.userInfo.userType || 'gov'),
  // 侧栏菜单
  sideMenu: state => (state.userMenu.length ? state.userMenu : []),
};

const actions = {
  // 登录
  Login({ commit }, params) {
    return new Promise((resolve, reject) => {
      const data = {
        userName: params.uid,
        password: params.pid,
      };
      login(data).then((response) => {
        if (response.status === 200 && response.data.code !== 500) {
          window.localStorage.setItem('canRefresh', params.remember ? 1 : 0);
          commit('SetToken', response.data.data.token);
          commit('SetUserInfo', response.data.data);
          resolve(response.data.data);
        } else {
          Message.warning({ duration: 1500, message: response.data.msg });
          reject();
        }
      }, (response) => {
        analyzeResp(response);
        reject();
      });
    });
  },
  // 获取用户导航
  GetUserMenu({ state, dispatch, commit }) {
    return new Promise((resolve, reject) => {
      getUserNav(state.userInfo.loginID).then((response) => {
        if (response.data.success) {
          commit('SetUserMenu', response.data.data);
        }
        dispatch('GetUserList');
        resolve();
      }, (response) => {
        analyzeResp(response);
        reject();
      });
    });
  },
  // 刷新token
  RefreshToken({ commit }) {
    return new Promise((resolve, reject) => {
      refreshToken().then((response) => {
        commit('SetToken', response.data.data);
        resolve(response);
      }, (error) => {
        commit('Logout'); // 刷新失败，就需要重新登录了
        reject(error);
      });
    });
  },
  // 获取用户列表
  GetUserList({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (state.userList.length) {
        resolve(state.userList);
      } else {
        getUserList(state.userInfo.orgGuid).then((response) => {
          commit('SetUserList', response.data.data);
          resolve(response.data);
        }, (response) => {
          analyzeResp(response);
          reject();
        });
      }
    });
  },
  Logout({ commit }) {
    commit('Logout');
    // return new Promise((resolve, reject) => {
    //   logout().then(() => {
    //     resolve();
    //   }, () => {
    //     // analyzeResp(response);
    //     reject();
    //   });
    // });
  },
};

const mutations = {
  SetToken(state, token = false) {
    state.token = token;
    setToken(token);
  },
  SetUserInfo(state, user) {
    state.userInfo = user;
    window.sessionStorage.setItem('user', JSON.stringify(state.userInfo));
  },
  // 设置用户导航
  SetUserMenu(state, menu) {
    let menus = [];
    if (menu.length) {
      menus = config.app.id ? menu : menu[0].children;
    }
    state.userMenu = menus;
    window.sessionStorage.setItem('userMenu', JSON.stringify(state.userMenu));
  },
  // 设置用户列表
  SetUserList(state, list) {
    state.userList = list;
  },
  Logout(state) {
    window.sessionStorage.removeItem('userInfo');
    state.token = false;
    removeToken();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
