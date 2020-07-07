import { merge } from 'lodash';
// import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 异常督办
 */

// 模块接口地址
const modeUrl = '/api/monitor/alarm-supervision';

// 查询条件
export const emptyQuery = () => ({
  keyword: '',
  // beginDate: moment().startOf('day').subtract(6, 'days'),
  // endDate: moment().startOf('day'),
  beginDate: null,
  endDate: null,
  status: '',
  index: '',
  page: 1,
  rows: 10,
});

export const emptyForm = () => ({
  corpId: '',
  stationId: '',
  stationName: '',
  type: '',
  alarmedAt: '',
  disposeWarningHour: '',
  attention: false,
  message: '',
  supervisorId: 1,
  supervisorName: '监理人名字',
});

export const empty = () => ({
  alarmSupervisionId: 0,
  roleId: 0,
  roleName: '',
  userId: 0,
  userName: '',
  attachIds: [],
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
/**
 * @description 获取表格
 */
export const getTable = (queryForm) => {
  const params = merge({}, queryForm);
  params.beginDate = params.beginDate ? params.beginDate.format('YYYY-MM-DD') : '';
  params.endDate = params.endDate ? params.endDate.format('YYYY-MM-DD') : '';
  return axios.request({
    url: `${modeUrl}/list`,
    method: 'get',
    params,
  });
};

/**
 * @description 获取某条督办的日志
 */
export const getDetail = id => axios.request({
  url: `/api/monitor/alarm-supervision-log/${id}`,
  method: 'get',
});

/**
 * @description 添加日志
 */
export const addAlarmLog = data => axios.request({
  url: '/api/monitor/alarm-supervision-log',
  method: 'post',
  data,
});

/**
 * @description 获取角色
 */
export const getRole = () => axios.request({
  url: '/api/monitor/role',
  method: 'get',
  params: {
    roleGroup: 1,
    rows: 2147483647,
  },
});

/**
 * @description 获取用户
 */
export const getUser = () => axios.request({
  url: '/api/monitor/user',
  method: 'get',
  params: {
    rows: 2147483647,
  },
});

/**
 * @description 切换关注
 */
export const check = (id, data) => axios.request({
  url: `/api/monitor/alarm-supervision/${id}`,
  method: 'put',
  data,
});


/**
 * @description 新建督办任务
 */
export const addTask = data => axios.request({
  url: '/api/monitor/alarm-supervision',
  method: 'post',
  data,
});

/**
 * @description 删除督办任务
 */
export const deleteMask = id => axios.request({
  url: `/api/monitor/alarm-supervision/${id}`,
  method: 'delete',
});

/**
 * @description 更新表单pdf报告
 */
export const resetPdf = id => axios.request({
  url: `/api/monitor/supervision_task/report/${id}`,
  method: 'post',
});
