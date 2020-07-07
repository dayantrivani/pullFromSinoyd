import { merge } from 'lodash';
import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 超标通告单
 */

// 模块接口地址
const modeUrl = '/api/monitor/real-overweight';

// 通知单生成地址
const exportUrl = '/api/monitor/real-alarm/report';

// 查询条件
export const emptyQuery = () => ({
  partnerName: '',                 // 关键字
  queryDate: moment().endOf('day'),
  page: 1,
  rows: 10,
});


/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  params.queryDate = queryForm.queryDate ? queryForm.queryDate.format('YYYY-MM-DD') : null;
  return axios.request({
    url: modeUrl,
    method: 'get',
    params,
  });
};

/**
 * @description 通知单生成
 */
export const getExport = id => axios.request({
  url: `${exportUrl}/${id}`,
  method: 'post',
  responseType: 'blob',
});
