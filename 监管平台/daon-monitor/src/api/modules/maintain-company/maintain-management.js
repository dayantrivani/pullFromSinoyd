import { merge } from 'lodash';
import axios from '@/libs/api-request';
/**
 * @description 事项登记
 */

// 模块接口地址
const modeUrl = '/api/monitor/corporation';

// 查询条件
export const emptyQuery = () => ({
  name: '',
  page: 1,
  rows: 10,
});

// 表单对象
export const emptyForm = () => ({
  name: '',                 // 企业名称
  uscc: '',           // 社会信用代码
  contactName: '',          // 联系人
  contactPhone: '',         // 联系电话
});

/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  // const params = merge(emptyQuery(), queryForm);
  const params = merge({}, queryForm);
  // params.year = params.year ? params.year.format('l').slice(0, 4) : '';
  return axios.request({
    url: modeUrl,
    method: 'get',
    params,
  });
};

/**
 * @description 删除
 */
export const remove = (arr = []) => axios.request({
  url: modeUrl,
  method: 'delete',
  data: [...arr],
});

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
 * @description 文件上传
 */
export const uploadFile = formatData => axios.request({
  url: '/api/monitor/corporation/import',
  method: 'post',
  data: formatData,
});

/**
 * @description 导出文件
 */
export const exportFile = () => axios.request({
  url: '/api/monitor/corporation/export',
  method: 'get',
  responseType: 'blob',
});
