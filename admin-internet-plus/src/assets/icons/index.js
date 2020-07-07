// 自动引入svg图标文件
/**
 * @deprecated 自动引入svg图标文件, 禁止使用含中文名称的svg文件
 */
const requireAll = requireContext => requireContext.keys().map(requireContext);

const req = require.context('./', true, /\.svg$/);

requireAll(req);
