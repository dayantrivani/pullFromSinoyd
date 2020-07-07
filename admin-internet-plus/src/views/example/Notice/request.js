import { merge } from 'lodash';
import axios from '@/libs/axios';
import { getDay } from '@/libs/tools';

/**
 * @deprecated 公告接口定义
 */

//  空表单对象
export const emptyQuery = (params = {}) => merge({
  timeStart: getDay(-180),  // 开始日期
  timeEnd: getDay(0),       // 结束日期
  noticeType: '',           // 公告类型
  noticeLabel: '',          // 公告标签
  key: '',                  // 关键字
  isRelease: true,
  sort: 'isTop-,releaseTime-',
}, params);

//  空表单对象
export const emptyForm = (params = {}) => merge({
  title: '',        // 标题
  content: '',      // 描述
  category: '',     // 分类
  releaseId: '',    // 发布人
  isRelease: true,  // 是否发布
  isTop: 0,         // 是否置顶
  labelArray: [],   // 标签数组
}, params);

/**
 * @description 获取公告列表
 */
export const getNoticeList = (form = {}) => axios.request({
  url: 'lim/notice',
  method: 'get',
  params: emptyQuery(form),
});

/**
 * @description 保存报告
 */
export const saveNotice = (data) => axios.request({
  url: 'lim/notice',
  method: data.id ? 'put' : 'post',
  data,
});
