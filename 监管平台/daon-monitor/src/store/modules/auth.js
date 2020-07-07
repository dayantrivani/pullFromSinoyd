// 路由与登陆权限控制
import { Message } from 'ant-design-vue';
import config from '@/config';
import asyncRoutes from '@/config/router-config';
// import navMenu from '@/config/nav-config';
import {
  setLocalStorage, setSessionStorage, getSessionStorage, getDepthVal,
} from '@/libs/tools';
import {
  analyzeResp, setToken, getToken, removeToken, toTreeFlat,
} from '@/libs/util';

// eslint-disable-next-line import/no-cycle
import {
  login, refreshToken, getUserList,
} from '@/api/auth';

const state = {
  // jwtToken
  token: getToken(),
  // 当前导航 id
  // navKey: 'demo',
  // 用户信息
  userInfo: getSessionStorage(config.localKey.userInfo) || {},
  // 用户导航菜单
  userMenu: getSessionStorage(config.localKey.navMenu) || [],
  // 用户列表
  userList: [],
  // 面包屑列表
  breadcrumbList: [],
  // 动态路由索引
  dynamicRoutes: [],
  // homeRouter
  homeRoute: null,
  // 侧栏展开项
  openKeys: [],
  // 接口获取的导航
  // newMenu: getSessionStorage('NEW_USER_MENU') || [],
  // 真正的新导航
  // newUserMenu: getSessionStorage('NEW_USER_MENU') || [],
  // 控制登录和选择机构的切换
  toggle: false,
  // 控制展示机构弹框
  isVisible: false,
};

const getters = {
  // 用户ID
  userGuid: state => state.userInfo.userGuid || '',
  // 用户名
  userName: state => state.userInfo.userName || '未登录',
  // 侧栏导航
  navMenu: state => state.userMenu,
  // 新的侧栏导航
  // newNavMenu: state => state.newMenu,
  // newNavMenu: () => getSessionStorage('NEW_USER_MENU') || [],
  // 偏平菜单
  flatMenu: state => toTreeFlat(state.userMenu),
  // 动态追加导航
  addRoutes: (state) => {
    // 获取导航模块编码
    const modItem = getDepthVal(getSessionStorage(config.localKey.navMenu), false);
    const modItemCode = modItem.map(v => v[config.navbar.path]);
    // 过滤未配置路由的导航
    const result = asyncRoutes.filter(v => modItemCode.includes(v.name));
    // 合并参数
    result.map((item) => {
      // console.log(modItem);
      const selfItem = modItem.find(v => v[config.navbar.path] === item.name);
      const meta = {
        title: selfItem[config.navbar.label] || '',
        icon: selfItem[config.navbar.icon] || '',
      };
      item.meta = item.meta ? Object.assign(item.meta, meta) : meta;
      if (item.name === config.app.home) {
        state.homeRoute = item;
      }
      if (selfItem.parentCode) {
        item.parentCode = selfItem.parentCode;
      }
      return item;
    });
    state.dynamicRoutes = result.map(v => v.name);
    return result;
  },
  // 动态追加新导航
  // newAddRoutes: (state) => {
  //   // 获取导航模块编码
  //   const modItem = getDepthVal(state.newUserMenu, false);
  //   const modItemCode = modItem.map(v => v[config.navbar.path]); // config.navbar.path: moduleCode
  //   // 过滤未配置路由的导航
  //   const result = asyncRoutes.filter(v => modItemCode.includes(v.name));
  //   // 合并参数
  //   result.map((item) => {
  //     const selfItem = modItem.find(v => v[config.navbar.path] === item.name);
  //     const meta = {
  //       title: selfItem[config.navbar.label] || '',
  //       icon: selfItem[config.navbar.icon] || '',
  //     };
  //     item.meta = item.meta ? Object.assign(item.meta, meta) : meta;
  //     if (item.name === config.app.home) {
  //       state.homeRoute = item;
  //     }
  //     if (selfItem.parentCode) {
  //       item.parentCode = selfItem.parentCode;
  //     }
  //     return item;
  //   });
  //   state.dynamicRoutes = result.map(v => v.name);
  //   // eslint-disable-next-line
  //   console.log(state.dynamicRoutes);
  //   return result;
  // },
};

