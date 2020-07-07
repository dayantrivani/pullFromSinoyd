// import { merge } from 'lodash';
import axios from '@/libs/api-request';
/**
 * @description 监控中心
 */

/**
 * @description 统计监理人数,待办任务及超期任务数
 */
export const getStatistics = () => axios.request({
  url: '/api/monitor/supervision-home/statistics',
  method: 'get',
});

/**
 * @description 展示15天内任务分布
 */
export const getTasks = () => axios.request({
  url: '/api/monitor/supervision-home/tasks',
  method: 'get',
});

/**
 * @description 企业督办排名
 */
export const getDistribution = () => axios.request({
  url: '/api/monitor/supervision-home/distribution',
  method: 'get',
});

/**
 * @description 最新动态
 */
export const getMessage = () => axios.request({
  url: '/api/monitor/supervision-home/message',
  method: 'get',
});

/**
 * @description 签到查询
 */
export const getCheck = () => axios.request({
  url: '/api/monitor/supervision-home/sign-check',
  method: 'get',
});

/**
 * @description 签到
 */
export const getSign = type => axios.request({
  url: `/api/monitor/supervision-home/sign?type=${type}`,
  method: 'post',
  // data: {
  //   type,
  // },
});

/**
 * @description 签到人员查询
 */
export const getSignUsers = params => axios.request({
  url: '/api/monitor/supervision-home/sign-user',
  method: 'get',
  params,
});
