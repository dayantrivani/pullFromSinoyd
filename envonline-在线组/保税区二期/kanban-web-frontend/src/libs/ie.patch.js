// IE 兼容补丁

/**
 * @error "TypeError: 对象不支持“finally”属性或方法"
 * @browser IE 10 及以上
 * @solution https://blog.csdn.net/simon9124/article/details/80940338
 */
window.Promise = require('bluebird');
