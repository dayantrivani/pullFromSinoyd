import space from './modules/space';

// 自定义全局混合
const mixins = {
  space,
};

export default {
  install(Vue) {
    Object.keys(mixins).forEach((key) => {
      Vue.mixin(mixins[key]);
    });
  },
};
