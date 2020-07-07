// 注册全局指令，无需引入，直接使用

/**
 * 自动注册全局指令
 * @param {*} requireContext  在构建时解析代码
 * @param {*} Vue
 * @docs https://webpack.js.org/guides/dependency-management/
 */
const registerAllDirectives = (requireContext, Vue) => requireContext.keys().forEach((path) => {
  const directiveName = path.match(/v-(\S*?).js/)[1];
  Vue.directive(directiveName, requireContext(path).default);
});

const install = (Vue) => {
  registerAllDirectives(require.context('./modules', false, /\.js$/), Vue);
};

export default { install };
