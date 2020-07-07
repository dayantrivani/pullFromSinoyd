// 路由与登陆权限控制

import Vue from 'vue';
import lodash from 'lodash';
import CryptoJS from 'crypto-js';
import { Message } from 'element-ui';
import { asyncRoutesMap } from '@/routes';

const LOGIN_URL = 'proxy/auth/login';
const LOGOUT_URL = 'proxy/auth/logout';
const REFRESH_TOKEN_URL = 'proxy/auth/refresh-token';
const WEB_APP_GUID = 'd29a9faf240141f6bd458b3a5df9dcb7'; // 左侧导航获取keyId

const state = {
  // 侧栏加载状态
  loading: false,
  // 用户信息
  user: {},
  // 用户导航菜单
  userMenu: [],
  // 用户可路由
  addRouter: window.sessionStorage.getItem('router')
    ? JSON.parse(window.sessionStorage.getItem('router'))
    : [],
  // jwtToken
  token: window.sessionStorage.getItem('jwtToken') || false,
  // 侧栏一键展开按钮可展开层级
  level: 1,
};

const getters = {
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
          resolve();
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
      commit('SetLoading', true);
      Vue.http.get(`sinoyd-frame/sys/users/${state.user.loginID}/permission/nav-menus/tree`, {
        params: { webAppGuid: WEB_APP_GUID },
      }).then((response) => {
        if (response.data.success) {
          commit('SetUserMenu', response.data.data);
        }
        resolve(response.data.data[0]);
      }, (response) => {
        Vue.hp.resp(response);
        reject();
      }).finally(() => {
        commit('SetLoading');
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
          // that.$router.replace({ name: 'login' });
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
      const flatStr = Vue.hp.flattenDepth(state.userMenu, 'moduleCode');
      commit('SetAddRoutes', lodash.intersection(flatStr, asyncRoutesMap.map(v => v.name)));
      resolve();
    });
  },
  RefreshToken({ state, commit }, config) {
    return new Promise((resolve, reject) => {
      Vue.http.get(REFRESH_TOKEN_URL, { headers: { refreshToken: state.user.refreshToken } }).then((response) => {
        commit('SetToken', response.data.token);
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
  SetLoading(state, status = false) {
    state.loading = status;
  },
  SetToken(state, token = false) {
    state.token = token;
    window.sessionStorage.setItem('jwtToken', token);
  },
  SetUserMenu(state, menu) {
    const menus = menu.length ? menu[0].children : [];
    // menus.unshift(
    //   {
    //     icon: 'fas fa-home',
    //     label: '首页',
    //     moduleCode: 'home',
    //     children: [],
    //   },
    // );
    state.userMenu = menus;
  },
  SetUserJson(state, user) {
    window.sessionStorage.setItem('user', JSON.stringify(user));
    window.localStorage.setItem('user', JSON.stringify(user.loginID));
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
  SetLevel(state, n) {
    state.level = n;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
