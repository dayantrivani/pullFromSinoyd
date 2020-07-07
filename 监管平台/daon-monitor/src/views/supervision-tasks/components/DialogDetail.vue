<template>
  <a-modal
    class="modal-detail"
    title="任务详细信息"
    :visible="isVisible"
    width="1320px"
    style="height: 700px; top: 6vh;"
    :maskClosable="false"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-row class="main_content" :gutter="20" style="height: 100%;">
        <a-col :span="17">
          <div class="left">
            <div class="title-wrapper">
              <div class="title">基本信息</div>
            </div>
            <!-- <scrollbar class="scroll-wrapper" style="height: 510px;"> -->
              <!-- <div class="form-scroll" style="overflow: auto;"> -->

            <div class="form-wrapper" style="height: 500px">
              <div class="basic-info">
                <div class="table">
                  <div class="tr">
                    <span class="th">任务名称</span>
                      <a-tooltip placement="top">
                        <template slot="title">
                          <span>{{ itemData.name }}#{{ itemData.sn }}</span>
                        </template>
                        <span class="td left-td">
                          <img v-if="itemData.type === 3" :src="taskFlag"/>
                          {{ itemData.name }}#{{ itemData.sn }}
                        </span>
                      </a-tooltip>
                    <span class="th">任务状态</span>
                    <span class="td right-td">
                      <a-tag
                        :color="itemData.status === 0 ? '#faad14' : itemData.status === 10 ? '#3399ff'
                          : itemData.status === 20 ? '#52c41a' : ''">
                        {{itemData.status === 0 ? '已创建' : itemData.status === 10 ? '工作中'
                          : itemData.status === 20 ? '已提交' : '已关闭'}}
                      </a-tag>
                    </span>
                  </div>
                  <div class="tr tr-spe">
                    <span class="th" style="border-top: none;">任务站点</span>
                    <span class="td left-td">{{itemData.stationName}}</span>
                    <span class="th">企业名称</span>
                    <span class="td right-td">{{itemData.companyName}}</span>
                  </div>
                  <div class="tr tr-spe">
                    <span class="th" style="border-top: none;">监理人员</span>
                    <span class="td left-td">{{itemData.modifierName}}</span>
                    <span class="th">任务类型</span>
                    <span class="td right-td">
                      {{itemData.type === 1 ? '例行任务' : itemData.type === 2 ? '协同任务' : '督办任务'}}
                    </span>
                  </div>
                  <div class="tr tr-spe">
                    <span class="th" style="border-top: none;">开始时间</span>
                    <span class="td left-td">{{itemData.createdAt}}</span>
                    <span class="th">完成时间</span>
                    <span class="td right-td">{{itemData.finishedAt}}</span>
                  </div>
                  <div class="tr tr-spe">
                    <span class="th" style="border-top: none;">任务说明</span>
                    <span class="td remark-td" :title="itemData.remark">{{itemData.remark}}</span>
                    <span class="td" style="width: 20%;">报警次数：
                      <a style="color: #3399ff; cursor: pointer;" @click="onTimesClick(itemData.times)">
                        {{itemData.times}}</a>  次
                    </span>
                  </div>
                  <div class="tr tr-spe">
                    <span class="th" style="border-top: none;">监理报告</span>
                    <span class="td" style="width: 90%;">
                      <span style="border: none"
                        v-if="itemData.supervisionTaskItems && itemData.supervisionTaskItems[activeKey]
                          && itemData.supervisionTaskItems[activeKey].pdfName">
                        {{itemData.supervisionTaskItems[activeKey].pdfName}}
                        <a-icon type="sync" style="margin-left:5px" title="更新"
                          @click="reset(itemData.supervisionTaskItems[activeKey].id)" />
                        <a-icon type="search" style="margin-left:5px" title="预览"
                          @click="preview(itemData.supervisionTaskItems[activeKey])"/>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="form-info">
                <a-tabs tab-position="top" v-model="activeKey" @change="changeKey">
                  <a-tab-pane v-for="(item, index) in formList" :key="index" :tab="item.form.name">
                    <!-- <DynForm v-if="item.form.fields" :form="item.form.fields" :bucket="item.data" /> -->
                    <!-- <div style="width: 100px;height:100px">{{item.form.id}}</div> -->
                  </a-tab-pane>
                </a-tabs>
                <div class="mock-rab-pane">
                  <DynForm v-if="formList.length !== 0 && formList[activeKey].form.fields"
                    :form="formList[activeKey].form.fields" :bucket="formList[activeKey].data" />
                </div>
              </div>
            </div>
              <!-- </div> -->
            <!-- </scrollbar> -->
          </div>
        </a-col>
        <a-col :span="7">
          <div class="right" style="height: 100%;">
            <div class="title-wrapper">
              <div class="title">任务历史</div>
            </div>
            <div class="history-wrapper" style="height: 100%;">
              <div style="margin: 10px 0;">共{{historyList.length}}条记录</div>
              <scrollbar class="scroll-wrapper" style="height: calc(100% - 50px);">
                <div class="list">
                  <ul>
                    <li v-for="(item, index) in historyList" :key="index">
                      <img :src="item.pic ? `/api/monitor/static/files/${item.pic}` : defaultAvatar"/>
                      <div class="li-main">
                        <p>
                          <span style="font-weight: bold;margin-right: 5px;">{{item.creatorName}}</span>
                          <span>{{item.createdAt}}</span>
                        </p>
                        <p>{{item.description}}</p>
                        <div v-if="index !== historyList.length - 1" class="li-main-line"></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </scrollbar>
            </div>
          </div>
        </a-col>
        <DialogAlarm ref="dialogAlarm"></DialogAlarm>
      </a-row>
    </a-spin>
    <pdf-dailog ref="pdf"/>
    <DialogOperation ref="dialogOperation" @refresh="funcFromChild"></DialogOperation>
    <div slot="footer">
      <a-dropdown placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="onTaskBackClick">
            任务退回
          </a-menu-item>
          <a-menu-item key="2" @click="onTaskCloseClick">
            任务关闭
          </a-menu-item>
        </a-menu>
        <a-button style="position: absolute;bottom:5px;left:15px;">相关操作<a-icon type="down" /> </a-button>
      </a-dropdown>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import defaultAvatar from '@/assets/img/avatar-default.png';
