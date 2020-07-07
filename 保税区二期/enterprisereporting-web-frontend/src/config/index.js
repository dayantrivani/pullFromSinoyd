export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '企业上报平台',

  /**
   * @description 配置显示在左上角的 logo 标签及文字
   */
  // logo: ['污染源全要素自动监控产品', '| 飞翔化工一体化平台'],
  logo: ['企业上报', '保税区二期'],

  /**
   * @description 应用ID, 关联快速开发平台
   */
  appGuid: '2a6068f6cf32430d8189de78cb9e9c59',

  /**
   * @description 是否获取全部导航
   *  若为false时, 会从第二级开始显示在侧边导航栏中
   */
  isMenuAll: false,

  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  home: 'home',

  /**
   * @description 区块间隔 单位像素
   */
  space: 10,

  /**
   * @description 需要加载的插件
   * mock  模拟数据的代码库,实际打包时应该不引入mock, 且会影响到Element上传组件进度条的显示
   *   production 生成环境
   */
  plugin: {
    mock: process.env.NODE_ENV !== 'production', // false
  },
  /**
   * @description 请求库参数配置
   * repeated  默认false， 是否拦截重复请求
   * timeout   指定请请求超时是的毫秒数(0 表示无超时时间)
   */
  http: {
    repeated: false,
    timeout: 50000,
  },
};
