// 有业务关联，仅适用于当前项目，需手动引入再调用

import Cookies from 'js-cookie';
import config from '@/config/app.config';
import { Message } from 'element-ui';


/**
 * @description 分析响应错误
 * @param {Object} error 错误对象或者解构的 { response }
 */
export const analyzeResp = (error, callback) => {
  const response = error.response || error;
  if (!response) return;
  const errText = response.data ? response.data.msg : '操作有误或者服务器错误';
  switch (response.status) {
    case 403:
      Message.warning('403：无法执行指定操作，请确认您是否具有足够的权限。');
      break;
    case 404:
      Message.warning('404：无法获取指定数据，请确认您的操作。');
      break;
    case 422:
      Message.warning(Object.values(errText).join('\n'));
      break;
    default:
      Message.warning(`${response.status}：${errText}`);
  }
  if (callback) callback(response.status);
};

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
export const getToken = () => (Cookies.get(config.localKey.token) || '');

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
 * @description 对象类数组转数组
 * @param {Object}   obj 层级数据源
 */
export const toArray = (obj) => {
  const keys = Object.keys(obj);
  const result = [];
  keys.forEach((key) => {
    result.push(obj[key]);
  });
  return result;
};

/**
 * @description 数组求和
 * @param {Array} arr 层级数据源
 */
export const getArrSum = arr => arr.reduce((val, newVal) => val + newVal, 0);

/**
 * @description 日期格式化
 * @use {{ date | formatDate（'Y-m-d'）
 */
export const formatDate = (dateObj, fmt = 'Y-m-d H:i', empty = false) => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];
  const lz = (n) => {
    const num = n.toString();
    if (num.length === 1) return `0${num}`;
    return num;
  };
  let t = dateObj;
  // typeof dateObj !== 'string'是为了判断万一传过来的是y-m-d h:i:s格式，会直接执行最后一个else if，格式化为日期格式
  if (dateObj === null || Number.isNaN(dateObj) && typeof dateObj !== 'string') {
    if (typeof empty === 'string') return empty;
    t = new Date();
  } else if (typeof dateObj === 'number') {
    t = new Date(dateObj * 1000);
  } else if (typeof dateObj === 'string') {
    t = new Date(dateObj.replace(/-/g, '/'));
  }
  if (!(t instanceof Date)) {
    throw new Error('被处理的只能是Date对象');
  }
  if (Number.isNaN(t.getTime())) {
    throw new Error('非法日期对象');
  }
  const date = t.getDate();
  const year = t.getFullYear();
  const hours = t.getHours();
  const day = t.getDay();
  const dayName = days[day];
  const min = t.getMinutes();
  const sec = t.getSeconds();
  const month = t.getMonth();
  const am = hours < 12 ? 'am' : 'pm';
  const ms = t.getTime() % 1000;
  let hours12 = hours % 12;
  hours12 = hours12 || 12;
  const fd = new Date(t.getFullYear(), 0, 1);
  const dayOfYear = Math.round((t - fd) / 8.64e7);
  const weekNum = Math.ceil((((t - fd) / 8.64e7) + fd.getDay() - 1) / 7);
  const a = {
    d: lz(date),
    D: dayName.substr(0, 3),
    l: dayName,
    w: day,
    j: date,
    z: dayOfYear,
    W: weekNum,
    M: months[month].substr(0, 3),
    F: months[month],
    Y: year,
    a: am,
    A: am.toUpperCase(),
    y: year.toString().substr(2, 2),
    c: t.toISOString(),
    m: lz(month + 1),
    U: Math.round(t / 1000),
    g: hours12,
    G: lz(hours12),
    h: hours,
    H: lz(hours),
    i: lz(min),
    s: lz(sec),
    e: ms,
  };
  const v = [];
  Object.keys(a).forEach((k) => {
    v.push(`(\\\\)?${k}`);
  });
  return fmt.replace(new RegExp(v.join('|'), 'g'), (k) => {
    if (a[k]) return a[k];
    return k.replace('\\', '');
  });
};

/**
 * @description 根据时间间隔获取区间数组
 * @param {*string} start 开始时间 'Y-m-d H:i:s'
 * @param {*string} end 结束时间 'Y-m-d H:i:s' 结束时间与开始时间保证有一个时间间隔
 * @param {*string} int 时间间隔 s/m/h/d/w/M--秒/分/时/天/周/月
 * @param {*string} fmt 输出时间格式
 */
export const getIntervalDateByArr = (start, end, int, fmt = 'Y-m-d') => {
  let startDate = Date.parse(start.replace(/-/g, '/'));
  const endDate = Date.parse(end.replace(/-/g, '/'));
  const dateArr = [];
  const unit = int.replace(/ms/, '').replace(/s/, '').replace(/m/, '').replace(/h/, '')
    .replace(/d/, '')
    .replace(/w/, '')
    .replace(/M/, '')
    .replace(/Y/, '');
  let sum;
  // int = 1;
  if (int.indexOf('ms') !== -1) {
    sum = 1 * unit;
  } else if (int.indexOf('s') !== -1) {
    sum = 1 * 1000 * unit;
  } else if (int.indexOf('m') !== -1) {
    sum = 1 * 1000 * 60 * unit;
  } else if (int.indexOf('h') !== -1) {
    sum = 1 * 1000 * 60 * 60 * unit;
  } else if (int.indexOf('d') !== -1) {
    sum = 1 * 1000 * 60 * 60 * 24 * unit;
  } else if (int.indexOf('w') !== -1) {
    sum = 1 * 1000 * 60 * 60 * 24 * 7 * unit;
  }
  while (startDate <= endDate) {
    if (int.indexOf('M') !== -1) {
      startDate = new Date(startDate);
      dateArr.push(formatDate(startDate, fmt));
      startDate.setMonth(startDate.getMonth() + Number(unit));
      startDate = Date.parse(startDate);
    } else if (int.indexOf('Y') !== -1) {
      startDate = new Date(startDate);
      dateArr.push(formatDate(startDate, fmt));
      startDate.setFullYear(startDate.getFullYear() + Number(unit));
      startDate = Date.parse(startDate);
    } else {
      dateArr.push(formatDate(new Date(startDate), fmt));
      startDate += sum;
    }
  }
  return  dateArr;
};

/**
 * @description 按位与换算
 * @param {*number} num
 */
const ADD_ARR = [1, 2, 4, 8, 16, 32, 64, 128, 256];
export const getBitwise = (num) => {
  const result = [];
  for (let i = 0; i < ADD_ARR.length; i++) {
    // eslint-disable-next-line no-bitwise
    if (ADD_ARR[i] & num) { result.push(ADD_ARR[i]); }
  }
  return result;
};
