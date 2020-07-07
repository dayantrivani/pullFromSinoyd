import { merge } from 'lodash';
import axios from '@/libs/axios';

/**
 * @deprecated 参数设置接口定义
 */

//  空查询表单对象
export const emptyQuery = (obj = {}) => merge({
  timeType: '一小时',
  online: ['在线', '离线'],
  configName: '',
  orderByField: 'sortNum DESC',
}, obj);

//  空表单对象
export const emptyForm = (obj = {}) => merge({
  configName: '',   // 参数名称
  configKey: '',    // 参数键名
  configValue: '',  // 参数键值
  sortNum: '',      // 排序
  enabled: '',      // 状态
  note: '',         // 备注
}, obj);

export const formRules = {
  configName: [
    { required: true, message: '请输入参数名称', trigger: ['blur', 'change'] },
  ],
  configKey: [
    { required: true, message: '请输入参数键名', trigger: ['blur', 'change'] },
  ],
};

/**
 * @deprecated 获取参数列表
 * @param {string} params
 */
export const getConfigList = (params = {}) => axios.request({
  url: 'sys/configs',
  method: 'get',
  params: {
    configName: params.configName,
    orderByField: 'sortNum DESC',
  },
  mock: true,
});


/**
 * @deprecated 保存参数
 * @param {string} params
 */
export const saveConfig = (data) => axios.request({
  url: 'sys/configs',
  method: data.id ? 'put' : 'post',
  data,
});


/**
 * @deprecated 删除参数
 * @param {string} params
 */
export const removeConfig = (ids) => axios.request({
  url: 'sys/configs',
  method: 'delete',
  data: ids,
});
