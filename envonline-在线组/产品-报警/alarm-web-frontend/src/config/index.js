export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '报警管理',

  /**
   * @description 配置显示在左上角的 logo 标签及文字
   */
  logo: ['报警管理', ''],

  /**
   * @description 应用ID, 关联快速开发平台
   */
  appGuid: '745dba77b6c6462dbe0a55cb66a2b5c7',

  /**
   * @description 是否获取全部导航
   */
  isMenuAll: false,

  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  home: 'AlarmRules',

  /**
   * @description 区块间隔 px
   */
  space: 10,

  /**
   * @description 请求库参数配置
   */
  http: {
    // 是否拦截重复请求
    repeated: false,
    // 指定请求超时的毫秒数(0 表示无超时时间)
    timeout: 10000,
  },
};