const actions = {
  Login({ commit }, params) {
    return new Promise((resolve, reject) => {
      const data = {
        userName: params.uid,
        password: params.pid,
      };
      login(data).then((response) => {
        if (response.status === 200 && response.data.code !== 500) {
          setLocalStorage(config.localKey.remember, params.remember ? 1 : 0);
          commit('SetToken', response.headers.authorization || response.data.data.token);
          commit('SetUserInfo', response.data.data);
          resolve(response.data.data);
        } else {
          Message.warning({ duration: 1500, message: response.data.msg });
          reject();
        }
      }, ({ response }) => {
        analyzeResp(response);
        reject();
      });
    });
  },
  // 获取用户导航
  GetUserMenu({ getters, commit }) {
    return new Promise((resolve) => {
      commit('SetUserMenu', getSessionStorage(config.localKey.navMenu)); // 这里的navMenu就是nav-config里的配置
      resolve(getters.addRoutes);
    });
  },
  // 获取接口返回的导航
  // GetNewMenu({ getters, commit }) {
  //   // console.log(getSessionStorage('NEW_USER_MENU'));
  //   return new Promise((resolve) => {
  //     commit('SetNewMenu', getSessionStorage('NEW_USER_MENU'));
  //     resolve(getters.newAddRoutes);
  //   });
  // },
  // 刷新token
  RefreshToken({ commit }) {
    return new Promise((resolve, reject) => {
      refreshToken().then((response) => {
        commit('SetToken', response.data.token);
        resolve(response);
      }, (error) => {
        commit('Logout'); // 刷新失败，就需要重新登录了
        reject(error);
      });
    });
  },
  // 获取面包屑列表
  GetBreadcrumbList({ getters, commit }, params) {
    if (!getters.flatMenu.length || !params) return;
    const getBreadcrumb = (id) => {
      const result = [];
      const data = getters.flatMenu.filter(v => v[config.navbar.id] === id)[0];
      result.unshift(data);
      if (data[config.navbar.parentId] !== '0') {
        result.unshift(...getBreadcrumb(data[config.navbar.parentId]));
      }
      return result;
    };
    const result = getBreadcrumb(params);
    commit('SetBreadcrumbList', result);
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
};

const mutations = {
  // // 切换模块导航
  // ToggleMenu(state, id) {
  //   state.navKey = id;
  // },
  // 修改展开导航
  SetOpenMenu(state, data) {
    state.openKeys = data;
  },
  // 设置 token
  SetToken(state, token = false) {
    state.token = token;
    setToken(token);
  },
  // 设置用户信息
  SetUserInfo(state, user) {
    state.userInfo = user;
    setSessionStorage(config.localKey.userInfo, state.userInfo);
  },
  // 设置面包屑导航
  SetBreadcrumbList(state, list) {
    state.breadcrumbList = list || [];
  },
  // 设置用户列表
  SetUserList(state, list) {
    state.userList = list;
  },
  // 设置用户导航
  SetUserMenu(state, menu) {
    const menus = menu;
    // if (menu.length && !config.app.moduleUse) {
    //   menus = config.app.id ? menu : menu[0][config.navbar.children];
    // }
    const judge = (obj) => {
      if (obj.children) {
        obj.children.forEach((el) => {
          el.parentCode = obj.moduleCode;
          judge(el);
        });
      }
    };
    menus.forEach((el) => {
      judge(el);
    });
    state.userMenu = menus;
    setSessionStorage(config.localKey.navMenu, state.userMenu);
  },
  SetNewMenu(state, menu) {
    const menus = menu;
    const judge = (obj) => {
      if (obj.children) {
        obj.children.forEach((el) => {
          // el.parentCode = obj.moduleCode;
          el.parentCode = obj.url;
          judge(el);
        });
      }
    };
    menus.forEach((el) => {
      judge(el);
    });
    state.newUserMenu = menus;
    setSessionStorage('NEW_USER_MENU', state.newUserMenu);
  },
  // 注销用户
  Logout(state) {
    window.localStorage.removeItem('userInfo');
    state.token = false;
    removeToken();
  },
  // 切换登录和选择机构的状态
  SwtichToggle(state, value) {
    state.toggle = value;
  },
  // 切换登录和选择机构的状态
  SwtichVisible(state, value) {
    state.isVisible = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
