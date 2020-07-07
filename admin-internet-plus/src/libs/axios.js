import axios from 'axios';
import Router from 'vue-router';
import { Message } from 'element-ui';

import glocfg from '@/config/app.config';

import { getToken, setToken, analyzeResp } from '@/libs/util';
import {
  IEVersion,
  getSessionStorage,
  getLocalStorage,
  setSessionStorage,
} from '@/libs/tools';

const isIE = IEVersion();

// 返回登录
const toPage = (path = '/login') => {
  const router = new Router();
  router.replace({ path });
};

/**
 * @description 刷新token请求定义
 */
const refreshToken = () => new Promise((resolve, reject) => {
  setSessionStorage('refresh', true);
  const { refreshToken } = getLocalStorage(glocfg.localKey.userInfo) || {};
  const { id } = getSessionStorage(glocfg.localKey.selectedOrg) || {};
  axios.request({
    baseURL: glocfg.http.baseUrl,
    url: '/proxy/auth/refresh-token',
    method: 'get',
    headers: {
      refreshToken,
      Platform: 'web',
      DeviceID: 'pc',
      cpi: id,
      'Content-Type': 'application/json',
    },
  })
    .then(({ headers, data }) => {
      const { success, msg } = data;
      const token = headers.authorization;
      if (success) {
        setToken(token);
        resolve(token);
      } else {
        Message.wraning(msg);
        toPage();
        reject();
      }
    })
    .catch((error) => {
      analyzeResp(error, code => code === 402 && toPage());
      toPage();
      reject();
    })
    .finally(() => {
      setSessionStorage('refresh', false);
    });
});

const doRequest = async (error) => {
  if (!getSessionStorage('refresh')) await refreshToken();
  const { config } = error.response;
  config.headers.Authorization = getToken();
  const res = await axios.request(config);
  return res;
};


/**
 * @description 封装请求方法
 */
class HttpRequest {
  // 构造方法
  constructor() {
    this.instance = null;
    this.baseURL = glocfg.http.baseURL;
  }

  // 获取实例（单例模式，只允许生成一个实例）
  static getInstance() {
    if (!this.instance) {
      this.instance = new HttpRequest();
    }
    return this.instance;
  }

  // 获取基础配置
  getInitConfig() {
    return {
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: status => (status >= 200 && status < 300),
      ...glocfg.http,
    };
  }

  // 拦截
  interceptors(instance/* , options */) {
    // 请求拦截
    instance.interceptors.request.use(async (config) => {
      // 若无凭证，且非登录，则等待获取凭证
      if (!config.headers.Authorization && !/login/.test(config.url) && getToken()) {
        config.headers.Authorization = getToken();
      }

      // 添加网关前缀
      if (glocfg.http.gatewayUrl && /lim\/|base\/|sys\/|pro\//.test(config.url)) {
        config.url = `${glocfg.http.gatewayUrl}/${config.url}`;
      }

      // 添加mock地址
      if (config.mock && glocfg.http.useMock) {
        config.baseURL = glocfg.http.mockUrl;
      }

      // fix: 修复IE下 get 请求被缓存的问题
      if (config.method === 'get' && isIE) {
        if (config.params) {
          config.params._rendertime = new Date().getTime();
        } else {
          config.params = { _rendertime: new Date().getTime() };
        }
      }

      return config;
    }, error => Promise.reject(error));

    // 响应拦截
    instance.interceptors.response.use(response => response, async (error) => {
      const { config, response } = error;

      if (response.status === 401 && getLocalStorage(glocfg.localKey.remember) && !/logout|login/.test(config.url)) {
        // 勾选保持登录：刷新 token
        await doRequest(error);
        // 返回 resolve 触发上一次请求
        await Promise.resolve();
      } else {
        // 分析响应错误
        analyzeResp(error);
      }

      // 若配置不存在或未设置 retry 则拒绝请求
      if (!config || !config.retry) return Promise.reject(error);

      // 设置变量的跟踪超时再次请求的计数
      config.retryCount = config.retryCount || 0;

      // 检测是否超出超时再次请求的次数
      if (config.retryCount >= config.retry) return Promise.reject(error);

      // 超时再次请求计数自增
      config.retryCount += 1;

      // 创建新的 Promise 处理再次请求
      const backoff = new Promise((resolve) => {
        window.setTimeout(() => {
          resolve();
        }, config.retryDelay || 1);
      });

      // 避免重复添加 baseUrl
      config.baseURL = config.url.includes(this.baseUrl) ? '' : this.baseUrl;

      // 返回的 Promise.then 触发重新请求
      await backoff;
      return instance(config);
    });
  }

  // 请求实例化
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInitConfig(), options);
    this.interceptors(instance, options);
    return instance(options);
  }
}

export default HttpRequest.getInstance();
