// import { merge } from 'lodash';
import axios from '@/libs/api-request';
/**
 * @description 专题图
 */

/**
 * @description 监察统计情况 - 监察任务统计
 */
export const getStatisticsType = () => axios.request({
  url: '/api/monitor/alarm-supervision-statistics/type',
  method: 'get',
});

/**
 * @description 监察统计情况 - 近期督查趋势
 */
export const getStatisticsTrend = () => axios.request({
  url: '/api/monitor/alarm-supervision-statistics/trend',
  method: 'get',
});

/**
 * @description 污染源情况 - 重点污染源占比
 */
export const getEmphasis = () => axios.request({
  url: '/api/monitor/company-statistics/emphasis',
  method: 'get',
});

/**
 * @description 监察统计情况 - 污染源点位占比
 */
export const getCompanyType = () => axios.request({
  url: '/api/monitor/company-statistics/type',
  method: 'get',
});

/**
 * @description 运维排名
 */
export const getRank = () => axios.request({
  url: '/api/monitor/patent-map/period-points',
  method: 'get',
});

/**
 * @description 运维概况 - 运维情况统计
 */
export const getOperaConditions = () => axios.request({
  url: '/api/monitor/patent-map/each-corp',
  method: 'get',
});

/**
 * @description 运维概况 - 运维任务统计
 */
export const getOperaTasks = () => axios.request({
  url: '/api/monitor/patent-map/task-info',
  method: 'get',
});

/**
 * @description 地图 - 点位
 */
export const getPoint = name => axios.request({
  url: '/api/monitor/om-station',
  method: 'get',
  params: {
    rows: 2147483647,
    name,
    isEnabled: true,
  },
});

/**
 * @description 地图 - 点位
 */
export const getFactor = id => axios.request({
  url: `/api/monitor/om-station/${id}`,
  method: 'get',
});
