import { merge } from 'lodash';
// import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 计分周期配置
 */

// 模块接口地址
const modeUrl = '/api/monitor/period-setting';

// 查询条件
export const emptyQuery = () => ({
  year: null,
  page: 1,
  rows: 10,
});

/**
 * @description 表单
 */
export const emptyForm = () => ({
  // id: '',
  year: '2019',
  period: '',
});

/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  // const params = merge(emptyQuery(), queryForm);
  const params = merge({}, queryForm);
  params.year = params.year ? params.year.format('l').slice(0, 4) : '';
  return axios.request({
    url: modeUrl,
    method: 'get',
    params,
  });
};

/**
 * @description 获取单条记录
 */
export const getOne = id => axios.request({
  url: `${modeUrl}/${id}`,
  method: 'get',
});

/**
 * @description 保存
 */
export const save = (data, row) => axios.request({
  url: row.id ? `${modeUrl}/${row.id}` : `${modeUrl}`,
  method: row.id ? 'put' : 'post',
  data,
});

/**
 * @description 新增记录
 */
export const create = (data, row) => save(data, row);

/**
 * @description 更新记录
 */
export const update = (data, row) => save(data, row);

/**
 * @description 删除
 */
export const remove = id => axios.request({
  url: `${modeUrl}/${id}`,
  method: 'delete',
});
