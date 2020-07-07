/**
 * @description 获取几天前的日期
 *  isFull 是否 需要时分秒格式
 *  isEnd  当isFull为true时,是否是一天中的最晚时间
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

/**
 * @description 清空null
 */
export const clearNull = (obj) => {
  const item = { ...obj };
  Object.keys(item).forEach((key) => {
    // eslint-disable-next-line
    if (item[key] == undefined) {
      item[key] = '';
    }
  });
  return item;
};

/**
 * @description 计算字符串（String）的长度,单位像素
 *   fontSize 即中文文字像素大小,英文文字自动取中文文字的一半
 *   下方正则是用于匹配汉字
 */
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
 * @description 获取当前年月
 */
export const getCurrentYearMonth = (date) => {
  let month = parseInt(date.getMonth() + 1, 10);
  if (month < 10) month = `0${month}`;
  return `${date.getFullYear()}-${month}`;
};

/**
 * @description 获取当前月份的第一天
 */
export const getCurrentMonthFirstDay = (date) => {
  let month = parseInt(date.getMonth() + 1, 10);
  if (month < 10) month = `0${month}`;
  return `${date.getFullYear()}-${month}-01`;
};

/**
 * @description 获取当前月份的最后一天
 */
export const getCurrentMonthLastDay = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  const day = new Date(year, month, 0);
  return `${year}-${month}-${day.getDate()}`;
};

/**
 * @description 格式化时间，输入date类型，返回string
 */
// 时间格式转换
export const dateFormat = (dateObj = null, fmt = 'Y-m-d') => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];
  const lz = (num) => {
    if (num.toString().length === 1) {
      const temp = '0';
      return temp + num.toString();
    }
    return num;
  };
  const t = new Date(dateObj) || new Date();
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
    if (a[k]) {
      return a[k];
    }
    return k.replace('\\', '');
  });
};


/**
 * @description 时间加减计算
 */
export const addDateTime = (dateObj = null, num = 1, type = 'day') => {
  const t = new Date(dateObj) || new Date();
  if (type === 'day') {
    t.setDate(t.getDate() + num);
  }
  if (type === 'month') {
    t.setMonth(t.getMonth() + num);
  }
  if (type === 'year') {
    t.setYear(t.getFullYear() + num);
  }
  if (type === 'hour') {
    t.setHours(t.getHours() + num);
  }
  if (type === 'minute') {
    t.setMinutes(t.getMinutes() + num);
  }
  return t;
};


/**
 * @description 构造因子下拉树
 */
export const toFactorTree = (data) => {
  const result = [];
  const temp = [];
  data.forEach((item) => {
    if (!temp.includes(item.valueTypeName)) {
      temp.push(item.valueTypeName);
      result.push({
        name: item.valueTypeName,
        children: data.filter(p => p.valueTypeName === item.valueTypeName).sort((n, m) => { // 排序数组，相同因子放在相邻列
          let temp = 0;
          if (n.factorCode < m.factorCode) {
            temp = -1;
          } else if (n.factorCode > m.factorCode) {
            temp = 1;
          } else {
            temp = 0;
          }
          return temp;
        }),
      });
    }
  });
  return result;
};
