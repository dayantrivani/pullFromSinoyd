import crypto from 'crypto-js';
import config from '@/config';
// eslint-disable-next-line import/no-cycle
import axios from '@/libs/api-request';

const urls = {
  // 登录
  login: '/api/monitor/auth/login',
  // 注销
  logout: 'proxy/auth/logout',
  // 刷新 token
  refresh: 'proxy/auth/refresh-token',
  // 获取监管菜单 重置token
  getMenu: '/api/monitor/permission/menu',
  // 选择机构
  chooseReg: '/api/monitor/auth/choice',
  // 获取企业数据
  getCompany: '/api/monitor/company',
  // 注册-获取验证码
  getCode: '/api/monitor/auth/send_code',
  // 注册
  toReg: '/api/monitor/auth/register',
};

/**
 * @description 登录
 * @param {string} userName // 用户名
 * @param {string} password // 密码
 */
export const login = ({ userName, password }) => {
  // 参数加密
  const key = crypto.enc.Latin1.parse('sinoyd**..123456');
  const rules = {
    iv: key,
    mode: crypto.mode.CBC,
    padding: crypto.pad.ZeroPadding,
  };
  return axios.request({
    url: urls.login,
    method: 'post',
    headers: { Authorization: '' },
    data: {
      uid: crypto.AES.encrypt(userName, key, rules).toString(),
      pid: crypto.AES.encrypt(password, key, rules).toString(),
    },
  });
};

/**
 * @description 注销 强制失效token
 */
export const logout = () => axios.request({
  url: urls.logout,
  method: 'post',
});

/**
 * @description 刷新 Token
 * @param {string} token  // 旧 token
 */
export const refreshToken = token => axios.request({
  url: urls.refresh,
  method: 'get',
  headers: {
    refreshToken: token,
  },
});

/**
 * @description 获取用户导航
 * @param {string} loginID  // 登录 ID
 */
// eslint-disable-next-line
export const getUserNav = loginID => axios.request({
  url: `sinoyd-frame/sys/users/${loginID}/permission/nav-menus/tree`,
  method: 'get',
  params: {
    webAppGuid: config.app.id,
  },
});

/**
 * @description 获取用户列表
 * @param {string} loginID  // 远程 ID
 */
export const getUserList = orgGuid => axios.request({
  url: 'sinoyd-frame/sys/users',
  method: 'get',
  params: {
    orgGuid,
  },
});

/**
 * @description 调用互联网+监管平台的菜单接口
 * @param {string} cId  // 系统id
 */
export const getMenu = () => axios.request({
  url: urls.getMenu,
  method: 'get',
  // params: {
  //   cId: 3,
  // },
});

/**
 * @description 选择机构
 */
export const chooseReg = id => axios.request({
  url: urls.chooseReg,
  method: 'get',
  params: { orgId: id },
});

// /**
//  * @description 选择机构
//  */
// export const getCompany = () => axios.request({
//   url: urls.getCompany,
//   method: 'get',
//   params: {
//     rows: 2147483647,
//   },
// });

/**
 * @description 注册-获取验证码
 */
export const getCode = mobile => axios.request({
  url: urls.getCode,
  method: 'post',
  data: {
    mobile,
  },
});

/**
 * @description 注册
 */
export const toReg = data => axios.request({
  url: urls.toReg,
  method: 'post',
  data,
});
