import axios from '@/libs/axios';
import { getDay } from '@/libs/tools';

/**
 * @description 项目进度相关API
 */

// 查询表单对象
export const emptyQuery = () => ({
  startTime: getDay(-180, true),  // 登记开始日期
  endTime: getDay(0, true),       // 登记结束日期
  leaderId: '',                   // 项目负责人
  projectTypeId: '',              // 项目类型
  projectStatus: '',              // 项目状态
  key: '',                        // 关键字（项目编号、项目名称、样品编号、委托单位）
  module: 'inquiry',              // 模块
  sort: 'inputTime-',             // 排序
});


/**
 * @description 获取项目列表
 * @param {object} params 查询参数
 */
export const getProjectList = params => axios.request({
  url: 'pro/project',
  method: 'get',
  params,
});

/**
 * @description 删除项目
 * @param {string} projectId 项目ID
 */
export const removeProject = ids => axios.request({
  url: 'pro/project',
  method: 'delete',
  data: ids,
});

/**
 * @description 办结项目
 * @param {string} projectId 项目ID
 */
export const finishProject = ids => axios.request({
  url: 'pro/project/finish',
  method: 'post',
  data: { ids },
});
