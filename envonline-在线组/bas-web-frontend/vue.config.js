// const path = require('path');
// const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');

// vue.config.js
module.exports = {

  // 部署应用的基础URL: String '/'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  // 运行时将生成构建文件的目录: String
  outputDir: 'base',

  // 相对于 outputDir 生成的静态目录
  // assetsDir: '',

  // 指定生成的输出路径, 相对于outputDir: String
  // indexPath: 'index.html'

  // 是否使用ESList: Boolean true
  lintOnSave: process.env.NODE_ENV !== 'production',

  // 是否需要生产源映射: Boolean true
  productionSourceMap: false,

  // webpack 配置
  // configureWebpack: (config) => {
  //   config.plugins.push(new SkeletonWebpackPlugin({
  //     webpackConfig: {
  //       entry: {
  //         app: path.join(__dirname, './src/components/layouts/Skeleton/index.js'),
  //       },
  //     },
  //     minimize: true,
  //     quiet: true,
  //   }));
  // },

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
      '/api/sinoyd-doc': {
        // below are local develop
        // target: 'http://192.168.11.65:8099/sinoyd-doc',
        target: 'http://192.168.30.92:9092/api/sinoyd-doc',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-doc': '',
        },
      },
      '/api/dynamic': {
        // below are local develop
        // target: 'http://localhost:9003',
        target: 'http://192.168.11.65:8099',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/dynamic': '/api/dynamic',
        },
      },
      // 常规接口
      '/api/sinoyd-wrybase': {
        // target: 'http://192.168.6.182:9002/api/',
        target: 'http://192.168.30.92:9092/api/sinoyd-wrybase',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-wrybase': '',
        },
      },
      // 登录接口
      '/api/proxy': {
        // target: 'http://192.168.6.10:8099/auth/',
        target: 'http://192.168.30.92:9092/api/proxy',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/proxy': '',
        },
      },
      // 系统接口
      '/api/sinoyd-frame': {
        // target: 'http://192.168.6.10:8099/sys/',
        target: 'http://192.168.30.92:9092/api/sinoyd-frame',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-frame': '',
        },
      },
      // 存储接口
      '/storage': {
        // target: 'http://192.168.6.10:9003/',
        target: 'http://192.168.11.65:8099',
        changeOrigin: true,
        pathRewrite: {
          '^/storage': '/storage',
        },
      },
    },
  },
};
