import copy from './modules/v-copy';
import drag from './modules/v-drag';
import resize from './modules/v-resize';
import stat from './modules/v-stat';

// 自定义指令
const directives = {
  copy,
  drag,
  resize,
  stat,
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
