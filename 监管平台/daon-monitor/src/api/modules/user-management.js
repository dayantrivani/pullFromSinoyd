import { merge } from 'lodash';
import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 用户管理
 */

// 模块接口地址
const modeUrl = '/api/monitor/user';

// 查询条件
export const emptyQuery = () => ({
  key: '',                 // 关键字
  mobile: '',              // 手机号
  page: 1,
  rows: 10,
});

// 历史记录查询条件
export const historyQuery = () => ({
  flag: 1,
  beginDate: moment().startOf('day').subtract(1, 'months'),
  endDate: moment().startOf('day'),
  page: 1,
  rows: 10,
});

// 表单对象
export const emptyForm = () => ({});

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
 * @description 获取列表
 */
export const getHistoryList = (queryForm) => {
  const params = merge({}, queryForm);
  params.beginDate = params.beginDate ? params.beginDate.startOf('day').format('YYYY-MM-DD HH:mm:ss') : '';
  params.endDate = params.endDate ? params.endDate.startOf('day').format('YYYY-MM-DD HH:mm:ss') : '';
  return axios.request({
    url: '/api/monitor/admission',
    method: 'get',
    params,
  });
};

/**
 * @description 获取机构代码
 */
export const getCode = () => axios.request({
  url: '/api/monitor/firm/auth',
  method: 'get',
});

/**
 * @description 获取申请记录
 */
export const getApply = () => axios.request({
  url: '/api/monitor/admission',
  method: 'get',
});

/**
 * @description 获取角色
 */
export const getRole = id => axios.request({
  url: `/api/monitor/user/user-role/${id}`,
  method: 'get',
});

/**
 * @description 获取所有权限
 */
export const getAllAuthority = () => axios.request({
  url: '/api/monitor/permission/menu?cId=3',
  method: 'get',
});

/**
 * @description 获取用户权限
 */
export const getAuthority = row => axios.request({
  url: `/api/monitor/user/user-permission/${row.id}`,
  method: 'get',
});

/**
 * @description 保存角色配置
 */
export const saveRole = (row, checkList) => axios.request({
  url: `/api/monitor/user/user-role/${row.id}`,
  method: 'post',
  data: checkList,
});

/**
 * @description 审核申请
 */
export const revlicate = (id, status) => axios.request({
  url: `/api/monitor/admission/${id}`,
  method: 'put',
  data: {
    status,
  },
});
