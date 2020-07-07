import { merge, cloneDeep } from 'lodash';
import axios from '@/libs/api-request';

/**
 * @description 危险化学品及高危工艺管理
 */

// 模块接口地址
const modeUrl = 'bas/dangChemInfo';

// 查询条件
export const emptyQuery = {
  deptId: '',                 // 所属科室
  technicalTitleId: '',       // 职称
  status: '',                 // 状态
  key: '',                    // 姓名、编号、拼音
  page: 1,
  rows: 15,
};

// 空记录表单对象
export const emptyForm = {
  id: '',
  cname: '',              // show: 姓名
  sex: '',                // show: 性别
  birthDay: '',           // show: 出生日期
  technicalTitleId: '',   // show: 职称
  deptId: '',             // show: 所属科室
  postId: '',             // show: 职务
  degree: '',             // show: 学历
  specialty: '',          // show: 所学专业
  workStartTime: '',      // show: 入职年限
  status: '',             // show: 状态
  contactMethod: '',      // show: 联系方式
  userNo: '',             // 编号
  technicalTitleDate: '', // 职称获得日期
  eName: '',              // 英文名
  email: '',              // 个人邮箱
  idCard: '',             // 身份证号
  politicalFace: '',      // 政治面貌
  volk: '',               // 民族
  nativePlace: '',        // 籍贯
  archivesPlace: '',      // 档案所在地
  homeTown: '',           // 户籍所在地
  nation: '',             // 国籍
  orderNum: '',           // 排序值
  school: '',             // 毕业院校
  mobile: '',             // 手机
  homeTel: '',            // 固定电话
  birthPlace: '',         // 出生地
  homeAddress: '',        // 地址
  emergentLinkMan: '',    // 紧急联络人
  certificateNO: '',      // 准入证书
  certificateDate: '',    // 准入证书获得日期
  yearsInThePosition: '', // 在岗时间
  joinCompanyTime: '',    // 入职日期
  beginWorkTime: '',      // 开始工作日期
  leaveCompanyTime: '',   // 离职日期
  joinPartyDate: '',      // 入党日期
  keyPost: [],            // 关键岗位
  tecCompetence: '',      // 技术能力
  testResWork: '',        // 从事检测和或校准工作方面的职责
  testResEvaluation: '',  // 检测和或校准策划和结果评价方面的职责
  submissionDuty: '',     // 提交意见和解释的职责
  developMethodRes: '',   // 方法改进新方法制定和确认方面的职责
  experienceRequired: '', // 所需的专业知识和经验
  trainingPrograms: '',   // 资格和培训计划
  manageRes: '',          // 管理职责
  remark: '',             // 备注
};

/**
 * @description 获取下拉框数据（获取遍历数组）
 */
export const getDangChemList = () => axios.request({
  url: modeUrl,
  method: 'get',
  params: merge(emptyQuery, { rows: 10000 }),
});

/**
 * @description 获取列表
 */
export const getList = (formModel) => {
  const params = cloneDeep(emptyQuery);
  return axios.request({
    url: modeUrl,
    method: 'get',
    params: merge(params, formModel),
  });
};

/**
 * @description 获取单条记录
 */
export const getOne = id => axios.request({
  url: `${modeUrl}/${id}`,
  method: 'get',
  // 在传递给 then/catch 前，允许修改响应数据
  // transformResponse: [(dataJson) => {}],
});

/**
 * @description 保存记录
 */
export const save = (row) => {
  const data = cloneDeep(emptyForm);
  return axios.request({
    url: modeUrl,
    method: row.id ? 'put' : 'post',
    data: merge(data, row),
    // 允许在向服务器发送前，修改请求数据
    // transformRequest: [(data) => {}],
  });
};

/**
 * @description 新增记录
 */
export const create = row => save(row);

/**
 * @description 更新记录
 */
export const update = row => save(row);


/**
 * @description 删除记录
 */
export const remove = (arr = []) => axios.request({
  url: modeUrl,
  method: 'delete',
  data: [...arr],
});
