export default {
  psId: [{ required: true, message: '请选择企业名称', trigger: ['blur', 'change'] }],
  devName: [{ required: true, message: '请填写设备名称', trigger: ['blur', 'change'] }],
  devStatus: [{ required: true, message: '请选择设备状态', trigger: ['blur', 'change'] }],
  devIp: [{ required: true, message: '请填写设备ip', trigger: ['blur', 'change'] }],
  devCode: [{ required: true, message: '请填写设备i编码p', trigger: ['blur', 'change'] }],
  devStreamPort: [{ required: true, message: '请填写设备流端口', trigger: ['blur', 'change'] }],
  devPort: [{ required: true, message: '请填写设备端口', trigger: ['blur', 'change'] }],
  devUser: [{ required: true, message: '请填写设备用户名', trigger: ['blur', 'change'] }],
  devPassWord: [{ required: true, message: '请填写设备密码', trigger: ['blur', 'change'] }],
  webSocktIp: [{ required: true, message: '请填写webSocktIp地址', trigger: ['blur', 'change'] }],
  webSockPort: [{ required: true, message: '请填写webSockPort端口号', trigger: ['blur', 'change'] }],
};
