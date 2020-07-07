// 有业务关联，仅适用于当前项目，需手动引入再调用

import Cookies from 'js-cookie';
import { Message } from 'ant-design-vue';
import config from '@/config';
import { getFileSuffix } from '@/libs/tools';

/**
 * @description 设置 token 到 cookie 中
 * @param {String} token 凭证字符串
 */
// 转换过期时间格式
const getCookieTime = (timeStr) => {
  if (timeStr.includes('day')) {
    return timeStr.slice(0, timeStr.indexOf('day')) - 0;
  } if (timeStr.includes('hour')) {
    const time = timeStr.slice(0, timeStr.indexOf('hour')) - 0;
    return new Date(new Date().getTime() + time * 60 * 60 * 1000);
  } if (timeStr.includes('minute')) {
    const time = timeStr.slice(0, timeStr.indexOf('minute')) - 0;
    return new Date(new Date().getTime() + time * 60 * 1000);
  }
  return 1;
};
export const setToken = (token) => {
  Cookies.set(config.localKey.token, token, {
    // 设置过期时间
    expires: getCookieTime(config.app.cookieExpires),
  });
};

/**
 * @description 从 cookie 获取 token
 * @returns {String} token 字符串
 */
export const getToken = () => {
  const token = Cookies.get(config.localKey.token);
  console.log(token);
  return token || false;
};

/**
 * @description 从 cookie 中清除 token
 */
export const removeToken = () => {
  Cookies.remove(config.localKey.token);
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
  const config = typeof res === 'string' ? res : res.data.msg;
  if (['success', 'warning', 'error'].includes(type)) {
    Message[type](config);
  } else {
    config.message = type;
    Message(config);
  }
};

/**
 * @description 分析响应错误
 * @param {Object} error 错误对象或者解构的 { response }
 */
export const analyzeResp = (error) => {
  if (!error || !error.data) return;
  // const FIELD = 'msg';  // 错误消息字段名
  // const response = error.response || error;
  // const errMsg = response.data ? response.data[FIELD] : '';
  const errMsg = error.data ? error.data.msg : '';
  // console.log(error.status);
  switch (error.status) {
    case 422:
      // Message.warning({ message: Object.values(errMsg).join('\n') });
      Message.warning(Object.values(errMsg).join('\n'));
      break;
    case 403:
      // Message.warning({ message: '无法执行指定操作，请确认您是否具有足够的权限。' });
      Message.warning('无法执行指定操作，请确认您是否具有足够的权限。');
      break;
    case 404:
      // Message.warning({ message: '无法获取指定数据，请确认您的操作。' });
      Message.warning('无法获取指定数据，请确认您的操作。');
      break;
    case 429:
      // Message.warning({ message: '您的操作过于频繁，请稍后再试。' });
      Message.warning('您的操作过于频繁，请稍后再试。');
      break;
    default:
      // Message({
      //   message: errMsg || '操作有误或者服务器错误',
      //   type: error.status >= 500 ? 'error' : 'warning',
      // });
      Message[error.status >= 500 ? 'error' : 'warning'](errMsg || '操作有误或者服务器错误');
  }
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

/**
 * @description 字符串去重
 * @param {String} str  字符串
 * @param {String} separator  分隔符
 */
export const heavyStr = (str, separator = '/') => {
  const arr = str.split(separator);
  const set = new Set(arr);
  return Array.from(set).join(separator);
};

/**
 * @description 文件下载
 * @param {Object} response  请求响应体
 * @param {String} fileName  文件名（含后缀）
 * 需设置服务器响应的数据类型 responseType: 'arraybuffer'
 * https://www.kancloud.cn/yunye/axios/234845
 */
export const downloadFile = (response, fileName) => {
  const fileBlob = new Blob([response.data], { type: 'application/x-xls' });
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(fileBlob, fileName);
  } else {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(fileBlob);
    link.download = fileName || decodeURI(response.headers['content-disposition']).split('=')[1];
    document.body.appendChild(link);  // fix: 修复在火狐未触发下载问题
    link.click();
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }
};


/**
 * @description 复制文本
 * @param {String} input  复制的内容
 * @return {Boolean} 是否复制成功
 */
export const copyText = (input) => {
  const el = document.createElement('textarea');
  el.value = input;

  // Prevent keyboard from showing on mobile
  el.setAttribute('readonly', '');

  el.style.contain = 'strict';
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  el.style.fontSize = '12pt'; // Prevent zooming on iOS

  const selection = getSelection();
  let originalRange = false;
  if (selection.rangeCount > 0) {
    originalRange = selection.getRangeAt(0);
  }

  document.body.appendChild(el);
  el.select();

  // Explicit selection workaround for iOS
  el.selectionStart = 0;
  el.selectionEnd = input.length;

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    //
  }

  document.body.removeChild(el);

  if (originalRange) {
    selection.removeAllRanges();
    selection.addRange(originalRange);
  }
  return success;
};

/**
 * @description 将层级数据做扁平化处理
 * @param {Array}   data 层级数据源
 * @param {String}  children 子级字段名
 * @return {Array} 转化后的偏平数据
 */
export const toTreeFlat = (data, children = 'children') => {
  const emptyArr = [];
  data.forEach((v) => {
    if (v[children]) {
      emptyArr.push(...toTreeFlat(v[children], children));
    }
    emptyArr.push(v);
  });
  return emptyArr;
};

/**
 * @description 判断表格单元格宽度是否超出
 * @param {dom}   span的节点
 */
export const widthJudgment = (className, index) => {
  const childWidth = document.getElementsByClassName(className)[index].scrollWidth;
  const parentWidth = document.getElementsByClassName(className)[index].parentNode.scrollWidth;
  if (childWidth > parentWidth) return true;
  return false;
};

/**
 * @description 获取文件类型图标
 * @param {Object} fileName
 */
const fileIcons = {
  'icon-file-pdf': ['pdf'],
  'icon-file-doc': ['doc', 'docx'],
  'icon-file-xls': ['xls', 'xlsx'],
  'icon-file-ppt': ['ppt', 'pptx'],
  'icon-file-zip': ['zip', 'rar', '7z'],
  'icon-file-img': ['jpg', 'jpeg', 'png', 'gif'],
  'icon-file-html': ['html'],
  'icon-file-music': ['mp3'],
  'icon-file-video': ['mp4'],
};
export const getFileIcon = (fileName) => {
  const suffix = getFileSuffix(fileName, true);
  let icon = 'icon-file-other';
  Object.keys(fileIcons).forEach((key) => {
    if (fileIcons[key].includes(suffix)) {
      icon = key;
    }
  });
  return icon;
};
