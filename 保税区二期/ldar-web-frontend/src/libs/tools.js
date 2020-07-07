// 无业务关联，可适用与所有项目

/**
 * @description 获取数据类型
 * @param {Any} data
 */
export const getType = data => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

/**
 * @description 获取文件后缀名
 * @param {String} fileName
 */
export const getFleSuffix = (fileName) => {
  const indexed = fileName.lastIndexOf('.') + 1;
  return fileName.substring(indexed, fileName.length);
};

/**
 * @description 将-、_、/ 的命名转为驼峰式命名
 * @param {String} str 名称
 * @param {Boolean} isBig 是否转换为大驼峰
 */
const toUpper = v => v.toUpperCase();
export const classify = (str, isBig = true) => {
  // eslint-disable-next-line no-useless-escape
  const strTemp = str.replace(/(?:^|[-_\/])(\w)/g, toUpper).replace(/([-_\/])/g, '');
  return isBig ? strTemp : strTemp.substring(0, 1).toLowerCase() + strTemp.substring(1);
};

/**
 * @description 将驼峰式命名转换为-
 * @param {String} str
 */
export const hyphenate = str => str.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * @description 将-命名方式转换为驼峰式
 * @param {String} str 带转换字符串
 * @param {Boolean} isBig 是否转换为大驼峰
 */
export const camelize = (str, isBig) => {
  const strTemp = str.replace(/-(\w)/g, toUpper).replace(/-/g, '');
  return isBig ? strTemp.substring(0, 1).toUpperCase() + strTemp.substring(1) : strTemp;
};

/**
 * @description 获取元素属性值
 * @param {String} elem dom元素
 * @param {String} attrName 属性名称
 * @param {Boolean} isConvertNumbar 是否转化为数值
 */
export const getElemAttrVal = (elem, attrName = 'width', isConvertNumbar = true) => {
  const oStyle = elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem, null);
  let val = '';
  if (oStyle[attrName]) {
    val = oStyle[attrName];
  } else {
    val = oStyle.getPropertyValue ? oStyle.getPropertyValue(attrName) : oStyle.getAttribute(attrName);
  }
  return isConvertNumbar ? parseFloat(val) : val;
};


/**
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 * @param {Array} arr1
 * @param {Array} arr2
 */
export const getIntersection = (arr1, arr2) => {
  const len = Math.min(arr1.length, arr2.length);
  const res = [];
  let i = -1;
  while (++i < len) {
    const item = arr2[i];
    if (arr1.indexOf(item) > -1) res.push(item);
  }
  return res;
};

/**
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 * @param {Array} arr1
 * @param {Array} arr2
 */
export const getUnion = (arr1, arr2) => Array.from(new Set([...arr1, ...arr2]));

/**
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 */
export const hasOneOf = (targetarr, arr) => targetarr.some(_ => arr.indexOf(_) > -1);

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => String(timeStamp).length > 10;

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => timeStamp < currentTime;

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => (num < 10 ? `0${num}` : num);

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
export const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000);
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = '';
  if (startType === 'year') resStr = `${year}-${month}-${date} ${hours}:${minutes}:${second}`;
  else resStr = `${month}-${date} ${hours}:${minutes}`;
  return resStr;
};

export const tableTitleLen = (str, fontSize = 14) => {
  const strItem = str.split('');
  const count = [0, 0];
  /* eslint-disable max-len */
  const regex = /(?:[\u3400-\u4DB5\u4E00-\u9FEF\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])/;
  strItem.forEach((item) => {
    if (regex.test(item)) {
      count[0]++;
    }
  });
  count[1] = strItem.length - count[0];
  if (fontSize) {
    return (count[0] * fontSize) + (count[1] * (fontSize / 2)) + 40;
  }
  return count;
};

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = (timeStamp) => {
  let timeStampTemp = timeStamp;
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStampTemp);
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStampTemp /= 1000);
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStampTemp = Number(timeStampTemp);
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000);
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStampTemp, currentTime);
  // 获取两个时间戳差值
  let diff = currentTime - timeStampTemp;
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff;
  let resStr = '';
  const dirStr = IS_EARLY ? '前' : '后';
  // 少于等于59秒
  if (diff <= 59) resStr = `${diff}秒${dirStr}`;
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = `${Math.floor(diff / 60)}分钟${dirStr}`;
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = `${Math.floor(diff / 3600)}小时${dirStr}`;
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = `${Math.floor(diff / 86400)}天${dirStr}`;
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStampTemp);
  else resStr = getDate(timeStampTemp, 'year');
  return resStr;
};

