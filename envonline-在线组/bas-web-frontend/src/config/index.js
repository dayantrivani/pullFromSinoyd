const type = window.sessionStorage.getItem('baseType') || '';

const isPro = process.env.NODE_ENV === 'production';
const title = type === 'base' ? '基础配置' : '基础数据';

export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: isPro ? title : '基础数据',

  /**
   * @description 配置显示在左上角的 logo 标签及文字
   */
  logo: [isPro ? title : '基础数据', ''],

  /**
   * @description 应用ID, 关联快速开发平台
   */
  appGuid: type === 'base' ? 'aa4c1f28ffa64b8fbb08672f63ac06ae' : 'aa4c1f28ffa64b8fbb08672f63ac06ae',

  /**
   * @description 是否获取全部导航
   */
  isMenuAll: false,

  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  home: type === 'base' ? 'EntPortMNQuery' : 'PSInfo',

  /**
   * @description 区块间隔 px
   */
  space: 10,

  /**
   * @description 需要加载的插件
   */
  plugin: {
    // 实际打包时应该不引入mock, 且会影响到Element上传组件进度条的显示
    mock: false, // process.env.NODE_ENV !== 'production'
  },

  /**
   * @description 请求库参数配置
   */
  http: {
    // 是否拦截重复请求
    repeated: false,
    // 指定请求超时的毫秒数(0 表示无超时时间)
    timeout: 50000,
  },
};
