module.exports = {
  presets: [
    '@vue/app',
  ],
  // Element-UI 按需引入
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
    // // 转换ES2018 正则Unicode类
    // [
    //   '@babel/plugin-proposal-unicode-property-regex',
    //   {
    //     'useUnicodeFlag': true,
    //   },
    // ],
  ],
};
