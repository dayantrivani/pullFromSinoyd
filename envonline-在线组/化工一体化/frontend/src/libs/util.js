// 有业务关联，仅适用于当前项目，需手动引入再调用

// import Cookies from 'js-cookie';
// import config from '@/config';
import { Message } from 'element-ui';

export const TOKEN_KEY = 'jwtToken';

/**
 * @description 设置 token 到 cookie 中
 * @param {String} token 凭证字符串
 */
export const setToken = (token) => {
  window.sessionStorage.setItem(TOKEN_KEY, token);
  // Cookies.set(TOKEN_KEY, token, { expires: config.app.cookieExpires || 1 });
};

/**
 * @description 从 cookie 获取 token
 * @returns {String} token 字符串
 */
export const getToken = () => {
  const token = window.sessionStorage.getItem(TOKEN_KEY);
  // const token = Cookies.get(TOKEN_KEY);
  return token || false;
};

/**
 * @description 从 cookie 中清除 token
 */
export const removeToken = () => {
  window.sessionStorage.removeItem(TOKEN_KEY);
  // Cookies.remove(TOKEN_KEY);
};

/**
 * @description 判断层级对象是否含子节点
 * @returns {Boolean} 是否含有子节点
 */
export const hasChild = item => item.children && item.children.length !== 0;

/**
 * @description 弹框消息
 * @param {String} type     消息类型
 * @param {Object} res      响应体
 */
export const message = (type, res = '') => {
  const config = {
    message: typeof res === 'string' ? res : res.data.msg,
    duration: 3000,
    showClose: true,
  };
  if (['success', 'warning', 'error'].includes(type)) {
    Message[type](config);
  } else {
    config.message = type;
    Message(config);
  }
};

/**
 * @description 分析响应错误
 * @param {Object} error 错误对象
 */
export const analyzeResp = (error) => {
  if (!error || !error.response) return;
  const errorMsg = error.response.data ? error.response.data.msg : '';
  switch (error.response.status) {
    case 422:
      Message.warning({ message: Object.values(errorMsg).join('\n') });
      break;
    case 403:
      Message.warning({ message: '无法执行指定操作，请确认您是否具有足够的权限。' });
      break;
    case 404:
      Message.warning({ message: '无法获取指定数据，请确认您的操作。' });
      break;
    case 429:
      Message.warning({ message: '您的操作过于频繁，请稍后再试。' });
      break;
    default:
      Message({
        message: errorMsg || '操作有误或者服务器错误',
        type: error.response.status >= 500 ? 'error' : 'warning',
      });
  }
};

/**
 * @description 取层级对象指定字段值
 * @param {Array} array   层级数组对象
 * @param {String} field  取值字段名
 * @param {String} depth  子层级字段名
 */
export const getDepthVal = (array, field, depth = 'children') => {
  const result = [];
  const fn = (data) => {
    data.forEach((item) => {
      if (!item[depth].length) {
        result.push(item[field]);
      } else {
        fn(item.children);
      }
    });
  };
  fn(array);
  return result;
};

/**
 * @description 获取数组对象差异
 * @param {Array} target 来源数组（变化数组）
 * @param {Array} source 目标数组（响应数组）
 * @param {String} keyName 比对键值、针对数组包含对象
 * @returns {Array} { difference } 差集, 目标数组有，来源数组无的元素
 * @returns {Array} { complement } 补集, 目标数组无，来源数组有的元素
 */
export const getArrayDiff = (target, source, keyName) => {
  const tarKeys = target.map(v => v[keyName]);
  const souKeys = source.map(v => v[keyName]);
  const result = { difference: [], complement: [] };

  target.forEach((item) => {
    if (!souKeys.includes(item[keyName])) {
      result.difference.push(item);
    }
  });
  source.forEach((item) => {
    if (!tarKeys.includes(item[keyName])) {
      result.complement.push(item);
    }
  });
  return result;
};
