// 路由与登陆权限控制

import lodash from 'lodash';
import CryptoJS from 'crypto-js';
import { Message } from 'element-ui';
import config from '@/config';
import http from '@/global/libs/axios';
import { route, asyncRoutesMap } from '@/routes';
import { getDepthVal, analyzeResp } from '@/global/libs/util';
import DefaultLayout from '@/global/layouts/Default';
import IframeLayout from '@/views/auth/IframePage';

const LOGIN_URL = 'proxy/auth/login';
const REFRESH_TOKEN_URL = 'proxy/auth/refresh-token';
const WEB_APP_GUID = config.isMenuAll ? '' : config.appGuid;

const state = {
  /**
   *  loading        侧栏加载状态
   *  user           存储在sessionStorage,登录接口返回的数据
   *  userMenu       用户侧边栏显示的导航菜单
   *  addRouter      导航栏可被用户点击的导航路由集合
   *  token          登录接口返回的 token
   *  level          侧栏一键展开按钮展开层级
   *  userList       用户列表
   *  iframeRouter   其他系统的页面地址集合 http 开头
   */
  loading: false,
  user: window.sessionStorage.getItem('userInfo')
    ? JSON.parse(window.sessionStorage.getItem('userInfo'))
    : {},
  userMenu: [],
  addRouter: window.sessionStorage.getItem('router')
    ? JSON.parse(window.sessionStorage.getItem('router'))
    : [],
  token: window.sessionStorage.getItem('jwtToken') || false,
  level: 1,
  userList: [],
  iframeRouter: window.sessionStorage.getItem('iframeRouter')
    ? JSON.parse(window.sessionStorage.getItem('iframeRouter'))
    : [],
};

const getters = {
  // 用户名
  /**
   * state.user.userName 用户名
   * state.user.userType 用户类型
   * state.user.orgGuid 用户（企业ID）
   * sideMenu 用于侧栏菜单过滤隐藏页
   */
  userName: state => (state.user.userName || '子曾经曰过'),
  userType: state => (state.user.userType || 'gov'),
  orgGuid: state => (state.user.userType === 'ent' ? state.user.orgGuid : ''),
  sideMenu: (state) => {
    if (!state.userMenu.length) return [];
    return state.userMenu;
  },
};

const actions = {
  Login({ commit }, params) {                  // 登录按钮点击后调取登录接口
    return new Promise((resolve, reject) => {
      // 1. 加密处理
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
      // 2. 调登录接口
      // http.post(LOGIN_URL, {}, { params: keyParams, headers: { Authorization: '' } }).then((response) => {
      http.post(LOGIN_URL, { uid: keyParams.uid, pid: keyParams.pid }, { headers: { Authorization: '' } })
        .then((response) => {
          if (response.status === 200 && response.data.code !== 500) {
            // 2.1 这里的 params 是记录账户密码的对象,加的remember是用来判断用户是否点击了需要保持登陆
            window.localStorage.setItem('canRefresh', params.remember ? 1 : 0);
            /** 2.2
             *   2.2.1 记录token
             *   2.2.2 登录接口返回的用户数据存储 state.user
             *   2.2.3 一是将登录接口返回的用户数据 user 存储在 sessionStorage
             *         二是将用户数据中的 loginID 字段存到 localStorage
             */
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
  GetMenu({ state, dispatch, commit }) {       // 接口获取用户侧栏导航数据（树状结构）
    return new Promise((resolve, reject) => {
      commit('SetLoading', true);
      http.get(`sinoyd-frame/sys/users/${state.user.loginID}/permission/nav-menus/tree`, {
        params: { webAppGuid: WEB_APP_GUID },
      }).then((response) => {
        if (response.data.success) {
          commit('SetUserMenu', response.data.data);
        }
        // 获取用户列表
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
  GetUserList({ state, commit }) {             // 通过接口获取用户列表,在导航树接口请求成功后 state.userList
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
  GetUser({ commit }) {                        // 侧栏导航 beforeCreate 时调用该方法, 确保存在 user
    const user = JSON.parse(window.sessionStorage.getItem('user'));
    if (user) commit('SetUser', user);
  },
  CreateRoutes({ state, commit }) {            // 显示在左侧导航栏中可被点击的导航的路由集合 state.router
    /**
     * asyncRoutesMap 项目框架中存在的页面的路由集合
     */
    return new Promise((resolve) => {
      const flatStr = getDepthVal(state.userMenu, 'moduleUrl');
      commit('SetAddRoutes', lodash.intersection(flatStr, asyncRoutesMap.map(v => v.name)));
      resolve();
    });
  },
  RefreshToken({ state, commit }, config) {    // 刷新token
    return new Promise((resolve, reject) => {
      http.get(REFRESH_TOKEN_URL, { headers: { refreshToken: state.user.refreshToken } }).then((response) => {
        commit('SetToken', response.data.data);
        /* eslint-disable no-param-reassign */
        config.baseURL = '';
        http.request(config).then((newRequest) => {
          resolve(newRequest);
        });
      }, (error) => {
        // commit('Logout'); // 刷新失败，就需要重新登录了
        reject(error);
      });
    });
  },
};

const mutations = {
  /**
   * SetLoading    设置侧边栏导航的加载状态
   * SetToken      设置token
   * SetUserMenu   设置侧边栏导航显示哪些导航内容
   * SetUserJson   设置用户数据到 sessionStorage 并设置 用户数据中的 loginID 字段到 localStorage
   * SetUser       设置store.user = user,存储用户数据
   * SetAddRoutes  存储显示在左侧导航栏中可被点击的导航的路由集合
  */
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
      // config 是配置文件的导出内容
      menus = config.isMenuAll ? menu : menu[0].children;
    }
    state.userMenu = menus;
    if (menus.length) {
      const newRouter = [];
      const menus = config.isMenuAll ? menu : menu[0].children;
      menus.map((v) => {
        // 用于判断嵌套其余系统页面
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
    window.localStorage.setItem('user', JSON.stringify(user.loginID));
  },
  SetUser(state, user) {
    state.user = user;
  },
  SetAddRoutes(state, routers) {
    state.addRouter = routers;
    window.sessionStorage.setItem('router', JSON.stringify(routers));
  },
  SetLevel(state, n) {
    state.level = n;
  },
  SetUserList(state, list) {
    state.userList = list;
  },
  Logout(state) {
    window.sessionStorage.removeItem('jwtToken');
    window.sessionStorage.removeItem('router');
    window.sessionStorage.removeItem('user');
    state.token = false;
    // 生成环境如果失败跳转到集成页登录
    // router.replace({ name: 'login' });
    if (process.env.NODE_ENV === 'production') {
      window.location.href = `${window.location.origin}/frontend/#/login`;
    } else {
      route.replace({ name: 'login' });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
