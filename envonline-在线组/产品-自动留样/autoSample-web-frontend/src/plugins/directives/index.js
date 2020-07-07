import resize from './modules/resize';
import dialogDrag from './modules/dialogDrag';

// 自定义指令
const directives = {
  resize,
  dialogDrag,
};

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
