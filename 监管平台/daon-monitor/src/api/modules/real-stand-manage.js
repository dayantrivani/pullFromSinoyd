import { merge } from 'lodash';
// import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 真实超标管理
 */

// 模块接口地址
const modeUrl = '/api/monitor/real-alarm';

// 保存接口地址
const confirmUrl = '/api/monitor/real-alarm/confirm';

// 查询条件
export const emptyQuery = () => ({
  companyId: undefined,
  stationId: undefined,
  beginDate: null,
  endDate: null,
  // beginDate: moment().endOf('day'),
  // endDate: moment().endOf('day'),
  sort: 'alarmedAt-',
  status: undefined,
  verifyStatus: undefined,
  page: 1,
  rows: 10,
});

// 表单对象
export const emptyForm = () => ({
  verifyRemark: '',          // 信息：
  attachIds: '',           // 附件：
});

/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  params.beginDate = queryForm.beginDate ? queryForm.beginDate.format('YYYY-MM-DD') : '';
  params.endDate = queryForm.endDate ? queryForm.endDate.format('YYYY-MM-DD') : '';
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
  url: `${confirmUrl}/${row.id}`,
  method: 'put',
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
  url: '/api/monitor/real-alarm/export',
  method: 'get',
  params: data,
  responseType: 'blob',
});
