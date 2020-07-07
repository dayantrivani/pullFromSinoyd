import cryptoJS from 'crypto-js';

import axios from '@/libs/axios';
import config from '@/config/app.config';

/**
 * @deprecated 系统框架接口
 */


/**
 * @deprecated 获取验证码
 * @param {string} params
 */
export const getCaptcha = () => axios.request({
  url: 'proxy/captcha/get',
  method: 'get',
  params: { type: 'character' },
});


/**
 * @deprecated 登录
 * @param {object} form
 */
export const login = (form) => {
  // 加密处理
  const key = cryptoJS.enc.Latin1.parse('sinoyd**..123456');
  const rules = {
    iv: key,
    mode: cryptoJS.mode.CBC,
    padding: cryptoJS.pad.ZeroPadding,
  };
  const keyParams = {
    uid: cryptoJS.AES.encrypt(form.uid, key, rules).toString(),
    pid: cryptoJS.AES.encrypt(form.pid, key, rules).toString(),
  };
  return axios.request({
    url: 'proxy/auth/login',
    method: 'post',
    headers: config.useCaptcha ? {
      Platform: 'web',
      DeviceID: 'pc',
      CaptchaID: form.captchaID || '',
      CaptchaValue: form.captchaValue || '',
    } : {},
    data: keyParams,
  });
};


/**
 * @description 注销（强制失效token）
 */
export const logout = () => axios.request({
  url: 'proxy/auth/logout',
  method: 'post',
});


/**
 * @deprecated 刷新 token
 * @param {string} refreshToken 原token
 * @param {string} cpi 企业id
 */
export const refreshToken = (refreshToken, cpi) => axios.request({
  url: 'proxy/auth/refresh-token',
  method: 'get',
  headers: {
    Platform: 'web',
    DeviceID: 'pc',
    refreshToken,
    cpi,
  },
});


/**
 * @deprecated 获取用户导航
 * @param {string} userGuid 用户ID
 */
export const getUserNav = userGuid => axios.request({
  url: `sys/users/${userGuid}/permission/nav-menu/tree`,
  method: 'get',
  mock: true,
});


/**
 * @deprecated 获取用户权限
 * @param {string} userGuid 用户ID
 */
export const getUserAuth = userGuid => axios.request({
  url: `sys/users/${userGuid}/permission/module-action/list`,
  method: 'get',
  mock: true,
});


/**
 * @deprecated 获取用户列表
 * @param {string} id 文件id
 */
export const getUserList = () => axios.request({
  url: 'sys/user',
  method: 'get',
});


/**
 * @deprecated 获取新ID
 * @param {string} codeValue 常量代码
 */
// eslint-disable-next-line no-return-await
export const getNewGuid = async () => await axios.request({
  url: 'sys/guid/new',
  method: 'get',
});


/**
 * @deprecated 获取常量
 * @param {string} codeValue 常量代码
 */
export const getEnumList = codeValue => axios.request({
  url: 'sys/enumCode',
  method: 'get',
  params: {
    codeValue,
  },
});