import DynForm from './components/DynForm';
import DialogAlarm from './components/DialogAlarm';
import DialogOperation from './components/DialogOperation';
import {
  getOne,
} from '@/api/modules/supervision-tasks.js';
import { resetPdf } from '@/api/modules/abnormal-division.js';
import taskFlag from '@/assets/img/task-flag.png';
import pdfDailog from '../../abnormal-division/components/prePdf';

export default {
  components: {
    DynForm,
    DialogAlarm,
    DialogOperation,
    pdfDailog,
  },
  data() {
    return {
      testShow: false,
      isVisible: false,
      activeKey: 0,
      defaultAvatar,
      taskFlag,
      spinning: false,
      itemData: {},
      formList: [],
      historyList: [],  // 历史信息
      row: {},
      filesObjArr: [],  // 所有含附件的控件
      filesIdArr: [],   // 所有附件的id
    };
  },
  methods: {
    funcFromChild() {
      this.closeDialog();
      this.$emit('refreshList');
    },
    // 监理报告刷新
    reset(id) {
      resetPdf(id).then((res) => {
        if (res.data.code === 200 && res.data.success) {
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
    changeKey() {
      // changeKey(key) {
      // console.log(key);
      // console.log(this.activeKey);
    },
    // 报警次数点击事件
    onTimesClick(val) {
      if (val === '--' || val === '0') {
        return;
      }
      this.$refs.dialogAlarm.openDialog(this.itemData.alarmId);
    },
    // 任务退回事件
    onTaskBackClick() {
      this.$refs.dialogOperation.openDialog('任务退回', this.itemData.id);
      // this.$confirm({
      //   title: '提示',
      //   content: '此操作将退回当前任务, 是否继续?',
      //   okText: '确定',
      //   cancelText: '取消',
      //   onOk: () => {
      //     backTask(this.itemData.id).then((response) => {
      //       if (response.data.code === 200) {
      //         this.$message.success('操作成功', 3);
      //         this.$emit('refreshList');
      //       } else {
      //         this.$message.warning(response.data.message || response.data.msg, 3);
      //       }
      //     });
      //   },
      // });
    },
    // 任务关闭事件
    onTaskCloseClick() {
      this.$refs.dialogOperation.openDialog('任务关闭', this.itemData.id);
      // this.$confirm({
      //   title: '提示',
      //   content: '此操作将关闭当前任务, 是否继续?',
      //   okText: '确定',
      //   cancelText: '取消',
      //   onOk: () => {
      //     closeTask(this.itemData.id).then((response) => {
      //       if (response.data.code === 200) {
      //         this.$message.success('操作成功', 3);
      //         this.$emit('refreshList');
      //       } else {
      //         this.$message.warning(response.data.message || response.data.msg, 3);
      //       }
      //     });
      //   },
      // });
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
    // 打开弹框
    openDialog(row) {
      this.row = row;
      this.spinning = true;
      getOne(this.row.id).then((response) => {
        this.itemData = response.data.data;
        this.historyList = this.itemData.supervisionTaskLogs || [];
        // 获取表单项和数据
        const temFormList = [];
        this.itemData.supervisionTaskItems.forEach((el, index) => {
          temFormList[index] = {};
          temFormList[index].form = el.formVersion;
          if (el.data) {
            const data = JSON.parse(el.data);
            const keys = Object.keys(data);
            const values = Object.values(data);
            values.forEach((val, i) => {
              if (typeof (val) === 'string' && val.includes('{')) {
                // eslint-disable-next-line
                this.$set(data, keys[i], eval('(' + val + ')'));
              }
            });
            // temFormList[index].data = el.data ? JSON.parse(el.data) : {};
            // 处理 签名 数据为id时文件名称
            const canPath = (arr) => {
              arr.forEach((val) => {
                if (val.type === 'signature' && typeof (data[val.id]) === 'string' && data[val.id]) {
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
                  // eslint-disable-next-line
                  if (val.children) {
                    canPath(val.children);
                  }
                }
              });
            };
            canPath(JSON.parse(temFormList[index].form.fields));
            temFormList[index].data = data;
          } else {
            temFormList[index].data = {};
          }
        });
        temFormList.forEach((el) => {
          el.form.fields = JSON.parse(el.form.fields);
        });
        this.formList = temFormList;
        // 将标签页默认选中第一个表单
        this.activeKey = 0;
        this.spinning = false;
        /* 以下为将表单数据中   控件类型为  附件或图片（以下简称附件）  的id数组改为 附件信息数组    的过程 */
        // 1、获取所有含附件的控件对象，存储在数组filesObjArr;
        // 2、获取所有附件id，存储在数组filesIdArr;
        // temFormList.forEach((el) => {
        //   const temArr = [];
        //   this.getAttachObj(el.form.fields, temArr);
        //   if (temArr.length !== 0) {
        //     temArr.forEach((ele) => {
        //       console.log(ele.id);
        //       if (el.data[ele.id] && el.data[ele.id] !== '') {
        //         el.data[ele.id].forEach((element) => {
        //           this.filesIdArr.push(element);
        //         });
        //       }
        //     });
        //   }
        //   this.filesObjArr = this.filesObjArr.concat(temArr);
        // });
        // 3、filesIdArr转为字符串作为参数获取所有附件信息
        // const idStr = this.filesIdArr.join(',');
        // getFiles(idStr).then((response) => {
        //   const filesDetail = response.data.data;
        //   // 4、将所有附件id强制置为附件信息对象
        //   temFormList.forEach((el) => {
        //     this.filesObjArr.forEach((ele) => {
        //       if (el.data[ele.id] && el.data[ele.id] !== '') {
        //         el.data[ele.id].forEach((element, index) => {
        //           filesDetail.forEach((innerElement) => {
        //             if (Number(element) === innerElement.id) {
        //               this.$set(el.data[ele.id], index, innerElement);
        //             }
        //           });
        //         });
        //       }
        //     });
        //   });
        //   this.formList = temFormList;
        //   // 将标签页默认选中第一个表单
        //   this.activeKey = 0;
        //   // console.log(this.activeKey);
        //   this.spinning = false;
        //   // console.log(this.formList);
        // });
      });
      this.isVisible = true;
    },
    // 关闭弹框
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.itemData = {};
      this.formList = [];
      this.historyList = [];
      this.filesObjArr = [];
      this.filesIdArr = [];
    },
  },
};
</script>


<style lang="scss">
  .modal-detail.ant-modal{
    .ant-modal-content{
      height: 100%;
      .ant-modal-body{
        height: calc(100% - 100px);
        .ant-spin-nested-loading{
          height: 100%;
          .ant-spin-container{
            height: 100%;
          }
        }
        .form-scroll{
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
        .form-info{
          // height: 280px;
          // .ant-tabs .ant-tabs-left-bar .ant-tabs-tab{
          //   margin-bottom: 0;
          // }
          .ant-tabs{
            .ant-tabs-top-bar{
              margin: 0;
            }
            .ant-tabs-content{
              // height: 240px;
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
          .mock-rab-pane{
            // height: 240px;
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
        .scroll-wrapper{
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .title-wrapper{
    border-bottom: 2px solid #eee;
    .title{
      display: inline-block;
      border-bottom: 2px solid #3399ff;
      color: #3399ff;
      padding: 0 0 10px 0;
      margin-bottom: -2px;
    }
  }
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
        span.td.remark-td{
          width: 70%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
        }
      }
    }
  }
  .history-wrapper{
    // .scroll-wrapper{
    //   .el-scrollbar__wrap {
    //     overflow-x: hidden;
    //   }
    // }
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
  .tabStyle,.tabStyle tr th, .tabStyle tr td {
    border:1px solid #e4e7ed;
    color: #606266;
    word-wrap: break-word;
    word-break: break-all;
  }
  .tabStyle {
    margin-top: 10px;
    width: 98%;
    margin: 0 auto;
    margin-top: 10px;
    min-height: 25px;
    line-height: 25px;
    border-collapse: collapse;
    padding:2px;
    >tr{
      width: 100%;
      .th{
        width: 100px;
      }
      .left-td{
        width: 200px;
      }
      .remark-td{
        width: 400px;
      }
      // >td{
      //   width: 30%;
      // }
    }
  }
  .main_content{
    .left{
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
</style>
