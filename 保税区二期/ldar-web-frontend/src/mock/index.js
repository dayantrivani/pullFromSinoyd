/* eslint-disable */

import Mock from 'mockjs';

// import auth from './modules/auth';
// import sysUsers from './modules/sys/users';

// 响应时间设置
Mock.setup({ timeout: '100-1000' });

Mock.mockAll = (url, response) => {
  Mock.mock(url, 'get', response.queryList);
  Mock.mock(url, 'post', response.createItem);
  Mock.mock(url, 'put', response.updateItem);
  Mock.mock(url, 'delete', response.deleteItem);
};

/* auth 权限控制
-------------------------- */
// Mock.mock(/auth\/jwt\/token/, 'post', auth);

/* sys 系统管理
-------------------------- */
// Mock.mock(/sys\/users/, 'get', sysUsers);
