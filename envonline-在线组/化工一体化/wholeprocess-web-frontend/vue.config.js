const path = require('path');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');

const resolve = dir => path.join(__dirname, dir);

// vue.config.js
module.exports = {

  // 部署应用的基础URL: String '/'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  // 运行时将生成构建文件的目录: String
  outputDir: 'rename',

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
  devServer: {
    host: '0.0.0.0',
    port: 8080,         // 端口号
    https: false,       // https: Boolean
    open: false,        // 自动启动浏览器
    hotOnly: true,
    disableHostCheck: true,
    proxy: {
      // 常规接口
      '/api/wholeprocess': {
        target: 'http://192.168.30.199:9302/api/wholeprocess',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/wholeprocess': '',
        },
      },
      // 常规接口
      '/api/orgduty': {
        target: 'http://192.168.30.199:9302/api/orgduty',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/orgduty': '',
        },
      },
      // 常规接口
      '/api/cultural': {
        target: 'http://192.168.30.199:9302/api/cultural',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/cultural': '',
        },
      },
      // 常规接口
      '/api/sinoyd-wrybase': {
        target: 'http://192.168.11.65:9090/api/sinoyd-wrybase',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-wrybase': '',
        },
      },
      // 安全管理
      '/api/sinoyd-wholeprocess': {
        target: 'http://192.168.30.199:9302/api/sinoyd-wholeprocess',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-wholeprocess': '',
        },
      },
      // 登录接口
      '/api/proxy': {
        target: 'http://192.168.11.65:9090/api/proxy',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/proxy': '',
        },
      },
      // 侧边导航树接口
      '/api/sinoyd-frame': {
        target: 'http://192.168.11.65:9090/api/sinoyd-frame',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-frame': '',
        },
      },
      // 上传附件或图片映射
      '/api/sinoyd-doc': {
        // below are local develop
        target: 'http://192.168.11.65:9090/api/sinoyd-doc',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-doc': '',
        },
      },
    },
  },
};
