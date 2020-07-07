const path = require('path');
const webpack = require('webpack');

const resolve = dir => path.join(__dirname, dir);

// 应用名称
const appTitle = '互联网+ 云平台';

// 线上部署文件名
const appBuild = 'example';

// 获取环境变量 .env.local
const { API_PROXY_URL } = process.env || {};

// 是否生产环境
const isPro = process.env.NODE_ENV === 'production';

// 注入全局 scss
const gloScss = [
  '@/styles/common/variables.scss',
  '@/styles/common/mixins.scss',
  '@/styles/common/helper.scss',
];

// vue.config.js
module.exports = {

  // 在每次保存时 lint 代码
  lintOnSave: true,

  // 部署应用的基础URL<String>
  publicPath: isPro ? './' : `/${appBuild}/`,

  // 运行时将生成构建文件的目录<String>
  outputDir: appBuild,

  // 是否需要生产源映射<Boolean>
  productionSourceMap: false,

  // babel-loader 默认忽略 node_modules, 将需要转译的依赖在此选项中列出来
  transpileDependencies: [
    'resize-detector',
  ],

  /**
   * @description sass 全局变量
   */
  css: {
    loaderOptions: {
      sass: {
        prependData: gloScss.map(v => `@import "${v}";`).join(''),
      },
    },
  },

  /**
   * @description 合并到最终的 webpack 配置中(查看 webpack 配置命令)
   * @run vue inspect --rules         列出所有规则
   * @run vue inspect --plugins       列出所有插件
   * @run vue inspect --rule vue      查看指定规则
   * @run vue inspect --plugins html  查看指定插件
   */
  configureWebpack: () => {
    const config = {};
    if (isPro) {
      config.plugins = [
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ];
    }
    return config;
  },

  /**
   * @description 对内部的 webpack 配置进行更细粒度的修改
   */
  chainWebpack: (config) => {
    config.resolve.alias
      .set('~', path.resolve(`${__dirname}/${appBuild}`, 'public'))
      .set('@', path.resolve(__dirname, 'src'));

    config.plugin('html')
      .tap((args) => {
        args[0].title = appTitle;
        return args;
      });

    // 预处理 svg 图标
    config.module
      .rule('svgIcon')
      .test(/\.svg$/)
      .include
      .add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .tap(() => ({ symbolId: '[name]' }));

    config.module
      .rule('svg')
      .exclude
      .add(resolve('src/assets/icons'))
      .end();
  },

  /**
   * @description 开发服务配置
   */
  devServer: {
    host: '0.0.0.0',
    port: 666,          // 端口号
    https: false,       // https: Boolean
    open: false,        // 自动启动浏览器
    hotOnly: true,
    disableHostCheck: true,
    proxy: {
      '/api/proxy': {
        target: `${API_PROXY_URL}/api/proxy`,
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/proxy': '',
        },
      },
      '/api': {
        target: `${API_PROXY_URL}/api`,
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
