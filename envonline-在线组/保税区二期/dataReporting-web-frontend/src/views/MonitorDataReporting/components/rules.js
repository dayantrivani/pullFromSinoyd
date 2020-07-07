export default {
  psId: [
    { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
  ],
  portName: [
    { required: true, message: '请输入点位名称', trigger: ['blur', 'change'] },
  ],
  sampleTypeCodeId: [
    { required: true, message: '请选择样品类型', trigger: ['blur', 'change'] },
  ],
  sampleTime: [
    { required: true, message: '请选择采样时间', trigger: ['blur', 'change'] },
  ],
};
