import { cloneDeep } from 'lodash';
import { Message } from 'element-ui';
import config from '@/config/app.config';
import asyncRoutes from '@/config/router.config';

import {
  flatten,
  getLocalStorage,
  setLocalStorage,
  getSessionStorage,
  setSessionStorage,
} from '@/libs/tools';

import {
  setToken,
  getToken,
  removeToken,
  toTreeFlat,
} from '@/libs/util';

import {
  login,
  logout,
  getUserNav,
  getUserAuth,
  refreshToken,
  getUserList,
} from '@/api/sys';


/**
 * @deprecated 路由与登陆权限控制
 */

const { app: { home }, navbar, localKey } = config;

const state = {
  // 鉴权进度
  progress: '',
  // jwtToken
  token: getToken(),
  // 用户信息
  userInfo: getLocalStorage(localKey.userInfo) || {},
  // 用户关连企业
  selectedOrg: getSessionStorage(localKey.selectedOrg) || {},
  // 用户导航菜单
  userMenu: getSessionStorage(localKey.navMenu) || [],
  // 用户权限列表
  userAuth: getSessionStorage(localKey.userAuth) || [],
  // 用户列表
  userList: [],
  // 面包屑列表
  breadcrumbList: [],
  // 动态路由索引
  dynamicRoutes: [],
  // 首页路由对象
  homeRoute: null,
};

const getters = {
  // 用户ID
  userGuid: state => state.userInfo.userGuid || '',
  // 用户名
  userName: state => state.userInfo.userName || '未登录',
  // 企业&机构列表
  userOrgs: state => state.userInfo.orgs || [],
  // 侧栏导航（偏平化）
  flatMenu: state => toTreeFlat(state.userMenu),
  // 动态追加导航
  addRoutes: (state) => {
    // 获取导航模块编码v
    const navList = flatten(state.userMenu, false);
    if (!navList.length) return [];

    // 获取未配置的路由
    const routeList = cloneDeep(asyncRoutes);

    // 合并参数
    routeList.map((route) => {
      const item = navList.find(v => v[navbar.code] === route.name);

      if (item || route.name === home) {
        route.meta = Object.assign({
          title: item[navbar.label],
          icon: item[navbar.icon],
        }, route.meta || {});
      } else {
        // 若未匹配导航将导向403
        route.component = () => import('@/layouts/_common/exception/403');
      }

      // 记录首页路由
      if (route.name === home) {
        state.homeRoute = route;
      }
      return route;
    });

    // 若未匹配路由将导向 404
    const routeNames = routeList.map(v => v.name);
    const notMatchRoutes = navList.filter(v => !routeNames.includes(v[navbar.code]));
    notMatchRoutes.forEach(nav => {
      const route = {
        path: nav[navbar.code],
        name: nav[navbar.code],
        meta: { title: nav[navbar.label] },
      };
      if (/http:\/\/|https:\/\/|www./.test(nav[navbar.path])) {
        route.meta.link = nav[navbar.path];
        // 若为外链则嵌入页面
        route.component = () => import('@/layouts/_common/framework/IframeIn');
      } else {
        route.component = () => import('@/layouts/_common/exception/404');
      }
      routeList.push(route);
    });

    state.dynamicRoutes = routeList.map(v => v.name);
    return routeList;
  },
};

