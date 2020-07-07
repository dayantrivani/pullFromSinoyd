/* eslint-disable */

import Mock from 'mockjs';

import auth from './modules/auth';
import list from './modules/api/list';
import sysUsers from './modules/sys/users';
import apiPerson from './modules/api/person';
import apiPersonWorkResume from './modules/api/personWorkResume';
import apiDynamicParam from './modules/api/dynamicParam';
import apiSelectPane from './modules/api/selectPane';

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
Mock.mock(/auth\/jwt\/token/, 'post', auth);

/* sys 系统管理
-------------------------- */
Mock.mock(/sys\/users/, 'get', sysUsers);

// 实验室管理 - 人员管理
// Mock.mockAll(/api\/person/, apiPerson);
// Mock.mockAll(/api\/personWorkResume/, apiPersonWorkResume);

// 表单 - 动态参数显示
Mock.mock(/getTableData/, 'get', apiDynamicParam.getTableData);
Mock.mock(/getFormData/, 'get', apiDynamicParam.getFormData);

// 单步调试
Mock.mock(/getDebugData/, 'get', list.stopDebug);

// 综合案例 - 测试管理
// Mock.mock(/test/, 'get', list.TestProject);

// 动态树
// Mock.mock(/api\/operateTree/, 'get', list.operateTree);

// // 表格 - 项目进度条
Mock.mock(/api\/ProjectPmgressbar/, 'get', list.ProjectPmgressbar);

// // // 布局 - 拖拽与检索数据
// Mock.mock(/api\/dragSearchData/, 'get', list.DragSearchData);

// // // 布局 - 分块收缩
Mock.mock(/api\/BlockShrink/, 'get', list.rulesDemo);

// // // 窗格选择器
Mock.mock(/api\/selectPane/, 'get', apiSelectPane);
