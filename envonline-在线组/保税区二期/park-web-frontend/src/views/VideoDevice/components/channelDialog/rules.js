export default {
  devCode: [{ required: true, message: '请选择设备编号', trigger: ['blur', 'change'] }],
  channelCode: [{ required: true, message: '请选择通道编号', trigger: ['blur', 'change'] }],
  channelNum: [{ required: true, message: '请填写通道数', trigger: ['blur', 'change'] }],
  channelName: [{ required: true, message: '请填写通道名称', trigger: ['blur', 'change'] }],
  channelRtmp: [{ required: true, message: '请填写rtmp的配置信息', trigger: ['blur', 'change'] }],
};
