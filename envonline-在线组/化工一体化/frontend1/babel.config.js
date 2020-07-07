module.exports = {
  presets: [
    '@vue/app',
  ],
  // Element-UI 组件按需引入
  plugins: [[
    'component', {
      libraryName: 'element-ui',
      styleLibraryName: 'theme-chalk',
    },
  ]],
};
