// 注册全局组件，无需引入，直接使用

/**
 * 自动注册全局组件
 * @param {*} requireContext  在构建时解析代码
 * @param {*} Vue
 * @docs https://webpack.js.org/guides/dependency-management/
 */
const registerAllComponents = (requireContext, Vue) => requireContext.keys().forEach((path) => {
  if (path !== './index.js') {
    const vueComp = requireContext(path).default;
    // 异步方式载入组件
    // https://cn.vuejs.org/v2/guide/components-dynamic-async.html#异步组件
    Vue.component(vueComp.name, (resolve) => resolve(vueComp));
  }
});

const install = (Vue) => {
  // eslint-disable-next-line
  registerAllComponents(require.context('./', true, /\index.js$|\index.jsx$|\index.vue$/), Vue);
};

export default { install };
