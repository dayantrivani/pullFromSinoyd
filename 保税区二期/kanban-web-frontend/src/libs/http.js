import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import store from '@/store';
import config from '@/config';
import router from '@/routes';
import { IEVersion } from '@/libs/tools';

const isIE = IEVersion();

const Axios = axios.create({
  timeout: config.http.timeout,
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  validateStatus: status => (status >= 200 && status < 300),
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'indices' }),
});

// const { CancelToken } = axios;
const requestMap = new Map();

// 检测 token 到期
function checkExpireToken({ response, config }) {
  /* eslint-disable no-unused-vars */
  return new Promise((resolve, reject) => {
    if ((response.status === 401 || response.data.msg.includes('授权已过期')) && !config.url.indexOf('refresh-token') === -1) {
      store.dispatch('auth/RefreshToken', config).then((newResponse) => {
        resolve(newResponse);
      });
    } else {
      Message.closeAll();
      Message.warning({ message: response.data.msg });
      store.commit('auth/Logout', router);
      reject(response);
    }
    // resolve(response);
  });
}

// 请求前置拦截器
Axios.interceptors.request.use(
  (cfg) => {
    // 设置凭证
    if (store.state.auth.token && cfg.headers.Authorization !== '') {
      cfg.headers.Authorization = store.state.auth.token;
    }

    if (cfg.url.indexOf('redis/') === 0) {
      cfg.url = `sinoyd-redis/${cfg.url}`;
    }

    if (cfg.url.indexOf('amcs/') === 0) {
      cfg.url = `sinoyd-amcs/${cfg.url}`;
    }

    if (cfg.url.indexOf('airquality/') === 0) {
      cfg.url = `sinoyd-airquality/${cfg.url}`;
    }

    if (cfg.url.indexOf('surfacewater/') === 0) {
      cfg.url = `sinoyd-surfacewater/${cfg.url}`;
    }

    if (cfg.url.indexOf('ldar/') === 0) {
      cfg.url = `sinoyd-ldar/${cfg.url}`;
    }

    if (cfg.url.indexOf('bas/') === 0) {
      cfg.url = `sinoyd-wrybase/${cfg.url}`;
    }

    if (cfg.url.indexOf('sys/') === 0) {
      cfg.url = `sinoyd-wrybase/${cfg.url}`;
    }

    if (cfg.url.indexOf('cfg/') === 0) {
      cfg.url = `sinoyd-wrybase/${cfg.url}`;
    }

    if (cfg.url.indexOf('res/') === 0) {
      cfg.url = `sinoyd-doc/${cfg.url}`;
    }

    // fix: 修复IE下 get 缓存机制问题,在请求后添加一个时间戳
    if (cfg.method === 'get' && isIE) {
      if (cfg.params) {
        cfg.params._rendertime = new Date().getTime();
      } else {
        cfg.params = { _rendertime: new Date().getTime() };
      }
    }

    // 防止重复请求
    // if (config.http.repeated) {
    //   const keyString = qs.stringify(Object.assign({}, { url: cfg.url, method: cfg.method }, cfg.data));
    //   if (requestMap.get(keyString)) {
    //     cfg.cancelToken = new CancelToken((cancel) => {
    //       cancel('请求发送中...');
    //     });
    //   }
    //   requestMap.set(keyString, true);
    //   Object.assign(cfg, { ckeyString: keyString });
    // }

    return cfg;
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

    if (!/proxy\/auth\/login/.test(error.config.url) && error.response.status === 401) {
      return checkExpireToken(error);
    }

    if (/refresh-token/.test(error.config.url) && error.response.status === 500) {
      store.commit('auth/Logout', router);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

Axios.all = axios.all;
Axios.spread = axios.spread;

export default Axios;
