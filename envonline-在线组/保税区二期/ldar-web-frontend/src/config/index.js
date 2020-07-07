export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'LDAR',

  /**
   * @description 配置显示在左上角的 logo 标签及文字
   */
  logo: ['LDAR', ''],

  /**
   * @description 应用ID, 关联快速开发平台
   */
  appGuid: 'ce5d91216afd435f9e6190a7cd350f6f', // 'ce5d91216afd435f9e6190a7cd350f6f',fd82625cc2e24b2fabf5eea1c9412fc6

  /**
   * @description 是否获取全部导航
   */
  // isMenuAll: process.env.NODE_ENV === 'production',
  isMenuAll: false,

  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  home: 'LDARHome',

  /**
   * @description 区块间隔 px
   */
  space: 5,

  /**
   * @description 需要加载的插件
   */
  plugin: {
    // 实际打包时应该不引入mock, 且会影响到Element上传组件进度条的显示
    mock: process.env.NODE_ENV !== 'production',
    // 中文转拼音
    pinyin: false,
  },
};
