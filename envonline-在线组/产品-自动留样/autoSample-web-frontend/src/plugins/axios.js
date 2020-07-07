import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
// import router from '../routes';
import store from '../store';

const Axios = axios.create({
  timeout: 5000,
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: status => (status >= 200 && status < 300),
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices' }),
});

// const { CancelToken } = axios;
const requestMap = new Map();

// 是否启用自动刷新 token
const canRefresh = window.localStorage.getItem('canRefresh');

// 检测 token 到期
// eslint-disable-next-line
const checkExpireToken = error => new Promise((resolve, reject) => {
  if (!canRefresh) {
    store.commit('auth/Logout');
    window.location.reload();
    return reject(error);
  }
  return store.dispatch('auth/RefreshToken', error.config).then((newResponse) => {
    resolve(newResponse);
    store.dispatch('auth/GetMenu');
  });
});

// 请求前置拦截器
Axios.interceptors.request.use(
  (config) => {
    // 设置凭证
    if (store.state.auth.token && config.headers.Authorization !== '') {
      config.headers.common.Authorization = store.state.auth.token;
    }

    if (config.url.indexOf('bas/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }

    if (config.url.indexOf('sys/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }

    if (config.url.indexOf('cfg/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }

    if (config.url.indexOf('cfg/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }

    if (config.url.indexOf('autoSample/') === 0) {
      config.url = `sinoyd-autosample/${config.url}`;
    }

    if (config.url.indexOf('alarm/') === 0) {
      config.url = `sinoyd-wryalarm/${config.url}`;
    }
    // 防止重复请求
    // const keyString = qs.stringify(Object.assign({}, { url: config.url, method: config.method }, config.data));
    // if (requestMap.get(keyString)) {
    //   config.cancelToken = new CancelToken((cancel) => {
    //     cancel('请求发送中...');
    //   });
    // }
    // requestMap.set(keyString, true);
    // Object.assign(config, { ckeyString: keyString });

    return config;
  },
  error => Promise.reject(error)
);

// 响应前置拦截器
Axios.interceptors.response.use(
  (response) => {
    // 重置requestMap
    const { config } = response;
    requestMap.set(config.ckeyString, false);

    if (response.data.success && response.config.headers.Authorization) {
      store.commit('auth/SetToken', response.config.headers.Authorization);
    }

    return response;
  },
  (error) => {
    requestMap.set(error.config.ckeyString, false);

    // if (!/auth\/jwt\/token/.test(error.config.url) && error.response.code === 500) {
    //   return checkExpireToken(error);
    // }
    // if (error.response.code === 403) {
    //   return checkExpireToken(error);
    // }
    if (error.response.data.code === 403
      || error.response.status === 401
      || !store.state.auth.token
      || error.response.data.msg.includes('授权已过期')) {
      Message.warning({ duration: 1500, message: error.response.data.msg });
      store.commit('auth/Logout');
      // router.replace({
      //   name: 'login',
      // });
    }
    // if (error.response.data.code === 403 || error.response.data.code === 401) {
    //   Message.warning({ duration: 1500, message: error.response.data.msg });
    //   store.commit('auth/Logout');
    //   router.replace({
    //     name: 'login',
    //   });
    // }

    return Promise.reject(error);
  }
);

Axios.all = axios.all;
Axios.spread = axios.spread;

export default {
  install(Vue) {
    // eslint-disable-next-line
    Vue.http = Vue.prototype.$http = Axios;
  },
};
