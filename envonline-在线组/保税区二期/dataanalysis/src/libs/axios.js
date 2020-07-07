import axios from 'axios';

import glocfg from '@/config';

import { getToken } from '@/libs/util';

import { IEVersion } from '@/libs/tools';

const isIE = IEVersion();

class HttpRequest {
  // 构造方法
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
    this.queue = {}; // 请求进度信息
  }

  // 获取基础配置
  getInitConfig() {
    return {
      baseURL: this.baseUrl,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: status => (status >= 200 && status < 300),
      ...glocfg.http,
    };
  }

  // 取消进度
  destroy(url) {
    delete this.queue[url];
    if (glocfg.http.queue && !Object.keys(this.queue).length) {
      // Spin.show() // 不建议开启，因为界面不友好
    }
  }

  // 拦截
  interceptors(instance/* , options */) {
    // 请求拦截
    instance.interceptors.request.use((config) => {
      // 设置凭证
      if (config.headers.Authorization !== '' && getToken()) {
        config.headers.common.Authorization = getToken();
      }

      if (config.url.indexOf('surfacewater/') === 0) {
        config.url = `sinoyd-surfacewater/${config.url}`;
      }

      if (config.url.indexOf('ldar/') === 0) {
        config.url = `sinoyd-ldar/${config.url}`;
      }

      if (config.url.indexOf('bas/') === 0) {
        config.url = `sinoyd-wrybase/${config.url}`;
      }

      if (config.url.indexOf('airquality/') === 0) {
        config.url = `sinoyd-airquality/${config.url}`;
      }

      if (config.url.indexOf('amcs/') === 0) {
        config.url = `sinoyd-amcs/${config.url}`;
      }

      if (config.url.indexOf('energy/') === 0) {
        config.url = `sinoyd-eec/${config.url}`;
      }

      if (config.url.indexOf('alarm/') === 0) {
        config.url = `sinoyd-wryalarm/${config.url}`;
      }

      // fix: 修复IE下 get 缓存机制问题,在请求后添加一个时间戳
      if (config.method === 'get' && isIE) {
        if (config.params) {
          config.params._rendertime = new Date().getTime();
        } else {
          config.params = { _rendertime: new Date().getTime() };
        }
      }

      // this.queue[options.url] = true;

      // 添加全局的loading...
      // if (config.http.queue && !Object.keys(this.queue).length) {
      //   // Spin.show() // 不建议开启，因为界面不友好
      // }

      return config;
    }, error => Promise.reject(error));

    // 响应拦截
    instance.interceptors.response.use((response) => {
      this.destroy(/* options.url */);
      const { data, status } = response;
      return { data, status };
    }, async (error) => {
      this.destroy(/* options.url */);
      const { config } = error;

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
    options = Object.assign(this.getInitConfig(options.url), options);
    this.interceptors(instance, options);
    return instance(options);
  }
}

export default HttpRequest;
