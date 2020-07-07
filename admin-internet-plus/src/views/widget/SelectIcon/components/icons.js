const getIconName = () => {
  const fileType = require.context('@/assets/icons/file-type', false, /\.svg$/);
  const projectKeys = fileType.keys().map(fileType);
  return projectKeys.map(v => v.default.id) || [];
};

export default getIconName();
