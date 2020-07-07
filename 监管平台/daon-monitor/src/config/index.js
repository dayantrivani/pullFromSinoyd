import { scope, zIndex } from '@/styles/common/variables.scss';

const isPro = process.env.NODE_ENV === 'production';

const config = {
  /**
   * @description 应用设置
   * @param {string}  id            唯一标识 ID, 为空则会获取全部导航
   * @param {string}  icon          图标
   * @param {string}  title         标题
   * @param {string}  home          主页
   * @param {boolean} nest          允许被内嵌(内嵌状态会隐藏顶栏与侧栏)
   * @param {boolean} iframe        启用内嵌导航模式
   * @param {string}  cookieExpires token在Cookie中存储时效: day, hour, minute
   * @param {boolean} storageEncrypt 存储加密
   * @param {number}  viewCacheMax  页面视图缓存上限
   * @param {boolean} moduleUse     启用应用切换
   */
  app: {
    id: '',
    icon: 'icon-logo',
    title: '互联网+监管平台',
    // home: 'WaterDataQuery',
    home: 'home',
    nest: true,
    iframe: false,
    cookieExpires: '5day',
    storageEncrypt: isPro,
    viewCacheMax: 20,
    moduleUse: true,
  },

  /**
   * @description 应用子模块列表
   */
  moduleList: [],

  /**
   * @description 用户个性化配置
   * @priority    用户配置 > 缓存配置 > 默认配置
   * @param {number}  theme           应用主题
   * @param {string}  themeSide       侧栏配色 dark light
   * @param {boolean} headFixed       固定顶栏
   * @param {boolean} headStick       置顶顶栏
   * @param {boolean} headGlideHide   下滑时隐藏顶栏
   * @param {boolean} sideFixed       固定侧边栏
   * @param {boolean} sideBtnShow     显示折叠侧边栏按钮
   * @param {boolean} sideCollapse    侧栏默认折叠状态
   * @param {boolean} sideAccordion   侧边栏开启手风琴模式
   * @param {boolean} crumbsShow      显示全局面包屑导航
   * @param {boolean} crumbsIconShow  全局面包屑显示图标
   * @param {boolean} tagsUse         开启多页签
   * @param {boolean} tagsIconShow    多页签显示图标
   * @param {boolean} tagsLockShow    多页签允许锁定
   * @param {boolean} tagsFixed       固定多页签
   */
  custom: {
    theme: 2,
    themeSide: 'dark',
    headFixed: true,
    headStick: false,
    headGlideHide: false,
    sideFixed: true,
    sideBtnShow: true,
    sideCollapse: true,
    sideAccordion: true,
    crumbsShow: true,
    crumbsIconShow: false,
    tagsUse: true,
    tagsIconShow: false,
    tagsLockShow: true,
    tagsFixed: true,
  },

  /**
   * @description 布局配置(默认配置),
   *              优先级说明: 用户配置 > 缓存配置 > 默认配置
   * @param {number}  space           区块间隔(px)
   * @param {string}  zIndex          固定定位层级
   * @param {boolean}  drawUse        启用右侧抽屉层
   * @param {boolean}  messageUse     启用消息通知
   * @param {boolean}  fullScreenShow 显示屏幕切换按钮
   * @param {boolean}  refreshBtnShow 显示页面刷新按钮
   */
  layout: {
    scope: parseInt(scope, 10),
    zIndex: parseInt(zIndex, 10),
    drawUse: true,
    messageUse: true,
    fullScreenShow: true,
    refreshBtnShow: true,
  },

  /**
   * @description 本地存储信息字段管理
   * @param {string} token    密钥
   * @param {string} custom   个性化配置
   * @param {string} navMenu  导航菜单
   * @param {string} userInfo 用户信息
   * @param {string} remember 保持登录
   */
  localKey: {
    token: 'TOKEN',
    custom: 'APP_CUSTOM',
    navMenu: 'APP_USER_MENU',
    userInfo: 'APP_USER_INFO',
    remember: 'APP_CAN_REFRESH',
    homeLayout: 'APP_HOME_LAYOUT',
  },

  /**
   * @description 分页字段配置
   * @param {string} page   第几页
   * @param {string} rows   显示条数
   * @param {string} total  总记录条数
   */
  pager: {
    page: 'page',
    rows: 'rows',
    total: 'count',
  },

  /**
   * @description 侧栏导航配置
   * @param {string} code 模块字段名
   * @param {string} link 绝对访问地址，用于 iframe 模式
   */
  navbar: {
    rootId: '0',
    id: 'id',
    parentId: 'parentId',
    icon: 'icon',
    label: 'label',
    code: 'moduleCode',
    path: 'moduleUrl',
    children: 'children',
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
    timeout: 0,
    queue: false,
    retry: 0,
    retryDelay: 1000,
  },

  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '',
    pro: '',
    mock: 'https://easy-mock.com/mock/5cf4d154234cd264c1bf38a6/frame/',
  },

  /**
   * @description mock 数据模拟
   */
  mock: {
    use: isPro || true,
  },

  /**
   * @description 百度地图
   * @info 应用编号: 16607282, 应用名称: map-web
   */
  bdMap: {
    use: false,
    ak: 'tn2noM02ttb2mDuHPRSGnYwGHaw8VI1Z',
  },
  isPro,
};

export default config;
