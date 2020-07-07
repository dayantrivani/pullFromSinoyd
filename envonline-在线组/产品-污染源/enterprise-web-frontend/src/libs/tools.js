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
 *   fontSize 即中文文字像素大小,英文文字自动取中文文字的一半,下方正则是用于匹配汉字
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
