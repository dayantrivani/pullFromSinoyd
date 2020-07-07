import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import { IEVersion } from '@/libs/tools';
import router from '@/routes';
import store from '../store';

const isIE = IEVersion();

const Axios = axios.create({
  timeout: 5000,
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: status => (status >= 200 && status < 300),
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices' }),
});

// const { CancelToken } = axios;
const requestMap = new Map();
const toLogin = () => {
  if (process.env.NODE_ENV === 'production') {
    window.location.href = `${window.location.origin}/frontend/#/login`;
  } else {
    router.replace({ name: 'login' });
  }
};

// 检测 token 到期
const checkExpireToken = (error) => {
  const { response, config } = error;
  const { status, data } = response;
  const msg = data.msg || '';
  if (status === 403 || status === 402) {
    store.commit('auth/Logout');
    toLogin();
  } else if ((response.status === 401 || msg.includes('授权已过期')) && !config.url.indexOf('refresh-token') === -1) {
    store.dispatch('auth/RefreshToken', config);
  } else {
    Message.closeAll();
    Message.warning({ message: response.data.msg });
    store.commit('auth/Logout', router);
    toLogin();
  }
};

// 请求前置拦截器
Axios.interceptors.request.use(
  (config) => {
    // 设置凭证
    if (store.state.auth.token && config.headers.Authorization !== '') {
      config.headers.common.Authorization = store.state.auth.token;
    }
    if (config.url.indexOf('sys/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }
    if (config.url.indexOf('res/') === 0) {
      config.url = `sinoyd-doc/${config.url}`;
    }
    if (config.url.indexOf('ldar/') === 0) {
      config.url = `sinoyd-ldar/${config.url}`;
    }
    if (config.url.indexOf('bas/') === 0) {
      config.url = `sinoyd-wrybase/${config.url}`;
    }

    // fix: 修复IE下 get 缓存机制问题
    // if (config.method === 'get' && isIE) {
    //   config.params._rendertime = new Date().getTime();
    // }
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

    if (response.data.success && response.config.headers.Authorization) {
      store.commit('auth/SetToken', response.config.headers.Authorization);
    }

    return response;
  },
  (error) => {
    requestMap.set(error.config.ckeyString, false);

    if (!/proxy\/auth\/login/.test(error.config.url) && error.response.status > 400) {
      checkExpireToken(error);
    }

    return Promise.reject(error);
  }
);

Axios.all = axios.all;
Axios.spread = axios.spread;

export default Axios;
