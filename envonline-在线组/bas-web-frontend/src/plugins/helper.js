/* eslint-disable */
import { Message } from 'element-ui';
import * as _intersection from 'lodash/intersection';
import store from '../store';

// 关注程度
const AttentionDegreeList = {
  1: '国控',
  2: '省控',
  4: '市控',
  8: '区控',
};
// 污染源企业类型
const PsBaseInfoTypeList = {
  1: '废水',
  2: '烟气',
  3: '水气',
  4: '其他',
};
// 排放口类型
const PortTypeList = {
  1: '废水',
  2: '废气',
  3: '固废',
  4: '噪声',
  5: '雨水',
};
// 状态
const StatusList = {
  0: '启用',
  1: '停用',
  2: '过期',
};
const StatusListAdd = {
  0: '报废',
  1: '正常',
  2: '停用',
  3: '过期',
};
// 排口类型(水)
const WaterPortTypeList = {
  1: '废水',
  2: '污水厂',
  3: '重金属',
  4: '留样',
};
// 排口类型(气)
const GasPortTypeList = {
  1: '烟气',
  2: '焚烧',
  3: 'VOC',
};

// 上传标识
const UpLoadFlagList = {
  0: '未上传',
  1: '已上传',
  2: '预上传',
};

// 所属类型
const CategoryList = {
  1: '废水',
  2: '废气',
  4: '噪声',
};

// 因子类型
const FactorsTypeList = {
  1: '检测因子',
  2: '工作参数',
  3: '校零校满',
  4: '标液浓度',
};

// 页面显示类型
const showNameTypeList = {
  1: '中文',
  2: '别名',
  3: '英文',
};

const evalTypeList = {
  1: '水和废水',
  2: '空气与废气',
  3: '固废',
  4: '噪声',
};

const RegionCodeIdList = {};

const RegionCodeIdLabel = (data, keyField, valField) => {
  data.forEach((val) => {
    RegionCodeIdList[val[keyField]] = val[valField];
  });
};

/* getType 获取数据类型
-------------------------- */
const getType = data => Object.prototype.toString.call(data).slice(8, -1).toLowerCase();

const resp = (response) => {
  // console.error(response.status);
  if (typeof response !== 'object' || response === null) {
    return;
  }
  if (response.status === 422) {
    Message.warning({
      message: response.data.errors ? Object.values(response.data.errors).join('\n') : '',
    });
  } else if (response.status === 403) {
    Message.warning({
      message: '无法执行指定操作，请确认您是否具有足够的权限。',
    });
  } else if (response.status === 404) {
    Message.warning({
      message: '无法获取指定数据，请确认您的操作。',
    });
  } else if (response.status === 429) {
    Message.warning({
      message: '您的操作过于频繁，请稍后再试。',
    });
  } else {
    Message({
      message: (response.data && response.data.msg) ? response.data.msg.replace(/java.lang.NullPointerException:/, '') : '操作有误或者服务器错误',
      type: response.status >= 500 ? 'error' : 'warning',
    });
  }
};

export const dateFormat = (dateObj, fmt = 'Y-m-d H:i', empty = false)  => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];

  const lz = (n) => {
    const num = n.toString();
    if (num.length === 1) {
      return `0${num}`;
    }
    return num;
  };

  let t = dateObj;
  // typeof dateObj !== 'string'是为了判断万一传过来的是y-m-d h:i:s格式，会直接执行最后一个else if，格式化为日期格式
  if (dateObj === null || isNaN(dateObj) && typeof dateObj !== 'string') {
    if (typeof empty === 'string') {
      return empty;
    }
    t = new Date();
  } else if (typeof dateObj === 'number') {
    t = new Date(dateObj * 1000);
  } else if (typeof dateObj === 'string') {
    t = new Date(dateObj.replace(/-/g, '/'));
  }
  if (!(t instanceof Date)) {
    throw new Error('被处理的只能是Date对象');
  }
  if (isNaN(t.getTime())) {
    throw new Error('非法日期对象');
  }
  const date = t.getDate();
  const year = t.getFullYear();
  const hours = t.getHours();
  const day = t.getDay();
  const dayName = days[day];
  const min = t.getMinutes();
  const sec = t.getSeconds();
  const month = t.getMonth();
  const am = hours < 12 ? 'am' : 'pm';
  const ms = t.getTime() % 1000;
  let hours12 = hours % 12;
  hours12 = hours12 || 12;

  const fd = new Date(t.getFullYear(), 0, 1);
  const dayOfYear = Math.round((t - fd) / 8.64e7);
  const weekNum = Math.ceil((((t - fd) / 8.64e7) + fd.getDay() - 1) / 7);

  const a = {
    d: lz(date),
    D: dayName.substr(0, 3),
    l: dayName,
    w: day,
    j: date,
    z: dayOfYear,
    W: weekNum,
    M: months[month].substr(0, 3),
    F: months[month],
    Y: year,
    a: am,
    A: am.toUpperCase(),
    y: year.toString().substr(2, 2),
    c: t.toISOString(),
    m: lz(month + 1),
    U: Math.round(t / 1000),
    g: hours12,
    G: lz(hours12),
    h: hours,
    H: lz(hours),
    i: lz(min),
    s: lz(sec),
    e: ms,
  };

  const v = [];
  Object.keys(a).forEach((k) => {
    v.push(`(\\\\)?${k}`);
  });

  return fmt.replace(new RegExp(v.join('|'), 'g'), (k) => {
    if (a[k]) {
      return a[k];
    }
    return k.replace('\\', '');
  });
};

