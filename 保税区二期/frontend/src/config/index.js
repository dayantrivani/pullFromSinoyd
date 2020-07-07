export default {
  /**
   * @description 应用设置
   * @param {string}  id            唯一标识 ID, 为空则会获取全部导航
   * @param {string}  title         标题
   * @param {number}  cookieExpires token在Cookie中存储的天数，默认1天
   * @param {string}  storage       存储方案: sessionStorage || localStorage
   */
  app: {
    id: '',
    title: '智慧园区环保综合管理平台',
    cookieExpires: 1,
    storage: 'sessionStorage',
  },

  /**
   * Axios 基于 promise 的 HTTP 库
   * version: ^0.18.0
   * docLink: https://www.kancloud.cn/yunye/axios/234845
   * @description 请求库参数配置
   * @param {boolean} repeated    是否拦截重复请求
   * @param {boolean} timeout     指定请求超时的毫秒数(0 表示无超时时间)
   * @param {boolean} queue       是否显示请求进度
   * @param {number} retry        超时后再次请求的次数(0 表示超时后不触发)
   * @param {number} retryDelay   超时后再次请求的间隔(毫秒)
   */
  http: {
    repeated: true,
    timeout: 10000,
    queue: false,
    retry: 1,
    retryDelay: 1000,
  },

  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '/api',
    pro: '/api',
    mock: 'https://easy-mock.com/mock/5cf4d154234cd264c1bf38a6/',
  },

  /**
   * @description api请求基础路径
   * @info 应用编号: 16607282, 应用名称: map-web
   */
  bdMap: {
    use: false,
    ak: 'tn2noM02ttb2mDuHPRSGnYwGHaw8VI1Z',
  },
};
