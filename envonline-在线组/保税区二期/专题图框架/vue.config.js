const path = require('path');

// 是否生成环境
const isPro = process.env.NODE_ENV === 'production';
// 线上部署文件名
const buildName = 'fxhgbigdata';

// 转为CND外链方式的npm包，键名是import的npm包名，键值是该库暴露的全局变量
const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios',
  'element-ui': 'ELEMENT',
};

// CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    css: [
      'https://cdn.bootcss.com/element-ui/2.8.2/theme-chalk/index.css',
    ],
    js: [],
  },
  // 生产环境
  pro: {
    css: [
      'https://cdn.bootcss.com/element-ui/2.8.2/theme-chalk/index.css',
    ],
    js: [
      'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
      'https://cdn.bootcss.com/vue-router/3.0.3/vue-router.min.js',
      'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
      'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
      // 'https://cdn.bootcss.com/element-ui/2.8.2/index.js',
      'https://cdn.bootcss.com/element-ui/2.9.2/index.js',
    ],
  },
};

// 预载入变量定义
const loadCss = [
  'variables.scss',
  'mixins.scss',
];

// vue.config.js
module.exports = {

  // 部署应用的基础URL<String>
  publicPath: isPro ? `/${buildName}/` : '/',

  // 运行时将生成构建文件的目录<String>
  outputDir: buildName,

  // 是否需要生产源映射<Boolean>
  productionSourceMap: false,

  // 全局注入 scss 变量
  css: {
    loaderOptions: {
      sass: {
        data: loadCss.map(v => `@import "@/styles/common/${v}";`).join(''),
      },
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
  configureWebpack: (config) => {
    config.entry.app = ['babel-polyfill', './src/main.js'];
    if (isPro) {
      config.externals = externals;
    }
  },

  // 对内部的 webpack 配置进行更细粒度的修改
  chainWebpack: (config) => {
    config.resolve.alias
      .set('~', path.resolve(__dirname, 'public'))
      .set('@', path.resolve(__dirname, 'src'));
    config.plugin('html')
      .tap((args) => {
        args[0].cdn = cdn[isPro ? 'pro' : 'dev'];
        return args;
      });
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
      // 地表水接口
      '/api/sinoyd-surfacewater': {
        // target: 'http://192.168.11.63:9090/api/sinoyd-surfacewater',
        target: 'http://192.168.30.92:9090/api/sinoyd-surfacewater',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-surfacewater': '',
        },
      },
      // ldar接口
      '/api/sinoyd-ldar': {
        // target: 'http://192.168.11.63:9090/api/sinoyd-ldar',
        target: 'http://192.168.30.92:9090/api/sinoyd-ldar',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-ldar': '',
        },
      },
      // 能耗接口
      '/api/sinoyd-eec': {
        // target: 'http://192.168.11.63:9090/api/sinoyd-eec',
        target: 'http://192.168.30.92:9090/api/sinoyd-eec',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-eec': '',
        },
      },
      // 污染源在线接口
      '/api/sinoyd-amcs': {
        // target: 'http://192.168.11.63:9090/api/sinoyd-amcs',
        target: 'http://192.168.30.92:9090/api/sinoyd-amcs',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-amcs': '',
        },
      },
      // 空气接口
      '/api/sinoyd-airquality': {
        // target: 'http://192.168.11.63:9090/api/sinoyd-airquality',
        target: 'http://192.168.30.92:9090/api/sinoyd-airquality',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-airquality': '',
        },
      },
      // 报警接口
      '/api/sinoyd-wryalarm': {
        // target: 'http://192.168.6.10:8099/sys/',
        // target: 'http://192.168.11.63:9090/api/sinoyd-wryalarm',
        target: 'http://192.168.30.92:9090/api/sinoyd-wryalarm',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-wryalarm': '',
        },
      },
      // 基础数据接口
      '/api/sinoyd-wrybase': {
        // target: 'http://192.168.11.63:9090/api/sinoyd-wrybase',
        target: 'http://192.168.30.92:9090/api/sinoyd-wrybase',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-wrybase': '',
        },
      },
      // 登录接口
      '/api/proxy': {
        // target: 'http://192.168.11.63:9090/api/proxy',
        target: 'http://192.168.30.92:9090/api/proxy',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/proxy': '',
        },
      },
      // 侧边导航树接口
      '/api/sinoyd-frame': {
        target: 'http://192.168.30.92:9090/api/sinoyd-frame',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-frame': '',
        },
      },
      // 上传附件或图片映射
      '/api/sinoyd-doc': {
        // below are local develop
        target: 'http://192.168.30.92:9090/api/sinoyd-doc',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/sinoyd-doc': '',
        },
      },
    },
  },
};
