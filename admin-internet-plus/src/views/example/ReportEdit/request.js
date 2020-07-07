import { merge } from 'lodash';
import axios from '@/libs/axios';
import { getDay } from '@/libs/tools';

/**
 * @deprecated 报告编制接口定义
 */

//  空表单对象
export const emptyQuery = (params = {}) => merge({
  startTime: getDay(-180),  // 开始日期
  endTime: getDay(0),       // 结束日期
  projectTypeId: '',        // 测试项目id
  reportMakerId: '',        // 编制报告人id
  status: 1,                // 状态（ -1所有 1待处理 2已处理）
  key: '',                  // 关键字（项目编号、项目名称、委托方、样品编号、点位名称、报告编号）
  module: 'report',         // 模块名称
  sort: 'inceptTime-',      // 按工作单号倒序排序
}, params);

/**
 * @description 空表单对象
 */
export const emptyForm = (obj = {}) => merge({
  reportYear: `${new Date().getFullYear()}`,  // 报告年份
  reportTypeId: '',                           // 报告类型ID
  reportTypeName: '',                         // 报告类型名称
  projectId: '',                              // 项目ID
  code: '',                                   // 报告编号
  objectType: 1,                              // 固定传1，1.样品 2.断面属性
  objectIds: [],                              // 所选样品的数组，数组不能为空
  reportNum: 0,                               // 报告数量
}, obj);

export const emptyLogForm = () => ({
  objectId: '',           // 对象id 此处为项目id
  objectType: '',         // 对象类型（1.项目 2.我的审批 3.工作单 4.报告）
  commentPersonId: '',    // 当前用户ID
  commentPersonName: '',  // 当前用户名称
  comment: '',            // 评论内容
  commentType: '',        // 评论类型（1.留言、2.日志）
});

/**
 * @description 表单验证规则
 */
export const formRules = {
  reportYear: [
    { required: true, message: '请选择报告年份', trigger: ['blur', 'change'] },
  ],
  reportTypeId: [
    { required: true, message: '请选择报告类型', trigger: ['blur', 'change'] },
  ],
  code: [
    { required: true, message: '请输入报告编号', trigger: ['blur', 'change'] },
  ],
};

/**
 * @description 获取项目列表
 */
export const getProjectList = (formModel) => {
  const params = merge(emptyQuery(), formModel);
  if (!params.status) params.status = -1;
  return axios.request({
    url: 'pro/project',
    method: 'get',
    params,
    transformResponse: [(jsonData) => {
      const data = JSON.parse(jsonData);
      if (data.success && data.data) {
        // eslint-disable-next-line no-param-reassign
        data.data = data.data.map((v) => {
          v.analyzeDetail = v.analyzeDetail || [];
          v.reportDetail = v.reportDetail || [];
          return v;
        });
      }
      return data;
    }],
  });
};

/**
 * @description 获取报告卡片列表
 */
export const getReportList = projectId => axios.request({
  url: 'pro/report',
  method: 'get',
  params: {
    projectId,
    module: 'reportEdit',
    page: 1,
    rows: 100000,
  },
});

/**
 * @description 获取报告编号
 */
export const getReportCode = (reportName, reportYear) => axios.request({
  url: 'pro/report/code',
  method: 'get',
  params: {
    reportName,
    reportYear,
  },
});

/**
 * @description 保存报告
 */
export const saveReport = data => axios.request({
  url: 'pro/report',
  method: data.id ? 'put' : 'post',
  data,
});

/**
 * @description 删除报告
 */
export const removeReport = id => axios.request({
  url: `pro/report/${id}`,
  method: 'delete',
});

/**
 * @deprecated 查询可配置编号列表
 */
export const getSerialList = (queryForm = {}) => {
  const params = Object.assign({
    sort: 'orderNum-',
    page: 1,
    rows: 100000,
  }, queryForm);
  return axios.request({
    url: 'lim/serialIdentifierConfig',
    method: 'get',
    params,
  });
};

/**
 * @description 获取评论列表
 */
export const getCommentList = (objectId, objectType = 1) => axios.request({
  url: 'pro/comment/all',
  method: 'get',
  params: {
    objectId,
    objectType,
  },
});

/**
 * @description 新增评论
 */
export const addComment = formModel => axios.request({
  url: 'pro/comment',
  method: 'post',
  data: merge(emptyForm(), formModel),
});

/**
 * @description 删除评论
 */
export const removeComment = commentId => axios.request({
  url: `pro/comment/${commentId}`,
  method: 'delete',
});
