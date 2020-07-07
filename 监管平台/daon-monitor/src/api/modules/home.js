import axios from '@/libs/api-request';

/**
 * @description 运维任务地址
 */
export const getList = params => axios.request({
  url: '/api/monitor/corp-task/list',
  method: 'get',
  params,
});

/**
 * @description 任务类型占比
 */
export const getMask = params => axios.request({
  url: '/api/monitor/corp-task/category',
  method: 'get',
  params,
});

/**
 * @description 超限任务列表
 */
export const getMaskList = params => axios.request({
  url: '/api/monitor/corp-task/overrun',
  method: 'get',
  params,
});

/**
 * @description 首页概况
 */
export const getHome = params => axios.request({
  url: '/api/monitor/om-homepage/survey',
  method: 'get',
  params,
});

/**
 * @description 运维概况
 */
export const getCory = corpUscc => axios.request({
  url: '/api/monitor/om-homepage/each-corp',
  method: 'get',
  params: {
    corpUscc,
  },
});

/**
 * @description 运维企业
 */
export const getOperEnter = () => axios.request({
  url: '/api/monitor/corporation',
  method: 'get',
  params: {
    rows: 2147483647,
  },
});
