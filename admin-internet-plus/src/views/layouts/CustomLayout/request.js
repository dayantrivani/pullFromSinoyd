import axios from '@/libs/axios';
import store from '@/store';

/**
 * @deprecated 系统框架接口
 */


/**
 * @deprecated 获取运维统计
 * @param {string} params
 */
export const getOmStatistics = (moduleCode) => axios.request({
  url: 'pro/home/project',
  method: 'get',
  params: {
    userId: store.getters['auth/userGuid'],
    moduleCode,
  },
});

/**
 * @deprecated 获取重点项目
 * @param {string} params
 */
export const getKeyProject = () => axios.request({
  url: 'pro/home/keyProject',
  method: 'get',
});
