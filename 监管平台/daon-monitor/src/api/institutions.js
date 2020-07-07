// import crypto from 'crypto-js';
// import config from '@/config';
// eslint-disable-next-line import/no-cycle
import axios from '@/libs/api-request';

// 新建机构
const urls = {
  // // 获取平台
  // getPlatform: '/api/monitor/permission/client',
  // 加入机构地址
  getJoin: '/api/monitor/admission',
  // 获取申请加入记录和新建机构记录
  getApply: '/api/monitor/firm/apply',
  // 获取区域数据
  getArea: '/api/monitor/sys/region/lazy',
  // 上传头像
  uploadImg: '/api/monitor/image/upload',
  // 新建机构
  addInstitu: '/api/monitor/firm',
  // 获取机构/企业列表
  getList: 'api/monitor/user/auth',
};

// 表单对象
export const emptyForm = () => ({
  name: '',        // 机构名称
  inviteCode: '',  // 邀请码
  address: '',     // 地址
  phone: '',       // 联系电话
  // regulatoryType: '', // 监管类型
  // provinceName: '',
  // cityName: '',
  // districtName: '',
  // provinceId: '',   // 省id
  // cityId: '',       // 市id
  // districtId: '',   // 区id
  email: '',       // 邮件
  pic: '',         // 头像
});

/**
 * @description 获取申请加入记录和新建机构记录
 */
export const getApply = () => axios.request({
  url: urls.getApply,
  method: 'get',
});

/**
 * @description 加入机构
 */
export const getJoin = code => axios.request({
  url: urls.getJoin,
  method: 'post',
  data: {
    idCode: code,
  },
});

/**
 * @description 获取区域数据
 */
export const getArea = id => axios.request({
  url: `${urls.getArea}/${id}`,
  method: 'get',
});

/**
 * @description 加入机构
 */
export const uploadImg = formatData => axios.request({
  url: urls.uploadImg,
  method: 'post',
  data: formatData,
});

/**
 * @description 新建机构保存事件
 */
export const addInstitu = form => axios.request({
  url: urls.addInstitu,
  method: 'post',
  data: form,
});

/**
 * @description 新建机构保存事件
 */
export const getOrgList = () => axios.request({
  url: urls.getList,
  method: 'get',
});
