import { merge } from 'lodash';
// import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 通知公告
 */

// 模块接口地址
const modeUrl = '/api/monitor/notice';
const uploadUrl = '/api/monitor/attach/upload';

// 查询条件
export const emptyQuery = () => ({
  // fromDate: moment().startOf('day').subtract(6, 'days'),     // 起始日期
  fromDate: '',
  // toDate: moment().endOf('day'),       // 终止日期
  toDate: '',
  keyword: '',           // 关键字
  status: '',           // 状态
  page: 1,
  rows: 10,
});

export const emptyForm = () => ({
  title: '',
  status: 1,
  isTop: false,
  tagList: [],
  content: '',
  attachIds: [],
});

/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  // const params = merge(emptyQuery(), queryForm);
  const params = merge({}, queryForm);
  params.fromDate = params.fromDate ? params.fromDate.format('YYYY-MM-DD') : '';
  params.toDate = params.toDate ? params.toDate.format('YYYY-MM-DD') : '';
  return axios.request({
    url: modeUrl,
    method: 'get',
    params,
  });
};

/**
 * @description 获取单条数据
 */
export const getOne = id => axios.request({
  url: `${modeUrl}/${id}`,
  method: 'get',
});

/**
 * @description 保存记录
 */
export const save = (data, row) => axios.request({
  url: row.id ? `${modeUrl}/${row.id}` : modeUrl,
  method: row.id ? 'put' : 'post',
  data,
});

/**
 * @description 删除记录
 */
export const remove = (arr = []) => axios.request({
  url: modeUrl,
  method: 'delete',
  data: [...arr],
});

/**
 * @description 发布公告
 */
export const publish = row => axios.request({
  url: `/api/monitor/notice/${row.id}/publishing`,
  method: 'post',
});

/**
 * @description 公告置顶
 */
export const top = row => axios.request({
  url: `/api/monitor/notice/${row.id}/top`,
  method: 'post',
  data: {
    isTop: row.isTop ? 0 : 1,
  },
});

/**
 * @description 新增记录
 */
export const create = (data, row) => save(data, row);

/**
 * @description 更新记录
 */
export const update = (data, row) => save(data, row);

// /**
//  * @description 上传附件
//  */
// export const upload = formatData => axios.request({
//   url: uploadUrl,
//   method: 'post',
//   data: formatData,
// });

/**
 * @description 富文本上传图片地址
 */
export const uploadEdit = formatData => axios.request({
  url: uploadUrl,
  method: 'post',
  data: formatData,
});

// /**
//  * @description 下载附件
//  */
// export const download = id => axios.request({
//   url: `api/monitor/attach/download/${id}`,
//   method: 'get',
//   responseType: 'blob',
// });
