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
 * @description 复制文本
 * @param {String} input  复制的内容
 * @return {Boolean} 是否复制成功
 */
export const copyText = (input = '') => {
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
