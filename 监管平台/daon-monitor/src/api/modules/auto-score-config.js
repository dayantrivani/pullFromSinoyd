import { merge } from 'lodash';
import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 自动积分方案配置
 */

// 模块接口地址
const modeUrl = '/api/monitor/rule-plan';

// 查询条件
export const emptyQuery = () => ({
  key: '',                 // 关键字
  year: moment().endOf('year'),
  page: 1,
  rows: 10,
});

export const emptyForm = () => ({
  planName: '',
  operationPoints: 0,
  isActive: true,
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
 * @description 获取规则列表
 */
export const getRuleList = () => axios.request({
  url: '/api/monitor/sys-rule',
  method: 'get',
  params: {
    rows: 1000,
  },
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
export const remove = (arr = []) => axios.request({
  url: modeUrl,
  method: 'delete',
  data: [...arr],
});

/**
 * @description 获取单条记录
 */
export const getOne = id => axios.request({
  url: `${modeUrl}/${id}`,
  method: 'get',
});
