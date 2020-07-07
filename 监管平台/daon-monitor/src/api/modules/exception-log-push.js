import { merge } from 'lodash';
import axios from '@/libs/api-request';
/**
 * @description 异常日志推送
 */

// 模块接口地址
const modeUrl = '/api/monitor/alarm-log';

// 查询条件
export const emptyQuery = () => ({
  beginDate: '',
  endDate: '',
  status: '',
  content: '',
  page: 1,
  rows: 10,
});

/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  params.beginDate = params.beginDate ? params.beginDate.format('YYYY-MM-DD') : '';
  params.endDate = params.endDate ? params.endDate.format('YYYY-MM-DD') : '';
  return axios.request({
    url: modeUrl,
    method: 'get',
    params,
  });
};
