// import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import router from '../routes';
import store from '../store';
import config from '@/config';
import { IEVersion } from '@/libs/tools';

const isIE = IEVersion();

const Axios = axios.create({
  timeout: config.http.timeout,
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
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
  });
});

// 请求前置拦截器
Axios.interceptors.request.use(
  (config) => {
    // 设置凭证
    if (store.state.auth.token && config.headers.Authorization !== '') {
      config.headers.common.Authorization = store.state.auth.token;
    }

    if (config.url.indexOf('bas/') === 0 || config.url.indexOf('/bas/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }

    if (config.url.indexOf('sys/') === 0 || config.url.indexOf('/sys/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }

    if (config.url.indexOf('cfg/') === 0 || config.url.indexOf('/cfg/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }

    if (config.url.indexOf('res/' || config.url.indexOf('/res/') === 0) === 0) {
      config.url = `sinoyd-doc/${config.url}`;
    }

    // fix: 修复IE下 get 缓存机制问题
    if (config.method === 'get' && isIE) {
      if (config.params) {
        config.params._rendertime = new Date().getTime();
      } else {
        config.params = { _rendertime: new Date().getTime() };
      }
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

    // if (response.data.success && response.data.data.token) {
    //   store.commit('auth/SetToken', response.data.data.token);
    // }

    return response;
  },
  (error) => {
    requestMap.set(error.config.ckeyString, false);

    // if (!/auth\/jwt\/token/.test(error.config.url) && error.data.code === 500) {
    //   return checkExpireToken(error);
    // }
    if (error.response.data.code === 403
      || error.response.status === 401
      || !store.state.auth.token
      || error.response.data.msg.includes('授权已过期')
      || error.response.data.msg.includes('已下线')) {
      Message.warning({ duration: 1500, message: error.response.data.msg });
      store.commit('auth/Logout');
      router.replace({
        name: 'login',
      });
    }

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
