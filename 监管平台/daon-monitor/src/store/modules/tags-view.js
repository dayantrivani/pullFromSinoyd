// 多标签页
// eslint-disable-next-line
import config from '@/config';

const state = {
  reload: true, // 重载页面
  views: [],    // 显示标签(存放的页面路由对象)
};

const getters = {
  // 可见的标签
  visibleViews: state => state.views.filter(v => !v.meta.hide),
  // 已缓存的标签
  cacheViews: state => state.views.filter(v => v.meta.cache).map(v => v.name),
  // 已锁定的标签
  lockViews: state => state.views.filter(v => v.meta.lock).map(v => v.name),
  // 未锁定的标签
  unlockViews: state => state.views.filter(v => !v.meta.lock).map(v => v.name),
};

const mutations = {
  /**
   * @description 重置标签
   */
  RESET_TAGS: (state) => {
    state.views = [state.views[0]];
  },
  /**
   * @description 刷新标签页
   */
  RELOAD_VIEW: (state) => {
    state.reload = false;
    setTimeout(() => { state.reload = true; }, 300);
  },

  /**
   * @description 新增标签页
   */
  ADD_VIEW: (state, { view, index }) => {
    if (index !== -1) return;
    const item = { ...view };
    const isHome = config.app.home === view.name;
    const hasTitle = !!(view.meta && view.meta.title);
    item.meta = Object.assign({
      lock: isHome,     // 是否锁定页面
      cache: hasTitle,  // 是否缓存页面
    }, view.meta);
    // 未启用标签页
    if (!config.custom.tagsLockShow && config.app.home !== view.name) {
      item.meta.lock = false;
    }
    state.views[isHome ? 'unshift' : 'push'](item);
  },

  /**
   * @description 关闭标签页
   */
  REMOVE_VIEW: (state, { index }) => {
    if (index !== -1) {
      state.views.splice(index, 1);
    }
  },

  /**
   * @description 关闭其他标签页
   */
  REMOVE_OTHER_VIEWS: (state, { view, index }) => {
    if (index === -1) return;
    const lockViews = state.views.filter(v => v.meta.lock);
    state.views = view.meta.lock
      ? lockViews
      : [...lockViews, view];
  },

  /**
   * @description 关闭右侧标签页
   */
  REMOVE_RIGHT_VIEWS: (state, { index }) => {
    if (index === -1) return;
    state.views = state.views.filter((v, i) => (i <= index || v.meta.lock));
  },

  /**
   * @description 关闭全部标签页
   */
  REMOVE_ALL_VIEWS: (state) => {
    state.views = state.views.filter(v => v.meta.lock);
  },

  /**
   * @description 锁定标签页
   */
  LOCK_VIEW: (state, { view, index }) => {
    // 排除不存在或已锁定的情况
    if (index === -1 || view.meta.lock) return;
    state.views[index].meta.lock = true;
  },

  /**
   * @description 解锁标签页
   */
  UNLOCK_VIEW: (state, { view, index }) => {
    // 排除不存在或未锁定的情况
    if (index === -1 || !view.meta.lock) return;
    state.views[index].meta.lock = false;
  },

  /**
   * @description 更新标签
   */
  UPDATE_VIEW: (state, { view, index }) => {
    if (index === -1) return;
    Object.defineProperty(state.views, index, Object.assign(state.views[index], view));
  },
};

// 获取可操作类型
const types = Object.keys(mutations);

const actions = {
  /**
   * @description 验证传参
   * @param {string} type // 操作类型
   * @param {object} view // 参数对象
   */
  SetView({ state, getters, commit }, params = {}) {
    const [type, view] = [params.type || '', params.view || {}];
    return new Promise((resolve, reject) => {
      // 返回空方法
      if (!types.includes(type)) { reject(); }
      // 获取索引
      const index = state.views.findIndex(v => v.name === view.name);
      commit(type, { view, index });
      resolve(getters.visibleViews);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
