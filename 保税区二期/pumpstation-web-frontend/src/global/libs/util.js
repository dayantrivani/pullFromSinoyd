// 有业务关联，仅适用于当前项目
// import config from '@/config';
import { Message } from 'element-ui';
import { getFleSuffix } from '@/global/libs/tools';


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
 * @description 取层级对象最底层指定字段值
 * @param {Array} array 层级数组对象
 * @param {String} field 取值字段名
 * @param {String} depth 子层级字段名
 */
export const getDepthVal = (array, field, depth = 'children') => {
  const result = [];
  const fn = (data) => {
    data.forEach((item) => {
      if (!item[depth] || !item[depth].length) {
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
 * @description 普通对象转换为 formData对象
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
  const suffix =  getFleSuffix(fileName);
  let icon = 'icon-file-other';
  Object.keys(fileIcons).forEach((key) => {
    if (fileIcons[key].includes(suffix)) {
      icon = key;
    }
  });
  return icon;
};

export default {};
