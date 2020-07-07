import { merge } from 'lodash';
import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 运维记录
 */

// 模块接口地址
const modeUrl = '/api/monitor/company';

// 获取运维档案地址
const operUrl = '/api/monitor/om-task';

const exportUrl = '/api/monitor/om-task/report';


// 查询条件
export const emptyQuery = () => ({
  name: '',                 // 关键字
  page: 1,
  rows: 10,
});

export const emptyDialogForm = () => ({
  page: 1,
  rows: 10,
  fromDate: moment().subtract(7, 'days'),
  toDate: moment().endOf('day'),
  creditCode: '',
});

/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  return axios.request({
    url: modeUrl,
    method: 'get',
    params,
  });
};

/**
 * @description 获取运维档案数据
 */
export const getDialogList = (queryForm) => {
  const params = merge({}, queryForm);
  params.fromDate = queryForm.fromDate ? queryForm.fromDate.format('YYYY-MM-DD') : null;
  params.toDate = queryForm.toDate ? queryForm.toDate.format('YYYY-MM-DD') : null;
  return axios.request({
    url: operUrl,
    method: 'get',
    params,
  });
};

/**
 * @description 获取运维档案数据
 */
export const getTaskImformation = id => axios.request({
  url: `${operUrl}/${id}`,
  method: 'get',
});

/**
 * @description 获取任务报告数据
 */
export const getTaskExport = id => axios.request({
  url: `${exportUrl}/${id}`,
  method: 'get',
});