/* formatTime 与当前时间的间隔
-------------------------- */
export const formatTime = (time) => {
  let result = '';
  const now = new Date().getTime();
  const oldTime = new Date(time).getTime();
  const difference = now - oldTime;
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;
  const y = difference / year;
  const m = difference / month;
  const w = difference / (7 * day);
  const d = difference / day;
  const h = difference / hour;
  const min = difference / minute;

  if (y >= 1) {
    result = `${Math.floor(y)} 年前`;
  } else if (m >= 1) {
    result = `${Math.floor(m)} 个月前`;
  } else if (w >= 1) {
    result = `${Math.floor(w)} 周前`;
  } else if (d >= 1) {
    result = `${Math.floor(d)} 天前`;
  } else if (h >= 1) {
    result = `${Math.floor(h)} 小时前`;
  } else if (min >= 1) {
    result = `${Math.floor(min)} 分钟前`;
  } else {
    result = '刚刚';
  }
  return result;
};

/* formatDate 取指定间隔时间的日期
  s 初始时间  '2019-10-08 00:00:00'
  n 间隔数字  1, -1, 2, -2 ...
  t 间隔类型 day天、month月、year年
-------------------------- */
export const formatDate = (s, n, t = 'day') => {
  let result = '';
  const time = new Date(s.replace(/-/g, '/')).getTime();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;
  if (t === 'day') {
    result = dateFormat(new Date(time + n * day), 'Y-m-d H:i:s');
  } else if (t === 'month') {
    result = dateFormat(new Date(time + n * month), 'Y-m-d H:i:s');
  } else if (t === 'year') {
    result = dateFormat(new Date(time + n * year), 'Y-m-d H:i:s');
  }
  return result;
};


/* flattenDepth 取层级对象指定字段值
-------------------------- */
const flattenDepth = (array, field, depth = 'children') => {
  const result = [];
  const fn = (data) => {
    data.forEach((item) => {
      if (!item[depth].length) {
        result.push(item[field]);
      } else {
        fn(item.children);
      }
    });
  };
  fn(array);
  return result;
};

export default {
  install(Vue) {
    // eslint-disable-next-line
    Vue.hp = Vue.prototype.$hp = {
      resp,
      dateFormat,
      flattenDepth,
      formatDate,
      // 枚举列表项
      AttentionDegreeList,
      PsBaseInfoTypeList,
      PortTypeList,
      StatusList,
      StatusListAdd,
      WaterPortTypeList,
      GasPortTypeList,
      UpLoadFlagList,
      CategoryList,
      FactorsTypeList,
      showNameTypeList,
      evalTypeList,
      RegionCodeIdLabel,
      RegionCodeIdList,
      StreamIntervalTime: 10000, // 多久刷新一次实时数据
    };

    Vue.filter(
      'dateFormat',
      (dateObj, fmt = 'Y-m-d H:i', empty = false) => dateFormat(dateObj, fmt, empty)
    );

    // Vue.mixin({
    //   methods: {
    //     // 用于判断是否拥有权限
    //     hasRole(role, obey = true) {
    //       if (obey && store.state.auth.user.roles.indexOf('admin') >= 0) {
    //         return true;
    //       }
    //       if (typeof role === 'string') {
    //         /* eslint-disable no-param-reassign */
    //         role = role.split(',');
    //       }
    //       return _intersection(role, store.state.auth.user.roles).length > 0;
    //     },
    //   },
    // });

    /* eslint-disable no-param-reassign */
    // Vue.prototype.$ELEMENT = { ...Vue.prototype.$ELEMENT, size: 'small' };
  },
};
