// 路由与登陆权限控制

import Vue from 'vue';
import lodash from 'lodash';
import CryptoJS from 'crypto-js';
import config from '@/config';
import { Message } from 'element-ui';
import { asyncRoutesMap } from '@/routes';

const LOGIN_URL = 'proxy/auth/login';
const LOGOUT_URL = 'proxy/auth/logout';
const REFRESH_TOKEN_URL = 'proxy/auth/refresh-token';
const WEB_APP_GUID = config.isMenuAll ? '' : config.appGuid;

const state = {
  user: {},
  // 用户导航菜单
  userMenu: [],
  // 用户可路由
  addRouter: window.sessionStorage.getItem('router')
    ? JSON.parse(window.sessionStorage.getItem('router'))
    : [],
  // jwtToken
  token: window.sessionStorage.getItem('jwtToken') || false,
};

const getters = {
  orgGuid: state => (state.user.orgGuid || ''),
  // 用户名
  userName: state => (state.user.userName || '子曾经曰过'),
  // 用户类型 gov: 政府段， ent: 企业端
  userType: state => (state.user.userType || 'gov'),
  // 侧栏菜单，过滤隐藏页(404、login等)
  sideMenu: (state) => {
    if (!state.userMenu.length) return [];
    return state.userMenu;
  },
};

const actions = {
  Login({ commit }, params) {
    return new Promise((resolve, reject) => {
      // 加密处理
      const key = CryptoJS.enc.Latin1.parse('sinoyd**..123456');
      const rules = {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      };
      const keyParams = {
        uid: CryptoJS.AES.encrypt(params.uid, key, rules).toString(),
        pid: CryptoJS.AES.encrypt(params.pid, key, rules).toString(),
      };

      Vue.http.post(LOGIN_URL, {
        uid: keyParams.uid,
        pid: keyParams.pid,
      }, { headers: { Authorization: '' } }).then((response) => {
        if (response.status === 200 && response.data.code !== 500) {
          window.localStorage.setItem('canRefresh', params.remember ? 1 : 0);
          commit('SetToken', response.headers.authorization || response.data.data.token);
          commit('SetUser', response.data.data);
          commit('SetUserJson', response.data.data);
          resolve(response.data.data);
        } else {
          Message.warning({ duration: 1500, message: response.data.msg });
          reject();
        }
      }, ({ response }) => {
        Vue.hp.resp(response);
        reject();
      });
    });
  },
  GetMenu({ state, commit }) {
    // 这里不直接返回axios.post, 因为后面的链式调用会继续传入reject
    return new Promise((resolve, reject) => {
      Vue.http.get(`sinoyd-frame/sys/users/${state.user.loginID}/permission/nav-menus/tree`, {
        params: { webAppGuid: WEB_APP_GUID },
      }).then((response) => {
        if (response.data.success) {
          commit('SetUserMenu', response.data.data);
        }
        resolve(response.data.data[0]);
      }, ({ response }) => {
        Vue.hp.resp(response);
        reject();
      });
    });
  },
  Logout({ state, commit }, that) {
    Vue.http.post(LOGOUT_URL).then((response) => {
      commit('Logout');
      if (response.status) {
        Message.success({ duration: 1500, message: '退出成功' });
        if (process.env.NODE_ENV === 'production') {
          if (state.user.loginUrl) {
            window.location.href = state.user.loginUrl;
          } else {
            // window.location.href = `${window.location.origin}/frontend/#/login`;
            that.$router.replace({ name: 'login' });
          }
        } else {
          that.$router.replace({ name: 'login' });
        }
      }
    });
  },
  GetUser({ commit }) {
    const user = JSON.parse(window.sessionStorage.getItem('user'));
    if (user) {
      commit('SetUser', user);
    }
  },
  CreateRoutes({ state, commit }) {
    return new Promise((resolve) => {
      const flatStr = Vue.hp.flattenDepth(state.userMenu, 'moduleUrl');
      commit('SetAddRoutes', lodash.intersection(flatStr, asyncRoutesMap.map(v => v.name))
        .concat(asyncRoutesMap[3].children.map(v => v.name), asyncRoutesMap[4].children.map(v => v.name)));
      resolve();
    });
  },
  RefreshToken({ state, commit }, config) {
    return new Promise((resolve, reject) => {
      // Vue.http.post(REFRESH_TOKEN_URL).then(() => { // REFRESH_TOKEN_URL 接口修改成get接口，回调操作不确定是否需要修改
      Vue.http.get(REFRESH_TOKEN_URL, { headers: { refreshToken: state.user.refreshToken } }).then(() => {
        config.baseURL = '';
        config.headers.Authorization = state.token;
        Vue.http.request(config).then((newRequest) => {
          resolve(newRequest);
        });
      }, (error) => {
        commit('Logout'); // 刷新失败，就需要重新登录了
        reject(error);
      });
    });
  },
};

const mutations = {
  SetToken(state, token = false) {
    state.token = token;
    window.sessionStorage.setItem('jwtToken', token);
  },
  SetUserMenu(state, menu) {
    let menus = [];
    if (menu.length) {
      menus = config.isMenuAll ? menu : menu[0].children;
    }
    state.userMenu = menus;
  },
  SetUserJson(state, user) {
    window.sessionStorage.setItem('user', JSON.stringify(user));
    window.sessionStorage.setItem('userName', user.loginID);
  },
  SetUser(state, user) {
    state.user = user;
  },
  SetAddRoutes(state, routers) {
    state.addRouter = routers;
    window.sessionStorage.setItem('router', JSON.stringify(routers));
  },
  Logout(state) {
    window.sessionStorage.removeItem('jwtToken');
    window.sessionStorage.removeItem('router');
    window.sessionStorage.removeItem('user');
    state.token = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
