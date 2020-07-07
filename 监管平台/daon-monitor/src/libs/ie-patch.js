// IE 兼容补丁，添加未受支持的属性或方法
import { IEVersion } from '@/libs/tools';

const IE_VERSION = IEVersion();

if (IE_VERSION) {
  /**
   * @error "TypeError: 对象不支持“finally”属性或方法"
   * @browser IE 10 及以上
   * @solution https://blog.csdn.net/simon9124/article/details/80940338
   */
  // eslint-disable-next-line
  window.Promise = require('bluebird');
}

if (IE_VERSION === 10) {
  /**
   * @error "TypeError: 对象不支持“origin”属性或方法"
   * @browser IE 10
   */
  // eslint-disable-next-line
  window.location.origin = `${window.location.protocol}//${window.location.host}`;
}
