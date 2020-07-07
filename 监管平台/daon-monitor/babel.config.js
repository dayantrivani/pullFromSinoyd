module.exports = {
  presets: [
    '@vue/app',
    // 构建兼容IE
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    'lodash',
    // ant.design UI 组件按需引入
    [
      'import',
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        'style': 'css', // `style: true` 会加载 less 文件
      },
    ],
  ],
};
