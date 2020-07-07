const path = require('path');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');

const resolve = dir => path.join(__dirname, dir);
const baseUrl = 'http://olp4.dev.yd/';
// http://192.168.11.63:8097/
// http://192.168.11.65:8099/

// vue.config.js
module.exports = {

  // 部署应用的基础URL: String '/'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  // 运行时将生成构建文件的目录: String
  outputDir: 'alarm',

  // 相对于 outputDir 生成的静态目录
  // assetsDir: '',

  // 指定生成的输出路径, 相对于outputDir: String
  // indexPath: 'index.html'

  // 是否使用ESList: Boolean true
  lintOnSave: process.env.NODE_ENV !== 'production',

  // 是否需要生产源映射: Boolean true
  productionSourceMap: false,

  // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  filenameHashing: true,

  // 该依赖根据使用情况检测 polyfill
  // transpileDependencies: ['vuedraggable'],

  // webpack 配置
  configureWebpack: (config) => {
    config.entry.app = ['babel-polyfill', './src/main.js'];
    config.plugins.push(new SkeletonWebpackPlugin({
      webpackConfig: {
        entry: {
          app: resolve('./src/global/layouts/Skeleton/index.js'),
        },
      },
      minimize: true,
      quiet: true,
    }));
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('~', resolve('public')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('@', resolve('src'));
  },

  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
  },

  // 开发服务配置
  // 开发服务配置
  devServer: {
    host: '0.0.0.0',
    port: 8080,         // 端口号
    https: false,       // https: Boolean
    open: false,        // 自动启动浏览器
    hotOnly: true,
    disableHostCheck: true,
    proxy: {
      // 常规接口
      '/api/sinoyd-wrybase': {
        target: `${baseUrl}api/sinoyd-wrybase`,
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-wrybase': '',
        },
      },
      // 报警接口
      '/api/sinoyd-wryalarm': {
        target: `${baseUrl}api/sinoyd-wryalarm`,
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-wryalarm': '',
        },
      },
      // 权限接口
      '/api/proxy': {
        target: `${baseUrl}api/proxy`,
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/proxy': '',
        },
      },
      // 系统接口
      '/api/sinoyd-frame': {
        target: `${baseUrl}api/sinoyd-frame`,
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-frame': '',
        },
      },
      // 存储接口
      '/storage': {
        target: 'http://192.168.11.65:9025/storage/',
        // target: 'http://192.168.11.64:9099/storage/',
        changeOrigin: true,
        pathRewrite: {
          '^/storage': '',
        },
      },
    },
  },
};
