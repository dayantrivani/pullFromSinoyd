import { merge } from 'lodash';
import axios from '@/libs/api-request';
/**
 * @description 企业管理
 */

// 模块接口地址
const modeUrl = '/api/monitor/company';

// 查询条件
export const emptyQuery = () => ({
  name: '',                 // 关键字
  page: 1,
  rows: 10,
});

// 表单对象
export const emptyForm = () => ({
  name: '',                 // 企业名称：
  creditCode: '',           // 社会信用代码：
  // townId: '',
  // industryId: '',           // 行业：
  corporation: '',          // 企业法人：
  attentionLevel: '',       // 关注程度：
  establishedDate: '',      // 成立日期：
  openedDate: '',           // 开业日期：
  contactName: '',          // 联系人：
  contactPhone: '',         // 联系电话：
  fax: '',                  // 传真：
  email: '',                // 邮件：
  floorArea: '',            // 占地面积：
  staffNum: '',             // 员工人数：
  glng: '',                 // 经度：
  glat: '',                 // 纬度：
  address: '',              // 地址：
  isOperation: '',          // 是否聘用专业运维公司
});

/**
 * @description 获取列表
 */
export const getCompanyList = (queryForm) => {
  // const params = merge(emptyQuery(), queryForm);
  const params = merge({}, queryForm);
  return axios.request({
    url: modeUrl,
    method: 'get',
    params,
  });
};

/**
 * @description 获取单条记录
 */
export const getOne = id => axios.request({
  url: `${modeUrl}/${id}`,
  method: 'get',
});

/**
 * @description 保存
 */
export const save = (data, row) => axios.request({
  url: row.id ? `${modeUrl}/${row.id}` : `${modeUrl}`,
  method: row.id ? 'put' : 'post',
  data,
});

/**
 * @description 新增记录
 */
export const create = (data, row) => save(data, row);

/**
 * @description 更新记录
 */
export const update = (data, row) => save(data, row);

/**
 * @description 删除
 */
export const remove = (arr = []) => axios.request({
  url: '/api/monitor/company',
  method: 'delete',
  data: [...arr],
});

/**
 * @description 获取行业
 */
export const getIndustry = () => axios.request({
  url: '/api/monitor/sys/constant/lazy/1',
  method: 'get',
});


/**
 * @description 获取地域
 */
export const getDistrict = () => axios.request({
  url: '/api/monitor/sys/region/auth',
  method: 'get',
});

/**
 * @description 获取当前区
 */
export const getCurrentDistrict = () => axios.request({
  url: '/api/monitor/firm/auth',
  method: 'get',
});

/**
 * @description 头像上传
 */
export const uploadAvatar = formatData => axios.request({
  url: '/api/monitor/image/upload',
  method: 'post',
  data: formatData,
});

/**
 * @description 文件上传
 */
export const uploadFile = formatData => axios.request({
  url: '/api/monitor/company/import',
  method: 'post',
  data: formatData,
});

/**
 * @description 验证社会信用代码
 */
export const checkCode = code => axios.request({
  url: '/api/monitor/company/creditCode',
  method: 'get',
  params: {
    creditCode: code,
  },
});

/**
 * @description 关联关系
 */
export const relate = code => axios.request({
  url: `/api/monitor/firm-company/${code}`,
  method: 'post',
});

/**
 * @description 导出文件
 */
export const exportFile = () => axios.request({
  url: '/api/monitor/company/export',
  method: 'get',
  responseType: 'blob',
});

/**
 * @description 获取区域数据
 */
export const getArea = id => axios.request({
  url: `/api/monitor/sys/region/lazy/${id}`,
  method: 'get',
});

/**
 * @description 获取企业站点
 */
export const getStation = companyId => axios.request({
  url: `/api/monitor/om-station/v1?companyId=${companyId}`,
  method: 'get',
});

/**
 * @description 获取站点详情
 */
export const getStationDetail = id => axios.request({
  url: `/api/monitor/om-station/v1/${id}`,
  method: 'get',
});

/**
 * @description 获取站点仪器
 */
export const getInstru = stationId => axios.request({
  url: `/api/monitor/om-instrument?stationId=${stationId}`,
  method: 'get',
});

/**
 * @description 删除站点
 */
export const deleteStation = arr => axios.request({
  url: '/api/monitor/om-station/v1',
  method: 'delete',
  data: [...arr],
});

/**
 * @description 获取运维单位
 */
export const getUnits = () => axios.request({
  url: '/api/monitor/corporation',
  method: 'get',
  params: {
    rows: 1000,
  },
});

/**
 * @description 新增或编辑站点
 */
export const saveStation = (data, id = '') => axios.request({
  url: `/api/monitor/om-station/v1${id ? `/${id}` : ''}`,
  method: id ? 'put' : 'post',
  data,
});

/**
 * @description 导入站点
 */
export const uploadStation = formatData => axios.request({
  url: '/api/monitor/om-station/v1/import',
  method: 'post',
  data: formatData,
});

/**
 * @description 导入仪器
 */
export const uploadInstru = formatData => axios.request({
  url: '/api/monitor/om-instrument/import',
  method: 'post',
  data: formatData,
});

/**
 * @description 新增或编辑仪器
 */
export const saveInstru = (data, id = '') => axios.request({
  url: `/api/monitor/om-instrument${id ? `/${id}` : ''}`,
  method: id ? 'put' : 'post',
  data,
});

/**
 * @description 获取仪器详情
 */
export const getInsDetail = id => axios.request({
  url: `/api/monitor/om-instrument/${id}`,
  method: 'get',
});

/**
 * @description 删除仪器
 */
export const deleteInsu = arr => axios.request({
  url: '/api/monitor/om-instrument',
  method: 'delete',
  data: [...arr],
});

/**
 * @description 上传模板
 */
export const uploadTemplate = (type, formatData) => axios.request({
  url: `/api/monitor/attach/${type}/upload`,
  method: 'post',
  data: formatData,
});

/**
 * @description 上传模板
 */
export const downTemplate = type => axios.request({
  url: `/api/monitor/attach/${type}/download`,
  method: 'get',
  // responseType: 'blob',
});
