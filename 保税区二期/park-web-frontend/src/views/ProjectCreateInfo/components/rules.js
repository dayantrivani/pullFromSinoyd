export default {
  psId: [
    { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
  ],
  projectName: [
    { required: true, message: '请输入项目名称', trigger: ['blur', 'change'] },
  ],
  projectDate: [
    { required: true, message: '请选择项目时间', trigger: ['blur', 'change'] },
  ],
  projectAcceptance: [
    { required: true, message: '请确定项目验收情况', trigger: ['blur', 'change'] },
  ],
};