const actions = {

  // 登录
  Login({ commit }, params) {
    return new Promise((resolve, reject) => {
      login(params)
        .then((response) => {
          const { success, data, msg } = response.data;
          if (success) {
            commit('SetToken', data.token);
            commit('SetUserInfo', data);
            resolve(response.data);
          } else {
            Message.warning({ message: msg, duration: 1500 });
            reject();
          }
        })
        .catch(() => reject())
        .finally(() => reject());
    });
  },

  // 注销 Logout
  Logout({ commit }) {
    return new Promise((resolve) => {
      const message = Message.info('正在退出登录');
      logout().finally(() => {
        commit('SetSelectedOrg');
        commit('SetLogout');
        message.close();
        Message.success('退出成功');
        resolve();
      });
    });
  },

  // 刷新 token
  RefreshToken({ state, commit, dispatch }, selectedOrg = state.selectedOrg) {
    commit('SetSelectedOrg', selectedOrg);
    return new Promise((resolve, reject) => {
      commit('SetProgress', '获取校验信息中');
      refreshToken(state.userInfo.refreshToken, state.selectedOrg.id)
        .then(async ({ headers, data }) => {
          const { success, msg } = data;
          if (success) {
            const result = data.data;
            result.token = headers.authorization || result.token;
            commit('SetToken', result.token);
            commit('SetUserInfo', result);
            await dispatch('GetUserNav');
            await dispatch('GetUserAuth');
            resolve(result.token);
          } else {
            Message.warning({ message: msg, duration: 1500 });
            // 若刷新失败则退回登录
            dispatch('Logout');
            reject();
          }
        });
    });
  },

  // 获取用户导航
  GetUserNav({ state, getters, commit }, userGuid = state.userInfo.userGuid) {
    return new Promise((resolve, reject) => {
      commit('SetProgress', '正在获取用户菜单');
      getUserNav(userGuid)
        .then((response) => {
          const { success, data, msg } = response.data;
          if (success) {
            commit('SetUserMenu', data);
            resolve(getters.addRoutes);
          } else {
            Message.warning({ message: msg, duration: 1500 });
            reject();
          }
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          commit('SetProgress', '正在生成用户导航');
        });
    });
  },

  // 获取用户权限
  GetUserAuth({ state, commit }, userGuid = state.userInfo.userGuid) {
    commit('SetProgress', '正在获取用户权限');
    return new Promise((resolve, reject) => {
      getUserAuth(userGuid)
        .then((response) => {
          const { success, data, msg } = response.data;
          if (success) {
            commit('SetUserAuth', data || []);
            resolve(data);
          } else {
            Message.warning({ message: msg, duration: 1500 });
            reject();
          }
        });
    });
  },

  // 获取用户列表
  GetUserList({ state, commit }) {
    if (state.userList.length) return Promise.resolve(state.userList);
    return new Promise((resolve, reject) => {
      getUserList()
        .then((response) => {
          const { success, data, msg } = response.data;
          if (success) {
            commit('SetUserList', data || []);
            resolve(data);
          } else {
            Message.warning({ message: msg, duration: 1500 });
            reject();
          }
        });
    });
  },

  // 获取面包屑列表
  GetBreadcrumbList({ getters, commit }, params) {
    if (!getters.flatMenu.length || !params) return;
    const getBreadcrumb = (id) => {
      const result = [];
      const data = getters.flatMenu.filter(v => v[navbar.id] === id)[0];
      result.unshift(data);
      if (data[navbar.parentId] !== '0') {
        result.unshift(...getBreadcrumb(data[navbar.parentId]));
      }
      return result;
    };
    const result = getBreadcrumb(params);
    commit('SetBreadcrumbList', result);
  },
};

const mutations = {

  // 设置鉴权进度
  SetProgress(state, text) {
    state.progress = text;
  },

  // 设置 token
  SetToken(state, token = false) {
    state.token = token;
    setToken(token);
  },

  // 注销登录, 清除数据
  SetLogout() {
    state.token = false;
    removeToken();
    window.sessionStorage.clear();
    window.localStorage.removeItem('userInfo');
  },

  // 设置用户信息
  SetUserInfo(state, data) {
    state.userInfo = data;
    setLocalStorage(localKey.userInfo, state.userInfo);
  },

  // 设置选中企业
  SetSelectedOrg(state, data = {}) {
    state.selectedOrg = data;
    setSessionStorage(localKey.selectedOrg, state.selectedOrg);
  },

  // 设置用户列表
  SetUserList(state, data) {
    state.userList = data;
  },

  // 设置用户权限
  SetUserAuth(state, data) {
    state.userAuth = (data || []).map(v => v.actionCode);
    setSessionStorage(localKey.userAuth, state.userAuth);
  },

  // 设置用户导航
  SetUserMenu(state, menu) {
    const dashboard = {};
    const { app: { home }, navbar } = config;
    dashboard[navbar.id] = '007';
    dashboard[navbar.parentId] = '0';
    dashboard[navbar.label] = '工作台';
    dashboard[navbar.icon] = 'dashboard';
    dashboard[navbar.code] = home;
    dashboard[navbar.path] = home;
    state.userMenu = [dashboard, ...menu];
    setSessionStorage(localKey.navMenu, state.userMenu);
  },

  // 设置面包屑导航
  SetBreadcrumbList(state, list) {
    state.breadcrumbList = list || [];
  },

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
