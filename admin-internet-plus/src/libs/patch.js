/* eslint-disable */
// 兼容补丁，添加未受支持的属性或方法（IE：你们怎么都看着我）

import { IEVersion } from '@/libs/tools';

const IE_VERSION = IEVersion();

if (IE_VERSION) {
  /**
   * @error "TypeError: 对象不支持“finally”属性或方法"
   * @browser IE 10 及以上
   * @solution https://www.jianshu.com/p/f8b910111e07
   */
  Promise.prototype.done = function(onResolved, onRejected) {
    this
      .then(onResolved, onRejected)
      .catch(function(err){
        setTimeout(() => { throw err}, 0); // 抛出一个全局错误
      })
  };
  Promise.prototype.finally = function (callback) {
    'use strict';
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback(value)),
        err => P.resolve(callback(err))
    );
  };


  /**
   * @error error in beforedestroy hook: "typeerror: 对象不支持“remove”属性或方法"
   * @browser IE 9/10
   * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/ChildNode/remove#Polyfill
   */
  (function (arr) {
    arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      }
    });
  });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

}

if (IE_VERSION === 10) {
  /**
   * @error "TypeError: 对象不支持“origin”属性或方法"
   * @browser IE 10
   */
  // eslint-disable-next-line
  window.location.origin = `${window.location.protocol}//${window.location.host}`;
}
