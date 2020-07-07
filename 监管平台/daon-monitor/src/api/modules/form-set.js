import { merge } from 'lodash';
import axios from '@/libs/api-request';
/**
 * @description 表单设置
 */

// 查询条件
export const emptyQuery = () => ({
  name: '',                 // 表单名称
  page: 1,
  rows: 10,
});

/**
 * @description 表单列表查询
 */

export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  return axios.request({
    url: '/api/monitor/form',
    method: 'get',
    params,
  });
};

/**
 * @description 展示15天内任务分布
 */
export const getOne = id => axios.request({
  url: `/api/monitor/form/${id}`,
  method: 'get',
});

/**
 * @description 保存
 */
export const save = (data, id = '') => axios.request({
  url: `/api/monitor/form${id ? `/${id}` : ''}`,
  method: id ? 'put' : 'post',
  data,
});

/**
 * @description 删除
 */
export const remove = (arr = []) => axios.request({
  url: '/api/monitor/form',
  method: 'delete',
  data: [...arr],
});