/**
 * @description 日期格式化
 * @param {Date} dateObj 日期对象
 * @param {String} fmt 日期格式化
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
 * @description 获取N个月之后的日期
 * @param {String} timeStamp // 时间字符串
 * @param {Int} n // 月份
 */
export const computeDate = (timeStamp, n) => {
  const str = timeStamp.split('-');
  const d = new Date(str[0], str[1], str[2]);
  // 因为getMonth()获取的月份的值只能在0~11之间所以在进行setMonth()之前先给其减一
  d.setMonth((d.getMonth() - 1) + n);
  const year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  if (day === '00') {
    // eslint-disable-next-line radix
    month = parseInt(month) - 1;
    const newDate = new Date(year, month, 1);
    day = (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate();
  }
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
};

/**
 * @description 截取日期
 * @param {String} dateStr 日期字符串
 */
export const date = (dateStr) => {
  if (typeof dateStr !== 'string') return '';
  if (dateStr.length <= 10) return dateStr;
  return dateStr.slice(0, 10);
};

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent;
  const isExplorer = exp => ua.indexOf(exp) > -1;
  if (isExplorer('MSIE')) return 'IE';
  if (isExplorer('Firefox')) return 'Firefox';
  if (isExplorer('Chrome')) return 'Chrome';
  if (isExplorer('Opera')) return 'Opera';
  if (isExplorer('Safari')) return 'Safari';
  return false;
};

/**
 * @description 生成元素
 */
export const createElem = (className, elType = 'div') => {
  const elem = document.createElement(elType);
  elem.classList.add(className);
  return elem;
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (() => {
  if (document.addEventListener) {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  }
  return (element, event, handler) => {
    if (element && event && handler) {
      element.attachEvent(`on${event}`, handler);
    }
  };
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (() => {
  if (document.removeEventListener) {
    return (element, event, handler) => {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  }
  return (element, event, handler) => {
    if (element && event) {
      element.detachEvent(`on${event}`, handler);
    }
  };
})();

/**
 * @description 设置输入域(input/textarea)光标的位置
 * @param {HTMLInputElement/HTMLTextAreaElement} el // dom元素
 * @param {Number} index  // 光标位置
 */
export const setCursorPosition = (el, index) => {
  const val = el.value;
  const len = val.length;
  if (len < index) return; // 超过文本长度直接返回
  setTimeout(() => {
    el.focus();
    if (el.setSelectionRange) { // 标准浏览器
      el.setSelectionRange(index, index);
    } else { // IE9-
      const range = el.createTextRange();
      range.moveStart('character', -len);
      range.moveEnd('character', -len);
      range.moveStart('character', index);
      range.moveEnd('character', 0);
      range.select();
    }
  }, 10);
};

/**
 * @description 返回IE浏览器版本，非IE返回 false
 */
export const IEVersion = () => {
  const { userAgent } = navigator; // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    const fIEVersion = parseFloat(RegExp.$1);
    if (fIEVersion === 7) {
      return 7;
    } if (fIEVersion === 8) {
      return 8;
    } if (fIEVersion === 9) {
      return 9;
    } if (fIEVersion === 10) {
      return 10;
    }
    return 6;// IE版本<=7
  } if (isEdge) {
    return 'edge';// edge
  } if (isIE11) {
    return 11; // IE11
  }
  return false;// 不是ie浏览器
};
