<template>
  <a-modal
    width="1350px"
    title=""
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="closeDialog"
  >
  <a-spin :spinning="spinning">
    <a-row :gutter="10" style="height: 670px">
      <a-col :span="16">
        <a-card class="detail_card" title="内容详情" :bordered="false">
          <div class="detail_top">
            <p class="title_item" :title="row.message">
              <span>{{row.message}}</span>
              <img v-show="row.warning && row.warning < 0" style="width: 25px;" src="@/assets/img/warning.png"/>
            </p>
            <div class="form_item">站点：{{row.stationName}}</div>
            <div class="form_item">类型：{{row.typeDesc}}</div>
            <div class="form_item">报警时间：{{row.alarmedAt}}</div>
            <div class="form_item">剩余时间：{{switchTime(row.warning)}}</div>
          </div>
          <div class="detail_bot">
            <img title="添加" v-if="index === 1" style="width: 25px;" src="@/assets/img/new.png" @click="addLog"/>
            <span class="no_data" v-if="!roleName.length && !Object.keys(taskMap).length">暂无数据</span>
            <a-tabs
              :style="{ 'width': index === 1 ? 'calc(100% - 25px)' : '100%' }"
              v-if="roleName.length || Object.keys(taskMap).length"
              class="log_tabs"
              @change="changeTabs"
              type="card"
              v-model="activeKey">
              <a-tab-pane v-if="Object.keys(taskMap).length" :tab="taskMap.name" :key="0">
                <div class="form-wrapper" style="height: auto">
                  <div class="basic-info">
                    <div class="table">
                      <div class="tr">
                        <span class="th">任务名称</span>
                          <a-tooltip placement="top">
                            <template slot="title">
                              <span>{{ taskMap.name }}#{{ taskMap.sn }}</span>
                            </template>
                            <span class="td left-td">
                              <img v-if="taskMap.type === 3" :src="taskFlag"/>
                              {{ taskMap.name }}#{{ taskMap.sn }}
                            </span>
                          </a-tooltip>
                        <span class="th">任务状态</span>
                        <span class="td right-td">
                          <a-tag
                            :color="taskMap.status === 0 ? '#faad14' : taskMap.status === 10 ? '#3399ff'
                              : taskMap.status === 20 ? '#52c41a' : ''">
                            {{taskMap.status === 0 ? '已创建' : taskMap.status === 10 ? '工作中'
                              : taskMap.status === 20 ? '已提交' : '已关闭'}}
                          </a-tag>
                        </span>
                      </div>
                      <div class="tr tr-spe">
                        <span class="th" style="border-top: none;">任务站点</span>
                        <span class="td left-td">{{taskMap.stationName}}</span>
                        <span class="th">企业名称</span>
                        <span class="td right-td">{{taskMap.companyName}}</span>
                      </div>
                      <div class="tr tr-spe">
                        <span class="th" style="border-top: none;">监理人员</span>
                        <span class="td left-td">{{taskMap.modifierName}}</span>
                        <span class="th">任务类型</span>
                        <span class="td right-td">
                          {{taskMap.type === 1 ? '例行任务' : taskMap.type === 2 ? '协同任务' : '督办任务'}}
                        </span>
                      </div>
                      <div class="tr tr-spe">
                        <span class="th" style="border-top: none;">开始时间</span>
                        <span class="td left-td">{{taskMap.createdAt}}</span>
                        <span class="th">完成时间</span>
                        <span class="td right-td">{{taskMap.finishedAt}}</span>
                      </div>
                      <div class="tr tr-spe">
                        <span class="th" style="border-top: none;">任务说明</span>
                        <span
                          class="td"
                          :title="taskMap.remark"
                          style="width: 70%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                          {{taskMap.remark}}
                        </span>
                        <span class="td" style="width: 20%;">报警次数：
                          <a style="color: #3399ff; cursor: pointer;" @click="onTimesClick(taskMap.times)">
                            {{taskMap.times}}</a>  次
                        </span>
                      </div>
                      <div class="tr tr-spe">
                        <span class="th" style="border-top: none;">监理报告</span>
                        <span class="td" style="width: 90%;">
                          <span style="border: none"
                            v-if="taskMap.supervisionTaskItems && taskMap.supervisionTaskItems[defalutActiveKey]
                              && taskMap.supervisionTaskItems[defalutActiveKey].pdfName">
                            {{taskMap.supervisionTaskItems[defalutActiveKey].pdfName}}
                            <a-icon type="sync" style="margin-left:5px" title="更新"
                              @click="reset(taskMap.supervisionTaskItems[defalutActiveKey].id)" />
                            <a-icon type="search" style="margin-left:5px" title="预览"
                              @click="preview(taskMap.supervisionTaskItems[defalutActiveKey])"/>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="form-info">
                    <a-tabs tab-position="top" v-model="defalutActiveKey">
                      <a-tab-pane v-for="(item, index) in taskMap.supervisionTaskItems" :key="index" :tab="item.formVersion.name">
                        <!-- <DynForm v-if="item.fields" :form="item.fields" :bucket="item.data ? item.data : {}" /> -->
                      </a-tab-pane>
                    </a-tabs>
                    <div>
                      <DynForm
                      v-if="taskMap.supervisionTaskItems[defalutActiveKey].fields"
                       :form="taskMap.supervisionTaskItems[defalutActiveKey].fields"
                       :bucket="taskMap.supervisionTaskItems[defalutActiveKey].data ?
                          taskMap.supervisionTaskItems[defalutActiveKey].data : {}" />
                    </div>
                  </div>
                </div>
              </a-tab-pane>
              <a-tab-pane :tab="item.name" :key="index + 1" v-for="(item, index) in roleName">
                <div class="form_item each">处理时间：{{item.createdAt}}</div>
                <div class="form_item each">处理人：{{item.creatorName}}</div>
                <div class="each">描述：{{item.description}}</div>
                <div class="each mod-upload-file">
                  <span style="float: left;">附件：</span>
                  <a-row class="uploadClass" :gutter="5">
                    <a-col class="mar-t-xs" v-for="(val, index) in item.attach" :key="index" :span="24 / 2">
                      <div :class="{ 'file-item': 1, 'fn-flex': 1,
                        'border-danger': removeIndex === index,
                        'no-updata': val.status === 'ready',
                      }">
                        <div class="item-type">
                          <svg class="icon" aria-hidden="true">
                            <use v-if="val.status !== 'ready'" :xlink:href="`#${getIcon(val.name)}`"></use>
                            <use v-else :xlink:href="`#${getIcon(val.name)}`"></use>
                            <!-- <use :xlink:href="`#${val.fileType.substr(1)}`"></use> -->
                          </svg>
                        </div>
                        <div class="item-name flex-1">
                          <div v-if="val.status !== 'ready'" :title="val.name">{{ val.name }}</div>
                          <div v-else :title="val.name">{{ val.name }}</div>
                        </div>
                        <div class="item-option">
                          <div class="btn-down">
                            <a-icon type="download" :title="val.status === 'ready' ? '需上传后才能下载' : '下载'"
                              v-show="btn.includes('down')" @click="downLoad(val)"></a-icon>
                          </div>
                          <!-- <div class="btn-close">
                            <a-icon type="close" v-show="btn.includes('remove')" title="删除" @click="onDeleteFile(val, index)"
                              @mouseenter="removeIndex = index"
                              @mouseleave="removeIndex = -1"></a-icon>
                          </div> -->
                        </div>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="log_card" title="日志记录" :bordered="false">
          <div class="history1-wrapper" style="height: 100%;">
            <div style="margin: 10px 0;">共{{logList.length}}条记录</div>
            <scrollbar class="scroll-wrapper" style="height: calc(100% - 50px);">
              <div class="list">
                <ul>
                  <li v-for="(item, index) in logList" :key="index">
                    <img :src="item.pic ? `/api/monitor/static/files/${item.pic}` : defaultUserImg"/>
                    <div class="li-main">
                      <p>
                        <span style="font-weight: bold;margin-right: 5px;">{{item.creatorName}}</span>
                        <span>{{item.createdAt}}</span>
                      </p>
                      <p>{{item.description}}</p>
                      <div v-if="index !== logList.length - 1" class="li-main-line"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </scrollbar>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>
    <a-modal
      width="800px"
      title="添加日志"
      :visible="isLog"
      :maskClosable="false"
      :centered="true"
      @cancel="closeLog"
    >
      <a-row>
        <a-form :form="form">
          <a-col :span="24">
            <a-form-item label="选择角色：" :labelCol="{span:4}" :wrapperCol="{span:20}">
              <a-select placeholder="请选择角色" @change="changeRole" v-decorator="[
                'roleId',
                {
                  rules: [
                    {required: true, message: '请选择角色！',}
                  ],
                }]">
                <a-select-option v-for="item in roleData" :key="item.id" :value="item.id">{{item.roleName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="选择用户：" :labelCol="{span:4}" :wrapperCol="{span:20}">
              <a-select placeholder="请选择用户" v-decorator="[
                'userId',
                {
                  rules: [
                    {required: true, message: '请选择用户！',}
                  ],
                }]">
                <a-select-option v-for="item in userData" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="内容：" :labelCol="{span:4}" :wrapperCol="{span:20}">
              <a-textarea placeholder="请输入内容" v-decorator="[
                'remark',
                {
                  rules: [
                    {required: true, message: '请输入内容！',}
                  ],
                }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="上传附件：" :labelCol="{span:4}" :wrapperCol="{span:20}">
              <uploadTest
                ref="upload"
                @onChangeList="onChangeList"
                :col="2"
                :id="itemModel2.id"
                :doc-type-id="docTypeId[1]"
                :is-update="isUpdate[1]"
                :isRequest="isRequest[1]"
                :size-limilt="20"/>
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <div slot="footer">
        <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
        <a-button icon="close" @click="closeLog">关 闭</a-button>
      </div>
    </a-modal>
    <pdf-dailog ref="pdf"/>
    <DialogAlarm ref="dialogAlarm"></DialogAlarm>
  </a-modal>
</template>

<script>
import '@/../public/iconfont.js';
import { getFileIcon } from '@/libs/util';
import {
  empty, getDetail, getRole, addAlarmLog, resetPdf,
} from '@/api/modules/abnormal-division.js';
import { getConfigUsers } from '@/api/modules/role-management.js';
// import {  getFiles } from '@/api/modules/supervision-tasks.js';
import uploadTest from '@/components/locally/upload-test';
import defaultUserImg from '@/assets/img/people.png';
import DynForm from './DynForm';
import pdfDailog from './prePdf';
import taskFlag from '@/assets/img/task-flag.png';
import DialogAlarm from '../../supervision-tasks/components/components/DialogAlarm';

export default {
  name: 'DetailDialog',
  components: {
    uploadTest,
    DynForm,
    pdfDailog,
    DialogAlarm,
  },
  data() {
    return {
      defalutActiveKey: 0,
      defaultUserImg,
      btn: 'add down remove',
      removeIndex: -1,
      fileOperation: 'down',     // 只允许下载操作
      index: 0,
      isLog: false,
      taskFlag,
      isVisible: false,
      itemModel: empty(),
      row: {},  // 任务数据
      roleData: [], // 角色数据
      userData: [], // 满足角色条件的用户数据
      logs: [],     // 当前任务的日志数据
      activeKey: 0,
      spinning: false,
      itemModel2: { id: 1 },
      isUpdate: [false, false],  // 是否调用上传附件的接口
      isRequest: [false, false], // 是否调用获取附件列表的接口
      docTypeId: ['', ''],       // 上传文档类型
      logList: [],  // 日志数据
      roleName: [],
      taskMap: {},  // 固定标签页数据
      filesObjArr: [],  // 所有含附件的控件
      filesIdArr: [],   // 所有附件的id
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    getIcon: getFileIcon,
    // 监理报告刷新
    reset(id) {
      resetPdf(id).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          // console.log(res.data.data);
          this.$message.success(res.data.msg);
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    // 监理报告预览
    preview(item) {
      this.$refs.pdf.openDialog(item);
    },
    // 报警次数点击事件
    onTimesClick(val) {
      if (val === '--' || val === '0') {
        return;
      }
      this.$refs.dialogAlarm.openDialog(this.taskMap.alarmId);
    },
    // 转换是否超期的时间格式
    switchTime(time) {
      const absTime = Math.abs(time);
      let atr = '';
      if (time) {
        atr =  `${time >= 0 ? '余' : '超'}
          ${absTime >= 24 ? `${Math.floor(absTime / 24)}天` : ''}
          ${absTime % 24} 小时`;
      } else {
        atr =  '';
      }
      return atr;
    },
    changeTabs() {
      if (this.activeKey) {
        const { id } = this.roleName[this.activeKey - 1];
        const item = this.logList.filter(val => val.id === id)[0];
        this.roleName[this.activeKey - 1].description = item.description;
        this.roleName[this.activeKey - 1].createdAt = item.createdAt;
        this.roleName[this.activeKey - 1].creatorName = item.creatorName;
        this.roleName[this.activeKey - 1].attach = item.attach;
      }
    },
    // 新增日志
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'roleId': fieldsValue.roleId,
          'userId': fieldsValue.userId,
          'remark': fieldsValue.remark,
        };
        Object.assign(this.itemModel, setValue);
        if (err) {
          return;
        }
        const { roleName } = this.roleData.find(val => val.id === this.itemModel.roleId);
        const userName = this.userData.find(val => val.id === this.itemModel.userId).name;
        this.$set(this.itemModel, 'alarmSupervisionId', this.row.id);
        this.$set(this.itemModel, 'roleName', roleName);
        this.$set(this.itemModel, 'userName', userName);
        addAlarmLog(this.itemModel).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeLog();
            this.getDetail(this.row.id);
          } else {
            this.$message.warning(response.data.msg, 3);
          }
        });
      });
    },
    // 添加日志
    addLog() {
      this.isLog = true;
      getRole().then((res) => {
        if (res.data.code === 200) {
          this.roleData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 角色切换
    changeRole(value) {
      getConfigUsers(value).then((res) => {
        // eslint-disable-next-line
        this.userData = Object.values(res.data.data)[1];
        const userId = this.form.getFieldValue('userId');
        const ids = this.userData.map(val => val.id);
        if (!ids.includes(userId)) {
          this.form.setFieldsValue({
            userId: '',
          });
        }
      });
    },
    closeLog() {
      this.isLog = false;
      this.itemModel = empty();
      this.form.resetFields();
      this.$refs.upload.fileList = [];
    },
    // 弹框显示
    openDialog(row, num) {
      this.index = num;
      this.row = row;
      this.isVisible = true;
      this.getDetail(row.id);
      this.defalutActiveKey = 0;
    },
    // 获取表单数据中所有类型为附件或图片的控件对象
    getAttachObj(arr, tem) {
      arr.forEach((el) => {
        if (el.type === 'attachment' || el.type === 'photo') {
          tem.push(el);
        }
        if (el.children && el.children.length !== 0) {
          this.getAttachObj(el.children, tem);
        }
      });
    },
    // 获取当前任务的日志数据
    getDetail(id) {
      this.spinning = true;
      getDetail(id).then((res) => {
        this.spinning = false;
        if (res.data.code === 200 && res.data.success) {
          const { data } = res.data;
          this.logList = data.logList;
          /* eslint-disable */
          this.roleName = Object.keys(data.roleName).map((val, index) => {
            return {
              id: Number(val),
              name: Object.values(data.roleName)[index],
              description: '',
              creatorName: '',
              createdAt: '',
              attach: [],
            };
          });
          this.taskMap = data.taskMap ? data.taskMap : {};
          this.activeKey = 1;
          if (!Object.keys(this.taskMap).length) return;
          this.activeKey = 0;
          this.taskMap.supervisionTaskItems.forEach((el) => {
            // obj.data = obj.data ? JSON.parse(obj.data) : {};
            el.fields = JSON.parse(el.formVersion.fields);
            if (el.data) {
              let data = JSON.parse(el.data);
              const keys = Object.keys(data);
              let values = Object.values(data);
              values.forEach((val, i) => {
                if (typeof(val) === 'string' && val.includes('{')) {
                  this.$set(data, keys[i], eval('('+val+')'));
                }
              });
              // temFormList[index].data = el.data ? JSON.parse(el.data) : {};
              // 处理 签名 数据为id时文件名称
              const can_path = (arr) => {
                arr.forEach(val => {
                  if (val.type === 'signature' && typeof(data[val.id]) === 'string' && data[val.id]) {
                    this.$axios.request({
                      url: '/api/monitor/app/supervision/attach-ids',
                      method: 'get',
                      params: {
                        attachIds: data[val.id],
                      },
                    }).then((res) => {
                      data[val.id] = [res.data.data[0].filePath];
                    });
                  } else {
                    if (val.children) {
                      can_path(val.children);
                    }
                  }
                });
              }
              can_path(el.fields);
              el.data = data;
            } else {
              el.data = {};
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
    // 修改附件列表
    onChangeList(list) {
      this.itemModel.attachIds = list;
    },
    // 附件下载
    downLoad(item) {
      this.$axios.request({
        url: `/api/monitor/attach/${item.id}`,
        method: 'get',
        responseType: 'blob',
      }).then((res) => {
        this.downloadFn(res, item.name);
      });
    },
    /* eslint-disable */
    downloadFn(res, name) {
      if (res.headers.success) {
        // IE 浏览器：a标签的download属性不支持IE，使用微软自带的 msSaveBlob 方法
        // 其他浏览器：创建a标签 ，添加download属性，模拟鼠标点击事件
        const blob = new Blob([res.data], { type: res.headers['content-type'] });
        // const filename = res.headers['content-disposition'].split(';')[1].replace('filename=', '');
        if (window.navigator.msSaveBlob) {   // 兼容ie
          try {
            window.navigator.msSaveBlob(blob, name);
          } catch (e) {
            return e;
          }
        } else {
          const a = document.createElement('a');
          a.style.display = 'none';
          a.download = name;
          a.href = window.URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
        }
      } else {
        this.$message.error('当前文件不存在，请联系管理员');
      }
    },
  },
};
</script>

<style lang="scss">
.detail_card{
  >.ant-card-body{
    padding: 10px 10px;
    overflow: atuo;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      background-color: #DEDEDE;
      -webkit-border-radius: 1em;
      -moz-border-radius: 1em;
      border-radius: 1em;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #BFBFBF;
      -webkit-border-radius: 1em;
      -moz-border-radius: 1em;
      border-radius: 1em;
    }
  }
}
.log_card{
  height: 100%;
  >.ant-card-body{
    padding: 10px;
  }
}
.history1-wrapper{
  .scroll-wrapper{
    .el-scrollbar__wrap{
      overflow: hidden!important;
    }
  }
}
.log_tabs{
  >.ant-tabs-content{
    // height: calc(100% - 60px);
    // overflow: auto;
    // &::-webkit-scrollbar {
    //   width: 5px;
    //   height: 5px;
    // }
    // &::-webkit-scrollbar-track {
    //   background-color: #DEDEDE;
    //   -webkit-border-radius: 1em;
    //   -moz-border-radius: 1em;
    //   border-radius: 1em;
    // }
    // &::-webkit-scrollbar-thumb {
    //   background-color: #BFBFBF;
    //   -webkit-border-radius: 1em;
    //   -moz-border-radius: 1em;
    //   border-radius: 1em;
    // }
  }
}
</style>

<style lang="scss" scoped>
  .basic-info{
    margin: 10px 0;
    overflow: hidden;
    .table{
      .tr{
        span ~ span{
          border-left: none;
        }
        span{
          float: left;
          height: 35px;
          line-height: 35px;
          // text-align: center;
          border:1px solid #e4e7ed;
        }
        span.th{
          text-align: center;
          width: 10%;
          font-weight: bold;
        }
        span.td{
          padding: 0 10px;
        }
        span.left-td{
          width: 33%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
        }
        span.right-td{
          width: 47%;
        }
      }
      .tr.tr-spe{
        span ~ span {
          border-top: none;
        }
      }
    }
  }
  .history1-wrapper{
    .list{
      margin-left: 10%;
      li{
        margin-bottom: 10px;
        position: relative;
        img{
          position: absolute;
          top: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        .li-main{
          // position: relative;
          display: inline-block;
          width: 75%;
          margin-left: 50px;
        }
      }
    }
    .scroll-wrapper{
      .el-scrollbar__wrap{
        overflow: hidden!important;
      }
    }
    .li-main{
      border: 1px solid #ccc;
      position: relative;
      padding: 5px;
      .li-main-line{
        position: absolute;
        left: -35px;
        top: 45px;
        border-left: 1px solid #ccc;
        height: 55%;
      }
    }
    .li-main::before{
      content:" ";
      border-top:10px solid transparent;
      border-right:10px solid #ccc;
      border-bottom:10px solid transparent;
      position: absolute;left:-10px;top:10px;
    }
    .li-main::after{
      content:" ";
      border-top:8px solid transparent;
      border-right:8px solid #fff;
      border-bottom:8px solid transparent;
      position: absolute;left:-8px;top:12px;
    }
  }
.log_tabs{
  height: 100%;
  .each{
    margin-top: 10px;
    display: inline-block;
    width: 100%;
  }
}
.title_item{
  display: flex;
  flex-wrap: wrap;
  >span{
    width: calc(100% - 30px);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  >img{
    margin-left: 5px;
  }
}
.form_item{
  display: inline-block;
  float: left;
  width: 50%!important;
  margin-top: 20px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.detail_card{
  height: 100%;
  .detail_top{
    padding: 10px;
    height: 25%;
    background: #F2F2F2;
    >p{
      color: #000000;
      font-size: 20px;
      font-weight: 600;
    }
  }
  .detail_bot{
    padding: 10px;
    margin-top: 10px;
    // height: calc(75% - 10px);
    border: 1px solid #E8E8E8;
    position: relative;
    >.no_data{
      width: 60px;
      display: block;
      height: 420px;
      line-height: 420px;
      margin: 0 auto;
    }
    >img{
      cursor: pointer;
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
}
.uploadClass{
  float: left;
}
</style>
