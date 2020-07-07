import axios from '@/libs/axios';

/**
 * @deprecated 获取区域列表
 */
// eslint-disable-next-line import/prefer-default-export
export const getAreaList = (node) => {
  const { level, data } = node;
  return axios.request({
    url: `sys/areas/list/${level ? data.id : '0'}`,
    method: 'get',
    transformResponse: [(jsonData) => {
      const response = JSON.parse(jsonData);
      if (response.success && response.data) {
        response.data = response.data.map(v => ({
          id: v.id,
          value: v.areaCode,
          label: v.areaName,
          leaf: level >= 2,
        }));
      }
      return response;
    }],
  });
};
