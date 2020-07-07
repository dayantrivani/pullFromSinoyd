// vue 全局过滤器定义
import { sliceDate } from '@/libs/tools';

// 自定义过滤器
const filters = {
  sliceDate,  // 截取日期字符串
};

const install = (Vue) => {
  Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
  });
};

export default { install };
