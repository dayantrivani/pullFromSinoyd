/**
 * @deprecated  枚举常量
 *              不在快速开发平台中维护的、固定的常量
 *              调用：$enum[key]
 * @link 192.168.6.10:8080/frame
 */

const enums = {
  // 输入控件类型
  inputType: {
    1: '文本控件',
    2: '数字控件',
    3: '下拉框控件',
    4: '单选组控件',
    5: '多选组控件',
    6: '日期控件',
    7: '时间控件',
    8: '日期时间控件',
    9: '文本区域控件',
  },

  // 进度条状态
  planClassName: {
    1: 'bg-success',
    2: 'bg-warning',
    3: 'bg-danger',
  },

  // 危险源级别
  hazardLevel: {
    1: '一级',
    2: '二级',
    3: '三级',
    4: '四级',
  },

  // 废水|废气排口
  timeType: [
    { label: '当年', value: 0 },
    { label: '当月', value: 1 },
    { label: '昨日', value: 2 },
  ],
};

export default enums;
