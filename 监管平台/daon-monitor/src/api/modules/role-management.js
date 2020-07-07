import { merge } from 'lodash';
import axios from '@/libs/api-request';
/**
 * @description 角色管理
 */

// 模块接口地址
const modeUrl = '/api/monitor/role';

// 查询条件
export const emptyQuery = () => ({
  roleGroup: 1,                 // 关键字
  page: 1,
  rows: 10,
});

// 用户列表查询条件
export const userQuery = () => ({
  // roleId: '',
  page: 1,
  // rows: 10,
  rows: 10000,
});

/**
 * @description 表单
 */
export const emptyForm = () => ({
  roleName: '',
  roleCode: '',
  roleGroup: 1,
});


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
 * @description 获取单条记录
 */
export const getOne = id => axios.request({
  url: `${modeUrl}/${id}`,
  method: 'get',
});

/**
 * @description 获取当前角色下已配置用户列表
 */
export const getCurrentUsers = (queryForm) => {
  const params = merge({}, queryForm);
  return axios.request({
    url: '/api/monitor/role/role-user',
    method: 'get',
    params,
  });
};

/**
 * @description 获取当前角色下未配置用户列表
 */
export const getAllUsers = (queryForm) => {
  const params = merge({}, queryForm);
  return axios.request({
    url: '/api/monitor/user',
    method: 'get',
    params,
  });
};

/**
 * @description 获取当前角色下用户列表
 */
export const getConfigUsers = (roleId = '') => axios.request({
  url: `/api/monitor/role/role-user${roleId ? '/' : ''}${roleId}`,
  method: 'get',
  params: {
    page: 1,
    rows: 2147483647,
  },
});

/**
 * @description 保存角色
 */
export const save = (data, row) => axios.request({
  url: row.id ? `${modeUrl}/${row.id}` : `${modeUrl}`,
  method: row.id ? 'put' : 'post',
  data,
});

/**
 * @description 保存权限配置
 */
export const saveAuthority = (data, row) => axios.request({
  url: `/api/monitor/role/role-permission/${row.id}`,
  method: 'post',
  data,
});

/**
 * @description 保存用户配置
 */
export const saveUser = (data, row) => axios.request({
  url: `/api/monitor/role/role-user/${row.id}`,
  method: 'post',
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
 * @description 删除角色
 */
export const remove = (arr = []) => axios.request({
  url: modeUrl,
  method: 'delete',
  data: [...arr],
});

/**
 * @description 删除用户
 */
export const removeUser = (arr = [], row) => axios.request({
  url: `/api/monitor/role/role-user/${row.id}`,
  method: 'delete',
  data: [...arr],
});

/**
 * @description 获取平台导航菜单
 */
export const getMenu = roleId => axios.request({
  url: `/api/monitor/role/role-permission/${roleId}`,
  method: 'get',
});
