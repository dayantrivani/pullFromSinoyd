// 路由与登陆权限控制

import lodash from 'lodash';
import CryptoJS from 'crypto-js';
import config from '@/config';
import http from '@/global/libs/axios';
import { Message } from 'element-ui';
import { route, asyncRoutesMap } from '@/routes';
import { getDepthVal, analyzeResp } from '@/global/libs/util';
import DefaultLayout from '@/global/layouts/Default';
import IframeLayout from '@/views/auth/IframePage';

const LOGIN_URL = 'proxy/auth/login';
const LOGOUT_URL = 'proxy/auth/logout';
const REFRESH_TOKEN_URL = 'proxy/auth/refresh-token';
const WEB_APP_GUID = config.isMenuAll ? '' : config.appGuid;

const state = {
  // 侧栏加载状态
  loading: false,
  // 用户信息
  user: window.sessionStorage.getItem('user')
    ? JSON.parse(window.sessionStorage.getItem('user'))
    : {},
  // 用户导航菜单
  userMenu: [],
  // 用户可路由
  addRouter: window.sessionStorage.getItem('router')
    ? JSON.parse(window.sessionStorage.getItem('router'))
    : [],
  // 登录信息
  loginInfo: window.sessionStorage.getItem('loginInfo')
    ? JSON.parse(window.sessionStorage.getItem('loginInfo'))
    : {},
  // jwtToken
  token: window.sessionStorage.getItem('jwtToken') || false,
  // 侧栏一键展开按钮可展开层级
  level: 1,
  // 用户列表
  userList: [],
  // 动态路由
  iframeRouter: window.sessionStorage.getItem('iframeRouter')
    ? JSON.parse(window.sessionStorage.getItem('iframeRouter'))
    : [],
};

const getters = {
  // 用户名
  userName: state => (state.user.userName || '子曾经曰过'),
  // 用户类型 gov: 政府段， ent: 企业端
  userType: state => (state.user.userType || 'gov'),
  // 用户（企业）ID
  orgGuid: state => (state.user.userType === 'ent' ? state.user.orgGuid : ''),
  // 侧栏菜单，过滤隐藏页(404、login等)
  sideMenu: (state) => {
    if (!state.userMenu.length) return [];
    return state.userMenu;
  },
};

const actions = {
  // 登录
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

      // http.post(LOGIN_URL, {}, { params: keyParams, headers: { Authorization: '' } }).then((response) => {
      http.post(LOGIN_URL, { uid: keyParams.uid, pid: keyParams.pid }, { headers: { Authorization: '' } })
        .then((response) => {
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
        }, (error) => {
          analyzeResp(error);
          reject();
        });
    });
  },
  Logout({ state, commit, dispatch }, that) {
    http.post(LOGOUT_URL).then((response) => {
      commit('Logout');
      if (response.status) {
        Message.success({ duration: 1500, message: '退出成功' });
        dispatch('LogoutSafety', { vm: that, loginInfo: state.loginInfo });
      }
    });
  },
  LogoutSafety(context, o) {
    const key = CryptoJS.enc.Latin1.parse('sinoyd4321sinoyd');
    const rules = {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    };
    const keyParams = {
      telephone: CryptoJS.AES.encrypt(o.loginInfo.telephone, key, rules).toString(),
    };
    let host = '58.211.203.122:80';
    if (window.location.hostname === '58.211.203.122') {
      host =  `${window.location.hostname}:80`;
    } else if (window.location.hostname.slice(0, 7) === '192.168') {
      host = '192.168.2.204:9001';
    }
    o.vm.$jsonp(`http://${host}/a/exit`, {
      loginName: keyParams.telephone,
      callback: 'callback',
    }).finally(() => {
      if (process.env.NODE_ENV === 'production') {
        if (state.user.loginUrl) {
          window.location.href = state.user.loginUrl;
        } else {
          // window.location.href = `${window.location.origin}/frontend/#/login`;
          o.vm.$router.replace({ name: 'login' });
        }
      } else {
        o.vm.$router.replace({ name: 'login' });
      }
    });
  },
  // 获取用户导航
  GetMenu({ /* state, */ dispatch, commit }) {
    // 这里不直接返回axios.post, 因为后面的链式调用会继续传入reject
    return new Promise((resolve, reject) => {
      commit('SetLoading', true);
      http.get(`sinoyd-frame/sys/users/${state.user.loginID}/permission/nav-menus/tree`, {
        params: { webAppGuid: WEB_APP_GUID },
      }).then((response) => {
        if (response.data.success) {
          commit('SetUserMenu', response.data.data);
        }
        dispatch('GetUserList');
        resolve();
      }, (response) => {
        analyzeResp(response);
        reject();
      }).finally(() => {
        commit('SetLoading');
      });
    });
  },
  // 获取用户
  GetUser({ commit }) {
    const user = JSON.parse(window.sessionStorage.getItem('user'));
    if (user) {
      commit('SetUser', user);
    }
  },
  // 生成路由
  CreateRoutes({ state, commit }) {
    return new Promise((resolve) => {
      const flatStr = getDepthVal(state.userMenu, 'moduleUrl');
      commit('SetAddRoutes', lodash.intersection(flatStr, asyncRoutesMap.map(v => v.name)));
      resolve();
    });
  },
  // 刷新token
  RefreshToken({ state, commit }, config) {
    return new Promise((resolve, reject) => {
      http.get(REFRESH_TOKEN_URL, { headers: { refreshToken: state.user.refreshToken } }).then((response) => {
        commit('SetToken', response.data.data);
        http.request(config).then((newRequest) => {
          resolve(newRequest);
        });
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
        http.get(`sys/user/guid/${state.user.orgGuid}`).then((response) => {
          commit('SetUserList', response.data);
          resolve(response.data);
        }, (response) => {
          analyzeResp(response);
          reject();
        });
      }
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
    let menus = [];
    if (menu.length) {
      menus = config.isMenuAll ? menu : menu[0].children;
    }
    state.userMenu = menus;
    if (menus.length) {
      const newRouter = [];
      const menus = config.isMenuAll ? menu : menu[0].children;
      menus.map((v) => {
        if (v.moduleUrl && v.moduleUrl.includes('http')) {
          newRouter.push({
            path: v.moduleCode,
            name: v.moduleUrl,
            meta: { title: v.label },
            component: IframeLayout,
          });
        }
        return v;
      });
      state.iframeRouter = newRouter;
      sessionStorage.setItem('iframeRouter', JSON.stringify(state.iframeRouter));
      route.addRoutes(state.iframeRouter.map(v => ({
        path: '/',
        component: DefaultLayout,
        children: [v],
      })));
    }
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
  SetLevel(state, n) {
    state.level = n;
  },
  SetUserList(state, list) {
    state.userList = list;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
