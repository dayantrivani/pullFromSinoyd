import { merge } from 'lodash';
import axios from '@/libs/api-request';
/**
 * @description 企业申报
 */

// 模块接口地址
const modeUrl = '/api/monitor/qyt-report';

// 查询条件
export const emptyQuery = () => ({
  fromDate: '',
  toDate: '',
  runStatus: undefined,
  status: undefined,
  name: '',                 // 关键字
  page: 1,
  rows: 10,
});

/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  params.fromDate = params.fromDate ? params.fromDate.format('YYYY-MM-DD') : '';
  params.toDate = params.toDate ? params.toDate.format('YYYY-MM-DD') : '';
  return axios.request({
    url: modeUrl,
    method: 'get',
    params,
  });
};

/**
 * @description 获取单条
 */
export const getOne = id => axios.request({
  url: `${modeUrl}/${id}`,
  method: 'get',
});

/**
 * @description 审核
 */
export const check = (auditData, row) => axios.request({
  url: `/api/monitor/qyt-report/${row.id}/verifing`,
  method: 'post',
  data: auditData,
});
