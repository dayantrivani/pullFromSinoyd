const path = require('path');
const webpack = require('webpack');

const resolve = dir => path.join(__dirname, dir);

// 应用名称
const appTitle = '互联网+监管平台';

// 获取本地数据
// const proxyUrl = process.env.DEV_PROXY_URL || '';

// 是否生产环境
const isPro = process.env.NODE_ENV === 'production';

// 线上部署文件名
const buildName = 'Monitor';

// 注入全局 scss
const gloScss = [
  '@/styles/common/variables.scss',
  '@/styles/common/function.scss',
  '@/styles/common/mixins.scss',
];

// 转为CND外链方式的npm包，键名是import的npm包名，键值是该库暴露的全局变量
// const externals = {
//   'vue': 'Vue',
//   'vue-router': 'VueRouter',
//   'vuex': 'Vuex',
//   'axios': 'axios',
//   'ant-design-vue': 'antd',
//   'echarts': 'echarts',
// };

// CDN外链，会插入到index.html中
// unpkg.com/:package@:version/:file
// const cdnLink = {
//   // 开发环境
//   dev: {
//     css: [],
//     js: [],
//   },
//   // 生产环境 clipboard@2.0.4/
//   pro: {
//     css: [
//       'https://unpkg.com/browse/ant-design-vue@1.3.13/dist/antd.min.css',
//     ],
//     js: [
//       'https://unpkg.com/vue@2.6.10/dist/vue.min.js',
//       'https://unpkg.com/vue-router@3.0.3/dist/vue-router.min.js',
//       'https://unpkg.com/vuex@3.0.1/dist/vuex.min.js',
//       'https://unpkg.com/axios@0.18.1/dist/axios.min.js',
//       'https://unpkg.com/browse/ant-design-vue@1.3.13/dist/antd.min.js',
//       'https://unpkg.com/echarts@4.2.1/dist/echarts.min.js',
//     ],
//   },
// };

// vue.config.js
module.exports = {

  // 在每次保存时 lint 代码
  lintOnSave: true,

  // 部署应用的基础URL<String>
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  // 运行时将生成构建文件的目录<String>
  outputDir: buildName,

  // 相对于 outputDir 生成的静态目录asserts
  assetsDir: './asserts',

  // 是否需要生产源映射<Boolean>
  productionSourceMap: false,

  // babel-loader 默认忽略 node_modules, 将需要转译的依赖在此选项中列出来
  transpileDependencies: [
    'resize-detector',
  ],

  // 全局注入 scss 变量
  css: {
    loaderOptions: {
      sass: { data: gloScss.map(v => `@import "${v}";`).join('') },
    },
  },

  // 合并到最终的 webpack 配置中
  /**
   * @description 查看 webpack 配置命令
   * @run vue inspect --rules         列出所有规则
   * @run vue inspect --plugins       列出所有插件
   * @run vue inspect --rule vue      查看指定规则
   * @run vue inspect --plugins html  查看指定插件
   */
  configureWebpack: () => (isPro ? {
    // 生产环境配置
    // externals,
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  } : {}),

  // 对内部的 webpack 配置进行更细粒度的修改
  chainWebpack: (config) => {
    config.resolve.alias
      .set('~', path.resolve(`${__dirname}/${buildName}`, 'public'))
      .set('@', path.resolve(__dirname, 'src'));

    config.plugin('html')
      .tap((args) => {
        args[0].title = appTitle;
        // args[0].cdn = cdnLink[isPro ? 'pro' : 'dev'];
        return args;
      });

    // 清除已有的所有 loader。
    // 如果不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    // const svgRule = config.module.rule('svg');
    // svgRule.uses.clear();

    // 预处理 svg 图标
    config.module
      .rule('svgIcon')
      .test(/\.svg$/)
      .include
      .add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .tap(() => ({ symbolId: 'icon-[name]' }));

    config.module
      .rule('svg')
      .exclude
      .add(resolve('src/assets/icons'))
      .end();
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
      // '/api/dataquery': {
      //   target: 'http://192.168.6.10:9006/api',
      //   changeOrigin: true,
      //   autoRewrite: true,
      //   pathRewrite: {
      //     '^/api/dataquery': '',
      //   },
      // },
      // 数据接口
      '/api/monitor': {
        // target: 'http://192.168.6.181:9006/api',
        target: 'http://192.168.6.182:9006/api',
        changeOrigin: false,
        autoRewrite: true,
        pathRewrite: {
          '^/api/monitor': '',
        },
      },
    },
  },
};
