import { merge } from 'lodash';
import moment from 'moment';
import axios from '@/libs/api-request';

/**
 * @description 废水数据查询
 */

// 模块接口地址
const modeUrl = '/api/monitor/point-data';

// 查询条件
export const emptyQuery = (dateRange = 1, type = 'hours') => ({
  uscc: '',                                                 // 社会信用代码
  beginTime: type === 'hours' ? moment().subtract(dateRange, type) : moment().startOf('day').subtract(dateRange, type), // 起始日期
  endTime: type === 'hours' ? moment() :  moment().endOf('day'),                         // 终止日期
  type: 'R',                                                // 类型
});

export const emptyQueryCompany = () => ({
  name: '',
  page: 1,
  rows: 10,
});


/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  // const params = merge(emptyQuery(), queryForm);
  const params = merge({}, queryForm);
  // params.beginTime = params.beginTime ? params.beginTime.format('YYYY-MM-DD') : '';
  // params.endTime = params.endTime ? params.endTime.format('YYYY-MM-DD') : '';
  params.beginTime = params.beginTime ? params.beginTime.valueOf().toString().substring(0, 10) : '';
  params.endTime = params.endTime ? params.endTime.valueOf().toString().substring(0, 10) : '';
  params.time = `${params.beginTime}-${params.endTime}`;
  return axios.request({
    url: modeUrl,
    method: 'get',
    // params,
    params: {
      uscc: params.uscc,
      time: params.time,
      type: params.type,
    },
  });
};

/**
 * @description 选择机构
 */
export const getCompany = (queryForm) => {
  const params = merge({}, queryForm);
  return axios.request({
    url: '/api/monitor/company',
    method: 'get',
    params,
  });
};
