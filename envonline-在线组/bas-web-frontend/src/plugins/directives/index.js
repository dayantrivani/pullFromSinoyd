import drag from './modules/drag';
import resize from './modules/resize';
import dialogDrag from './modules/dialogDrag';
import copy from './modules/copy';

// 自定义指令
const directives = {
  drag,
  resize,
  dialogDrag,
  copy,
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
