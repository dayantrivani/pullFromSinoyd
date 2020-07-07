module.exports = {
  presets: [
    '@vue/app',
  ],
  // Element-UI 按需引入
  plugins: [[
    'component', {
      libraryName: 'element-ui',
      styleLibraryName: 'theme-chalk',
    },
  ]],
};
