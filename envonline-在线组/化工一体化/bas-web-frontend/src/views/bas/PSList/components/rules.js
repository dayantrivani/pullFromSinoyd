export default {
  psName: [
    { required: true, message: '请输入企业名称', trigger: ['blur', 'change'] },
    { max: 100, message: '企业名称长度请保持在50字以内', trigger: 'blur' },
  ],
  socialCreditCode: [
    { required: true, message: '请输入社会信用代码', trigger: ['blur', 'change'] },
  ],
  'dtoPSBaseInfoExtend.psBaseInfoType': [
    { required: true, message: '请选择企业类型', trigger: ['blur', 'change'] },
  ],
  attentionDegree: [
    { required: true, message: '请选择监管级别', trigger: ['blur', 'change'] },
  ],
};
