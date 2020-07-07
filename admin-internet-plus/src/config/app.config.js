import { scope, zIndex } from '@/styles/common/variables.scss';

const isPro = process.env.NODE_ENV === 'production';

const isTop = !(window.self === window.top);

const config = {
  // 是否生产环境
  isPro,

  // 是否被 iframe 嵌入
  isTop,

  // q
  gutter: parseInt(scope, 10),

  // 快速链接
  links: [
    {
      show: true,
      title: '代码仓库',
      icon: 'gitlab',
      url: 'http://git.dev.yd/Sinoyd-WuHan/frame/admin-internet-plus',
    },
    {
      show: true,
      title: '模拟接口',
      icon: 'api',
      url: 'http://192.168.6.10:7300/project/5edf6198f911f695dbe1bc30',
    },
    {
      show: !isPro,
      title: '线上部署地址',
      icon: 'build',
      url: 'http://192.168.6.10:9091/example/#/login',
    },
  ],

  /**
   * @description 应用配置
   */
  app: {
    // 唯一标识 ID, 为空则会获取全部导航
    id: '',
    // logo 图标
    icon: 'logo',
    // logo 标题
    title: '互联网+ 云平台',
    // 默认主页
    home: 'Dashboard',
    // 允许被内嵌(内嵌状态会隐藏顶栏与侧栏)
    nest: true,
    // 启用内嵌导航模式
    iframe: false,
    // UI控件随主题色(页面重新载入后刷新变更)
    useUITheme: true,
    // token在Cookie中存储时效: day, hour, minute
    cookieExpires: '1day',
    // 存储加密
    storageEncrypt: isPro,
    // 页面视图缓存上限
    viewCacheMax: 20,
    // 启用站内消息
    useMessage: false,
    // 启用刷新按钮
    useRefresh: false,
    // 启用最大化
    useFullscreen: false,
    // 启用个性化主题配置
    useCustom: true,
    // 启用帮助（抽屉）
    useHelper: false,
    // 启用验证码进行登录
    useCaptcha: false,
    // 启用项目图标检索
    useSearchIcon: !isPro,
    // 版权说明文字
    copyright: 'Copyright ©2019 技术支持：道农(武汉)大数据科技有限公司',
  },

  /**
   * @description 应用子模块列表
   */
  moduleList: [],

  /**
   * @description 用户个性化配置
   * @priority    用户配置 > 缓存配置 > 默认配置
   */
  custom: {
    // 应用主题
    theme: 6,
    // 侧栏配色 dark light theme
    themeSide: 'dark',
    // 顶栏配色 dark light theme
    themeHead: 'light',
    // 固定顶栏
    headFixed: true,
    // 置顶顶栏
    headStick: false,
    // 下滑时隐藏顶栏
    headGlideHide: false,
    // 固定侧边栏
    sideFixed: true,
    // 显示侧栏折叠按钮（顶栏位置）
    showSideBtnTop: true,
    // 显示侧栏折叠按钮（中间贴边）
    showSideBtnMiddle: true,
    // 显示侧栏折叠按钮（侧栏底部）
    showSideBtnBottom: true,
    // 侧栏默认展开
    sideCollapse: true,
    // 侧边栏开启手风琴模式
    sideAccordion: true,
    // 隐藏侧栏导航子菜单图标
    hideChildIcon: false,
    // 显示全局面包屑导航
    crumbsShow: true,
    // 全局面包屑显示图标
    crumbsIconShow: false,
    // 开启多页签
    tagsUse: true,
    // 多页签并入顶栏
    tagsMoveTop: true,
    // 多页签显示图标
    tagsIconShow: false,
    // 多页签允许锁定
    tagsLockShow: true,
    // 固定多页签
    tagsFixed: true,
  },

  /**
   * @description 布局配置(默认配置),
   * @priority    用户配置 > 缓存配置 > 默认配置
   */
  layout: {
    // 区块间隔(px)
    scope: parseInt(scope, 10),
    // 固定定位层级
    zIndex: parseInt(zIndex, 10),
    // 启用右侧抽屉层
    drawUse: false,
    // 显示屏幕切换按钮
    fullScreenShow: false,
    // 显示页面刷新按钮
    refreshBtnShow: false,
  },

  /**
   * @description 本地存储信息字段管理
   */
  localKey: {
    // 密钥 TOKEN
    token: 'TOKEN',
    // 个性化配置
    custom: 'APP_CUSTOM',
    // 导航菜单
    navMenu: 'APP_USER_MENU',
    // 用户信息
    userInfo: 'APP_USER_INFO',
    // 用户权限
    userAuth: 'APP_USER_AUTH',
    // 是否保持登录
    remember: 'APP_CAN_REFRESH',
    // 首页布局配置
    homeLayout: 'APP_HOME_LAYOUT',
    // 当前选择企业
    selectedOrg: 'APP_CHOICE',
  },

  /**
   * @description 分页字段配置
   */
  pager: {
    // 第几页
    page: 'page',
    // 显示条数
    rows: 'rows',
    // 总记录条数
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
   * @description 请求库参数配置
   * Axios 基于 promise 的 HTTP 库
   * version: ^0.18.0
   * docLink: https://www.kancloud.cn/yunye/axios/234845
   */
  http: {
    // 是否启用 mock
    useMock: true,
    // 网关Url
    gatewayUrl: '',
    // 请求基础URL
    baseURL: '/api',
    // 开发环境基础地址
    devUrl: '/api',
    // 生产环境基础地址
    proUrl: '/api',
    // mock 基础地址
    mockUrl: 'http://192.168.6.10:7300/mock/5edf6198f911f695dbe1bc30/example',
    // 是否拦截重复请求
    repeated: true,
    // 指定请求超时的毫秒数(0 表示无超时时间)
    timeout: 0,
    // 超时后再次请求的次数(0 表示超时后不触发)
    retry: 0,
    // 超时后再次请求的间隔(毫秒)
    retryDelay: 1000,
  },

  /**
   * @description 百度地图
   * @info 应用编号: 16607282, 应用名称: map-web
   */
  bdMap: {
    use: false,
    ak: 'tn2noM02ttb2mDuHPRSGnYwGHaw8VI1Z',
  },

  /**
   * @description 高德地图
   * @info 应用编号: 16607282, 应用名称: map-web
   */
  aMap: {
    cityName: '武汉',
    key: 'ccf5bc6a0f4fa2afaccff6e8ea834c6f',
  },
};

export default config;
