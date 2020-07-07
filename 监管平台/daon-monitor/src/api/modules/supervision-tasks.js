import { merge } from 'lodash';
// import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 超标通告单
 */

// 模块接口地址
const modeUrl = '/api/monitor/supervision_task';

// 查询条件
export const emptyQuery = () => ({
  key: '',                 // 关键字
  type: undefined,         // 任务类型
  beginDate: null,         // 开始时间
  endDate: null,           // 结束时间
  status: undefined,       // 任务状态
  isOver: undefined,     // 是否超标
  page: 1,
  rows: 10,
});

// 表单对象
export const emptyForm = () => ({
  companyId: undefined,     // 企业名称
  stationId: undefined,   // 站点名称
  type: undefined,          // 任务类型
  supervisionTaskItems: [],             // 表单名称
  isOver: undefined,         // 是否超标
  remark: '',               // 任务说明
});

/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = merge({}, queryForm);
  params.beginDate = queryForm.beginDate ? queryForm.beginDate.format('YYYY-MM-DD') : null;
  params.endDate = queryForm.endDate ? queryForm.endDate.format('YYYY-MM-DD') : null;
  // params.queryDate = queryForm.queryDate ? queryForm.queryDate.format('YYYY-MM-DD') : null;
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
  url: `/api/monitor/supervision_task/replace/${id}`,
  method: 'get',
});

/**
 * @description 获取企业列表
 */
export const getCompanyList = () => axios.request({
  url: '/api/monitor/company',
  method: 'get',
  params: {
    page: 1,
    rows: 2147483647,
  },
});

/**
 * @description 获取企业点位信息
 */
export const getStation = id => axios.request({
  url: '/api/monitor/om-station/v1',
  method: 'get',
  params: {
    companyId: id,
  },
});

/**
 * @description 获取表单信息
 */
export const getForm = () => axios.request({
  url: '/api/monitor/form',
  method: 'get',
  params: {
    page: 1,
    rows: 2147483647,
  },
});

/**
 * @description 保存
 */
export const save = data => axios.request({
  url: 'api/monitor/supervision_task',
  method: 'post',
  data,
});

/**
 * @description 查看报警详情
 */
export const getAlarm = id => axios.request({
  url: `api/monitor/supervision_task/alarm/${id}`,
  method: 'get',
});

/**
 * @description 任务退回
 */
export const backTask = (data, id) => axios.request({
  url: `${modeUrl}/task_return/${id}`,
  method: 'put',
  data: {
    reason: data,
  },
});

/**
 * @description 任务关闭
 */
export const closeTask = (data, id) => axios.request({
  url: `${modeUrl}/task_close/${id}`,
  method: 'put',
  data: {
    reason: data,
  },
});

/**
 * @description 获取附件信息
 */
export const getFiles = ids => axios.request({
  url: '/api/monitor/app/supervision/attach-ids',
  method: 'get',
  params: {
    attachIds: ids,
  },
});
