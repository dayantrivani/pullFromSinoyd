// 有业务关联，仅适用于当前项目，需手动引入再调用

import Cookies from 'js-cookie';
// import config from '@/config';
import { Message } from 'element-ui';

export const TOKEN_KEY = 'token';

/**
 * @description 设置 token 到 cookie 中
 * @param {String} token 凭证字符串
 */
export const setToken = (/* token */) => {
  // window.sessionStorage.setItem('user', JSON.stringify(token));
  // Cookies.set(TOKEN_KEY, token, { expires: config.app.cookieExpires || 1 });
};

/**
 * @description 从 cookie 获取 token
 * @returns {String} token 字符串
 */
export const getToken = () => {
  const userInfo = window.sessionStorage.getItem('user')
    ? JSON.parse(window.sessionStorage.getItem('user'))
    : {};
  const { token } = userInfo;
  // const token = Cookies.get(TOKEN_KEY);
  return token || false;
};

/**
 * @description 从 cookie 中清除 token
 */
export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

/**
 * @description 判断层级对象是否含子节点
 * @returns {Boolean} 是否含有子节点
 */
export const hasChild = item => item.children && item.children.length !== 0;


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

/**
 * @description 获取日期
 * @param {Number} day 天数
 * @param {Boolean} isFull 是否补充时分秒
 * @param {Boolean} isEnd 时分秒是否为当天结束点
 */
export const getDay = (day, isFull = true, isEnd) => {
  const today = new Date();
  const targetDayM = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetDayM); // 注意，这行是关键代码
  const tYear = today.getFullYear();
  let tMonth = today.getMonth();
  let tDate = today.getDate();
  tMonth = (tMonth + 1).toString().length === 1 ? `0${tMonth + 1}` : tMonth + 1;
  tDate = tDate.toString().length === 1 ? `0${tDate}` : tDate;
  const result = `${tYear}-${tMonth}-${tDate}`;
  return isFull ? `${result} ${isEnd ? '23:59:59' : '00:00:00'}` : result;
};

/**
 * @description 获取当前年第一天的日期
 * @param {Number} day 天数
 * @param {Boolean} isFull 是否补充时分秒
 * @param {Boolean} isEnd 时分秒是否为当天结束点
 */
export const getYearStart = (isFull = false) => {
  const date = new Date();
  const year = date.getFullYear();
  return `${year}-01-01${isFull ? ' 00:00:00' : ''}`;
};

export const formatDate = (dateObj, fmt = '-d H:i', empty = false) => {
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
