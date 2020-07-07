import enumConfig from '@/config/enum.config';

/**
 * @deprecated  枚举常量
 *              不在快速开发平台中维护的、固定的常量
 *
 * @suggest_demo  枚举调用示例（推荐）
 *
 *  通过 "常量代码" 获取枚举列表
 *    this.$enum.get('USE_TYPE')
 *
 *  通过 "value" 获取对应的 "label" 枚举项
 *    this.$enum.get('USE_TYPE', 'value值')
 *    this.$enum.getLabel('USE_TYPE', 'value值')
 *
 *  通过 "label" 获取对应的 "value" 枚举项
 *    this.$enum.getValue('USE_TYPE', 'label值')
 *
 *  调用枚举预设 ID
 *    this.$enum.getId('empty')
 *    this.$enum.getId('无量纲')
 *
 * @advance_demo 进阶枚举调用示例（不推荐，功能预留，仅用于复杂场景）
 *
 *  通过 "常量名称" 获取枚举列表（功能预留）
 *    this.$enum.get('使用类型')
 *
 *  通过 "value" 获取对应的 "label" 枚举项（功能预留）
 *    this.$enum.get('USE_TYPE:value', 'value值').label
 *
 *  通过 "value" 获取对应的 "label" 枚举项（功能预留）
 *    this.$enum.get('USE_TYPE:label', 'label值').value
 *
 *  调用枚举预设 ID（功能预留）
 *    this.$enum.get('ID:label', '无量纲').value
 */

//  枚举名称与字段的分隔符
const separator = ':';

class Enum {
  constructor(enums) {
    this.lists = [];  // 枚举数组
    this.keyMap = []; // 定位数组
    this.temp = { key: null, index: false };  // 缓存枚举

    const keys = [[], []];  // 用于判断重复枚举

    for (let i = 0; i < enums.length; i++) {
      keys[0].push(enums[i].name);
      keys[1].push(enums[i].code);
      this.keyMap.push([enums[i].code, enums[i].name]);
      this.lists.push(enums[i].list);
    }

    // 判断是否含有重复的枚举定义
    if (new Set(keys[0]).size !== keys[0].length || new Set(keys[0]).size !== keys[0].length) {
      throw new Error('存在重复定义的枚举，请检查枚举定义');
    }
  }

  query(key) {
    // 查找与上次相同枚举时，返回缓存的数据
    if (key && key === this.temp.key) {
      return this.lists[this.temp.index];
    }

    let index = false;

    // 出于性能考虑，并未使用数组方法遍历
    for (let i = 0; i < this.keyMap.length; i++) {
      if (this.keyMap[i][0] === key || this.keyMap[i][1] === key) {
        index = i;
        break;
      }
    }
    // 缓存结果
    this.temp = index >= 0
      ? { key, index }
      : { key: null, index: false };

    return index >= 0 ? this.lists[index] : false;
  }

  // 获取枚举列表
  get(name, value) {
    // 解析传参 key 枚举名称, filed: 字段名称
    const [key, filed] = name.split(separator);
    // 检测中文传参并抛出警告信息
    // eslint-disable-next-line no-console
    if (!(/^[A-Z]/.test(key))) console.warn('推荐使用枚举代码来查枚举，不建议使用中文传参');
    // 枚举属性列表
    const list = this.query(key);
    // 若有传字段且参数值，则返回枚举列表中的对应记录
    if (filed && (value || typeof value === 'number')) {
      return list ? list.find(v => v[filed] === value) : {};
    }
    // 若未传字段但传了参数值（视为获取label），则返回枚举列表中的对应记录
    if (value || typeof value === 'number') {
      return list ? list.find(v => v.value === value).label : {};
    }
    // 若未传字段则返回枚举列表
    return list || [];
  }

  // 通过 "value" 获取对应的 "label" 枚举项
  getLabel(name, value, str = '') {
    const v = this.get(`${name}:value`, value);
    return v !== undefined ? v.label : str;
  }

  // 通过 "label" 获取对应的 "value" 枚举项
  getValue(name, value) {
    return this.get(`${name}:label`, value).value;
  }

  // 通过 "label" 获取对应的 "value" 枚举项
  getId(value) {
    return this.get('ID:label', value).value;
  }
}

const install = (Vue) => {
  Vue.prototype.$enum = new Enum(enumConfig);
};

export default { install };
