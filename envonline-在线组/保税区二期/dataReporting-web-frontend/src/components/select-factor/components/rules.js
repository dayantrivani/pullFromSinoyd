export default {
  sampleTypeCodeId: [
    { required: true, message: '请选择样品类型', trigger: ['blur', 'change'] },
  ],
  factorName: [
    { required: true, message: '请输入因子名称', trigger: ['blur', 'change'] },
  ],
  factorCode: [
    { required: true, message: '请输入因子编码', trigger: ['blur', 'change'] },
  ],
  // unit: [
  //   { required: true, message: '请输入量纲', trigger: ['blur', 'change'] },
  // ],
};
