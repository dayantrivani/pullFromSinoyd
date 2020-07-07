import crypto from 'crypto-js';
import config from '@/config';
import axios from '@/libs/api.request';

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
    url: 'proxy/auth/login',
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
  url: 'proxy/auth/jwt/invalid',
  method: 'post',
});

/**
 * @description 刷新 Token
 * @param {string} token  // 旧 token
 */
export const refreshToken = token => axios.request({
  url: 'proxy/auth/refresh-token',
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
  url: `sinoyd-frame/sys/users${config.baseUrl.mock}/permission/nav-menus/tree`,
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
