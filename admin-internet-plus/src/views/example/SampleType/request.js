import axios from '@/libs/axios';

/**
 * @deprecated 系统框架接口
 */

export const emptyForm = (obj = {}) => Object.assign({
  icon: '',       // 图标
  typeName: '',   // 检测类型名称
  shortName: '',  // 简称
  orderNum: 0,    // 排序值
  remark: '',     // 备注
}, obj);


/**
 * @deprecated 获取行业类型树
 * @param {string} params
 */
export const getIndustryTypeTree = (parentId = '0') => axios.request({
  url: 'base/industryType/tree',
  method: 'get',
  params: {
    parentId,
    sort: 'orderNum-',
    codeText: '',
    rows: 100000,
    page: 1,
  },
});


/**
 * @deprecated 获取行业类型
 * @param {string} params
 */
export const getSampleType = (id) => axios.request({
  url: `base/sampleType/${id}`,
  method: 'get',
});


/**
 * @deprecated 删除行业类型
 * @param {string} params
 */
export const saveSampleType = (data = {}) => axios.request({
  url: 'base/sampleType',
  method: data.id ? 'put' : 'post',
  data,
});


/**
 * @deprecated 删除行业类型
 * @param {string} params
 */
export const removeSampleType = (ids = []) => axios.request({
  url: 'base/sampleType',
  method: 'delete',
  data: ids,
});
