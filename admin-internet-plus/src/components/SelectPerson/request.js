import { merge } from 'lodash';
import axios from '@/libs/axios';


/**
 * @deprecated 获取用户列表
 */
export const getUserList = () => axios.request({
  url: 'sys/user',
  method: 'get',
});


/**
 * @deprecated 获取人员列表
 * @param {string} data.permission  // 角色
 * @param {string} data.isUser      // 是否可登录用户
 * @param {string} data.status      // 状态 1: 在职, 2: 离职, 3: 休假
 */
export const getUserPerson = (form = {}) => axios.request({
  url: 'lim/person/query',
  method: 'post',
  data: merge({
    permission: [],
    isUser: true,
    status: [1, 3],
  }, form),
  transformResponse: [(jsonData) => {
    const response = JSON.parse(jsonData);
    if (response.success && response.data) {
      response.data = response.data.map(v => ({ id: v.value, userName: v.key }));
    }
    return response;
  }],
});
