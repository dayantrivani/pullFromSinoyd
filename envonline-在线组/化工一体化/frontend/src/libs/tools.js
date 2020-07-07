// 项目通用方法，通过 this.$tools 调用

/**
 * @description 绑定事件
 * @param {HTMLElement} element dom元素
 * @param {String}  event       事件类型
 * @param {Function}  handler   事件绑定的方法
 */
export const on = () => {
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
};


/**
 * @description 解绑事件
 * @param {HTMLElement} element dom元素
 * @param {String}  event       事件类型
 * @param {Function}  handler   事件绑定的方法
 */
export const off = () => {
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
};


/**
 * @description 获取文件后缀名
 * @param {String} fileName 文件全名
 * @param {Boolean} omitDot 省略后缀的点（默认保留.）,
 * @returns {String}        返回文件后缀，例：.png
 */
export const getFleSuffix = (fileName, omitDot) => {
  const indexed = fileName.lastIndexOf('.');
  return fileName.substring(omitDot ? indexed + 1 : indexed, fileName.length);
};


/**
 * @description 获取数据类型
 * @param {Any} data  数据对象
 * @returns {String}  数据类型，例：string
 */
export const getType = data => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();


/**
 * @description 将普通对象转换为 formData 对象，适用于文件上传
 * @param {Object} params 参数对象
 */
export const getFormData = (params) => {
  const formData = new window.FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });
  return formData;
};


/**
 * @description 生成元素
 * @param {String} className  元素样式类名
 * @param {String} el         生成元素
 * @return {HTMLElement}      创建的元素
 */
export const createElem = (className, elType = 'div') => {
  const elem = document.createElement(elType);
  elem.classList.add(className);
  return elem;
};


/**
 * @description 获取元素属性值
 * @param {String} elem             dom元素
 * @param {String} attrName         属性名称
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
 * @description 设置输入域(input/textarea)光标的位置
 * @param {HTMLInputElement/HTMLTextAreaElement} el dom文本元素
 * @param {Number}  index                           光标位置
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
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 * @param {Number} n 数值
 * @returns {String} 处理后的字符串
 */
export const zeroize = n => (n < 10 ? `0${n}` : n);


/**
 * @description 截取日期字符串
 * @param {String} dateStr 日期字符串
 */
export const sliceDate = (dateStr, place = 10) => {
  if (typeof dateStr !== 'string') return '';
  if (dateStr.length <= place) return dateStr;
  return dateStr.slice(0, place);
};


/**
 * @description 获取时间戳转换的日期
 * @param {Number} timeStamp  传入的时间戳
 * @param {Number} startType  要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 * @returns {String}          处理后的日期字符串
 */
export const getTimestampDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000);
  const year = d.getFullYear();
  const month = zeroize(d.getMonth() + 1);
  const date = zeroize(d.getDate());
  const hours = zeroize(d.getHours());
  const minutes = zeroize(d.getMinutes());
  const second = zeroize(d.getSeconds());
  let resStr = '';
  if (startType === 'year') resStr = `${year}-${month}-${date} ${hours}:${minutes}:${second}`;
  else resStr = `${month}-${date} ${hours}:${minutes}`;
  return resStr;
};


/**
 * @description 获取相对于当前的日期间隔
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = (timeStamp) => {
  let timeStampTemp = timeStamp;
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = String(timeStampTemp).length > 10;
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStampTemp /= 1000);
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStampTemp = Number(timeStampTemp);
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000);
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = timeStampTemp < currentTime;
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
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getTimestampDate(timeStampTemp);
  else resStr = getTimestampDate(timeStampTemp, 'year');
  return resStr;
};


/**
 * @description 由一个组件，向上找到最近的指定组件
 * @param {Object} context        当前上下文，也就是传入 this
 * @param {String} componentName  查找的组件的 name
 * @returns 组件
 */
export const findComponentUp = (context, componentName) => {
  let parent = context.$parent;
  let { name } = parent.$options;

  while (parent && (!name || [componentName].indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) {
      // eslint-disable-next-line
      name = parent.$options.name;
    }
  }
  return parent;
};


/**
 * @description 由一个组件，向上找到所有的指定组件, 一般只用在递归组件里面
 * @param {Object} context        当前上下文，也就是传入 this
 * @param {String} componentName  查找的组件的 name
 * @returns 组件集
 */
export const findComponentsUp = (context, componentName) => {
  const parents = [];
  const parent = context.$parent;

  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent);
    return parents.concat(findComponentsUp(parent, componentName));
  }
  return [];
};


/**
 * @description 由一个组件，向下找到最近的指定组件
 * @param {Object} context        当前上下文，也就是传入 this
 * @param {String} componentName  查找的组件的 name
 * @returns 组件
 */
export const findComponentDown = (context, componentName) => {
  const childrens = context.$children;
  let children = null;

  if (childrens.length) {
    // eslint-disable-next-line
    for (const child of childrens) {
      const { name } = child.$options;

      if (name === componentName) {
        children = child;
        break;
      } else {
        children = findComponentDown(child, componentName);
        if (children) break;
      }
    }
  }
  return children;
};


/**
 * @description 由一个组件，向下找到所有指定的组件
 * @param {Object} context        当前上下文，也就是传入 this
 * @param {String} componentName  查找的组件的 name
 * @returns 组件集
 */
export const findComponentsDown = (context, componentName) => context.$children.reduce((components, child) => {
  if (child.$options.name === componentName) {
    components.push(child);
  }
  const foundChilds = findComponentsDown(child, componentName);
  return components.concat(foundChilds);
}, []);


/**
 * @description 由一个组件，找到指定组件的兄弟组件
 * @param {Object} context        当前上下文，也就是传入 this
 * @param {String} componentName  查找的组件的 name
 * @param {Boolean} exceptMe      是否把本身除外
 * @returns 组件
 */
export const findBrothersComponents = (context, componentName, exceptMe = true) => {
  const res = context.$parent.$children.filter(item => item.$options.name === componentName);
  const index = res.findIndex(item => item._uid === context._uid);
  if (exceptMe) res.splice(index, 1);
  return res;
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
