import drag from './modules/drag';
import resize from './modules/resize';

// 自定义指令
const directives = {
  drag,
  resize,
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
