import { merge } from 'lodash';
import moment from 'moment';
import axios from '@/libs/api-request';
/**
 * @description 运维监管排名明细
 */

// 模块接口地址
const modeUrl = '/api/monitor/corp-year-points';

const formUrl = '/api/monitor/corp-year-points/pie-chart';

const autoUrl = '/api/monitor/corp-year-points/pie-chart/auto-points';

const diyUrl = '/api/monitor/corp-year-points/pie-chart/diy-points';


// 查询条件
export const emptyQuery = () => ({
  year: moment().endOf('year'),
  key: '',
  page: 1,
  rows: 10,
});

// 查询条件
export const emptyFormQuery = () => ({
  year: moment().endOf('year'),
  index: 1,
  // page: 1,
  // rows: 100000,
});


/**
 * @description 获取列表
 */
export const getList = (queryForm) => {
  const params = {
    key: queryForm.key,
    page: queryForm.page,
    rows: queryForm.rows,
  };
  const year = queryForm.year ? queryForm.year.format('l').slice(0, 4) : '';
  return axios.request({
    url: `${modeUrl}${year ? `/${year}` : ''}`,
    method: 'get',
    params,
  });
};

export const getFormList = (queryForm, id) => {
  const params = merge({}, queryForm);
  params.year = params.year ? params.year.format('l').slice(0, 4) : '';
  return axios.request({
    url: `${formUrl}/${id}`,
    method: 'get',
    params,
  });
};

/**
 * @description 自动扣分列表
 */
// export const getAuto = data => axios.request({
//   url: `${autoUrl}`,
//   method: 'get',
//   params: {
//     ids: data.join(','),
//     // rows: 100000,
//     page: 1,
//     rows: 10,
//   },
// });
export const getAuto = (queryForm, corpId) => {
  const params = merge({}, queryForm);
  return axios.request({
    url: `${autoUrl}/${corpId}`,
    method: 'get',
    params,
  });
};

/**
 * @description 重大事项列表
 */
// export const getDiy = data => axios.request({
//   url: `${diyUrl}`,
//   method: 'get',
//   params: {
//     ids: data.join(','),
//     rows: 100000,
//   },
// });
export const getDiy = (queryForm, corpId) => {
  const params = merge({}, queryForm);
  return axios.request({
    url: `${diyUrl}/${corpId}`,
    method: 'get',
    params,
  });
};

/**
 * @description 得分明细列表
 */
export const getScoringDetails = params => axios.request({
  url: `/api/monitor/corp-year-points/port/${params.portId}`,
  method: 'get',
  params: {
    portMn: params.portMn,
    index: params.index,
    year: params.year,
    // companyId: params.companyId,
    companyId: params.corpId,
    rows: 100000,
  },
});

/**
 * @description 获取明细详情
 */
export const getStationDetail = id => axios.request({
  url: `/api/monitor/corp-auto-point-detail/${id}`,
  method: 'get',
});
