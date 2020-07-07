import { merge } from 'lodash';
import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 事项登记
 */

// 模块接口地址
const modeUrl = '/api/monitor/crop-diy-point';

// 查询条件
export const emptyQuery = () => ({
  year: moment().endOf('year'),
  key: '',
  page: 1,
  rows: 10,
});

/**
 * @description 表单
 */
export const emptyForm = () => ({
  // companyId: '',
  // companyName: '',
  corpId: '',
  corpName: '',
  year: null,
  minusPoints: '',
  ruleId: '',
  updatedAt: null,
  userId: '',
  remark: '',
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
export const remove = (arr = []) => axios.request({
  url: modeUrl,
  method: 'delete',
  data: [...arr],
});

/**
 * @description 获取企业
 */
export const getCompany = () => axios.request({
  // url: '/api/monitor/company',
  url: '/api/monitor/corporation',
  method: 'get',
  params: {
    rows: 10000,
  },
});

/**
 * @description 获取规则
 */
export const getRule = () => axios.request({
  url: '/api/monitor/corp-diy-rule',
  method: 'get',
  params: {
    rows: 10000,
  },
});

/**
 * @description 获取用户
 */
export const getUser = () => axios.request({
  url: '/api/monitor/user',
  method: 'get',
  params: {
    rows: 10000,
  },
});

/**
 * @description 获取默认当前周期
 */
export const getPeriod = () => axios.request({
  url: '/api/monitor/diy-points/period',
  method: 'get',
});
