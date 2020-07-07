import { setCursorPosition } from '@/global/libs/tools';

export default {
  data() {
    return {
      formula: {
        start: 0,
        end: 0,
        value: '',
      },
    };
  },
  methods: {
    // 参数公式失焦事件
    onBlurFormula(e) {
      // 获取光标所在位置的索引信息
      this.formula.startIndex = e.target.selectionStart;
      this.formula.endIndex = e.target.selectionEnd;
    },
    // 点击添加运算符或公式
    onSetFormula(item, refName = 'formula', formObjName = 'itemModel') {
      this.formula.value = item;
      this.insertFormula(item.length, refName, formObjName);
    },
    // 插入符号或公式
    insertFormula(str, refName, formObjName) {
      // 获取光标索引与值
      const { startIndex, endIndex, value } = this.formula;
      // 获取表单绑定的字段名
      const field = Object.keys(this.$refs[refName].elFormItem.elForm.model)[0];
      // 获取表单对象中该字段的值
      const formula = this[formObjName][field];
      // 获取光标前文本
      const prefix = formula.slice(0, startIndex);
      // 获取光标后文本
      const suffix = formula.slice(endIndex);
      // 更新公式中的文本
      this[formObjName][field] = `${prefix}${value}${suffix}`;
      // 更新光标索引参数
      this.formula.startIndex = startIndex + value.length;
      this.formula.endIndex = false;
      // 设置聚焦状态
      this.$refs[refName].focus();
      // 设置光标位置
      setCursorPosition(this.$refs[refName].$el.children[0], startIndex + str);
    },
  },
};
