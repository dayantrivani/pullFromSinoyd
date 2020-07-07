import { merge } from 'lodash';
import moment from 'moment';
import axios from '@/libs/api-request';
import { getSessionStorage } from '@/libs/tools';

/**
 * @description 报警数据查询
 */

// 模块接口地址
const modeUrl = '/api/monitor/alarm-data';

// 查询条件
export const emptyQuery = (dateRange = 2, type = 'days') => ({
  fromDate: moment().startOf('day').subtract(dateRange, type), // 起始日期
  endDate: moment().endOf('day'),                              // 终止日期
  type: 'HO',                                                     // 类型
  uscc: getSessionStorage('CHOOSECOM').creditCode,               // 社会信用代码
});


/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  let fromDate;
  let endDate;
  if (params.type === 'HO') {
    fromDate = params.fromDate.format('YYYY-MM-DD HH:mm:ss');
    endDate = params.endDate.format('YYYY-MM-DD HH:mm:ss');
  } else {
    fromDate = params.fromDate.format('YYYY-MM-DD');
    endDate = params.endDate.format('YYYY-MM-DD');
  }
  return axios.request({
    url: modeUrl,
    method: 'get',
    // params,
    params: {
      fromDate,
      endDate,
      type: params.type,
      uscc: params.uscc,
    },
  });
};
