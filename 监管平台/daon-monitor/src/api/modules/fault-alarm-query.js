import { merge } from 'lodash';
// import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 故障报警查询
 */

// 模块接口地址
const modeUrl = '/api/monitor/alarm';

// 查询条件
export const emptyQuery = () => ({
  companyId: undefined,
  stationId: undefined,
  // beginDate: moment().endOf('day'),
  // endDate: moment().endOf('day'),
  sort: 'alarmedAt-',
  beginDate: null,
  endDate: null,
  status: undefined,
  page: 1,
  rows: 10,
});


/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  params.beginDate = queryForm.endDate ? queryForm.beginDate.format('YYYY-MM-DD') : null;
  params.endDate = queryForm.endDate ? queryForm.endDate.format('YYYY-MM-DD') : null;
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
  url: '/api/monitor/company',
  method: 'delete',
  data: [...arr],
});

/**
 * @description 导出文件
 */
export const exportFile = data => axios.request({
  url: '/api/monitor/alarm/export',
  method: 'get',
  params: data,
  responseType: 'blob',
});

/**
 * @description 获取站点
 */
export const getStation = data => axios.request({
  url: '/api/monitor/station',
  method: 'get',
  params: data,
});
