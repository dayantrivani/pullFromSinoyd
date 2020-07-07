<template>
  <div>
    <el-card class="project">
      <div slot="header"
           class="clearfix">
        <el-form inline
                 :model="queryForm"
                 style="overflow: hidden;">
          <el-row>
            <el-col :span="3"
                    style="font-size: 15px;font-weight: 550;">
              接入企业：{{count.psNum}}家
            </el-col>
            <el-col :span="3"
                    style="color:#409EFF;font-size: 15px;font-weight: 550;">
              项目总数：{{count.projectNum}}个
            </el-col>
            <div style="float:right;">
              <el-form-item label="接入企业名称：">
                <el-select v-model="queryForm.psName"
                           filterable
                           clearable
                           style="width:250px;"
                           placeholder="请选择">
                  <el-option v-for="item in psInfoList"
                             :key="item.id"
                             :label="item.psName"
                             :value="item.psName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检测类型：">
                <el-select v-model="queryForm.type"
                           style="width:150px;"
                           clearable>
                  <el-option v-for="(item,index) in $enum.typeOptions"
                             :key="index"
                             :label="item"
                             :value="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属年度：">
                <el-date-picker v-model="queryForm.belongYear"
                                value-format="yyyy"
                                placeholder="选择年份"
                                style="width:150px;"
                                type="year"></el-date-picker>
              </el-form-item>
              <el-button type="primary"
                         icon="fas fa-search"
                         @click="onQueryList()">查 询</el-button>
            </div>
          </el-row>
          <el-row>
            <el-col :span="3"
                    style="color:#67C23A;font-size: 15px;font-weight: 550;">
              检测通过：{{count.passNum}}个
            </el-col>
            <el-col :span="3"
                    style="color:rgb(252, 86, 102);font-size: 15px;font-weight: 550;">
              检测未通过：{{count.notPassNum}}个
            </el-col>
            <div style="float:right;">
              <el-form-item label="检测机构名称：">
                <el-select v-model="queryForm.psTestingName"
                           filterable
                           clearable
                           style="width:250px;"
                           placeholder="请选择">
                  <el-option v-for="item in testInfoList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检测结果：">
                <el-select v-model="queryForm.status"
                           style="width:150px;"
                           clearable>
                  <el-option v-for="(item,index) in $enum.projectStatus"
                             :key="index"
                             :label="item"
                             :value="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="首检日期：">
                <el-date-picker v-model="queryForm.firstTestDate"
                                value-format="yyyy-MM-dd"
                                style="width:150px;"
                                type="date"
                                placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-button type="primary"
                         icon="fas fa-download"
                         :disabled="!itemList.length"
                         :loading="exportStatus"
                         @click="onClickExport()">导 出</el-button>
            </div>
          </el-row>
        </el-form>
      </div>
      <div style="height:95%;overflow-y:auto">
        <div class="project-div"
             v-for="(item,index) in itemList"
             :key="index">
          <el-form :model="item"
                   label-position="right"
                   label-width="140px">
            <el-row>
              <el-col :class="checkFlagTitle(item.flag)">{{item.psName}}</el-col>
            </el-row>
            <el-row style="height:30px;">
              <el-col style="margin-top:5px;"
                      :span="6">
                <span class="project-left">检测机构：</span>
                <span class="project-subhead">{{item.psTestingName}}</span>
              </el-col>
              <el-col style=";margin-top:5px;"
                      :span="6">
                <el-form-item label="接入日期：">{{item.createDate | date}}</el-form-item>
              </el-col>
              <el-col style=";margin-top:5px;"
                      :span="6">
                <el-form-item label="首次检测日期：">{{item.firstTestDate | date}}</el-form-item>
              </el-col>
              <el-col style="float:right;margin-top:5px;"
                      :span="6">
                <el-form-item label="本次检测结果：">
                  <el-button v-if="item.status === 1"
                             type="success"
                             size="mini"
                             round>检测通过</el-button>
                  <el-button v-if="item.status === 2"
                             type="danger"
                             size="mini"
                             round>检测未通过</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <hr :class="checkFlagHr(item.flag)" />
            <el-row>
              <el-col :span="6">
                <span class="project-left">所属年度：</span>
                <span class="project-subhead">{{item.belongYear}}</span>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总密封点数量：">{{item.totalSealPoint}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="检测点数量：">{{item.testPoint}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="本周期预计排放量：">{{item.currentCycleCou}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <span class="project-left">检测类型：</span>
                <span class="project-subhead">{{$enum.typeOptions[item.type]}}</span>
              </el-col>
              <el-col :span="6">
                <el-form-item label="检测周期：">{{$enum.cycleOptions[item.cycle]}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="泄露点数量：">{{item.leakagePoint}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="本周期减排总量：">{{item.currentCycleReduceCou}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="margin:0px 0px 0px  30px;">
                <el-button style="float:left;"
                           type="primary"
                           size="mini"
                           icon="fas fa-file-invoice"
                           @click="onClickDetail(item)">详 情</el-button>
                <el-button style="float:left;"
                           icon="fas fa-link"
                           type="primary"
                           size="mini"
                           @click="onClickDoc(item)">附 件</el-button>
                <el-button style="float:left;"
                           icon="fas fa-link"
                           type="primary"
                           size="mini"
                           @click="onClickPic(item)">图档</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div style="position:fixed;bottom:0;height:45px;right:10px;">
        <paging-query :pager="pager"
                      @query="getItemList" />
      </div>
    </el-card>
    <project-device ref="dialog" />
    <file ref="docList" />
    <pic ref="picList" />
  </div>
</template>

<script>
import { analyzeResp } from '@/libs/util';
import { queryList } from '@/libs/mixins';
import File from './components/File';
import ProjectDevice from './components/ProjectDevice';
import Pic from './components/pic';

export default {
  name: 'LDARProjectManage',
  mixins: [
    queryList,
  ],
  components: {
    ProjectDevice,
    File,
    Pic,
  },
  created() {
    this.getPsInfoList();
    this.getTestInfoList();
    this.onQueryList();
    this.getCount();
  },
  data() {
    return {
      show3: true,
      url: 'ldar/project',
      itemList: [],
      count: {
        psNum: 0,
        projectNum: 0,
        passNum: 0,
        notPassNum: 0,
      },
      isAuto: false,
      exportStatus: false,
      psInfoList: [],
      testInfoList: [],
      type: [1, 2, 3, 4],
      queryForm: {
        psName: '',
        psTestingName: '',
        belongYear: '',
        firstTestDate: '',
        status: '',
        type: '',
      },
    };
  },
  methods: {
    onClickDoc(row) {
      this.$refs.docList.openDialog(row, this.type);
    },
    onClickDetail(item) {
      this.$refs.dialog.openDialog(item.id);
    },
    onClickPic(item) {
      this.$refs.picList.openDialog(item.id);
    },
    checkFlagTitle(flag) {
      switch (flag) {
        case 1: return 'project-title-special';
        default: return 'project-title';
      }
    },
    checkFlagHr(flag) {
      switch (flag) {
        case 1: return 'project-hr-special';
        default: return 'project-hr';
      }
    },
    // 导出
    onClickExport() {
      this.exportStatus = true;
      this.$http.post('ldar/project/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        const fileName = `项目管理${new Date().getTime()}.xls`;
        const fileBlob = new Blob([response.data], { type: 'application/x-xls' });
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(fileBlob, fileName);
        } else {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(fileBlob);
          link.download = fileName;
          document.body.appendChild(link);  // fix: 修复在火狐未触发下载问题
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.exportStatus = false;
      });
    },
    getCount() {
      this.$http.get('ldar/project/count', {
        params: { ...this.queryForm },
      })
        .then((response) => {
          if (response.status === 200 && response.data.msg.includes('成功')) {
            this.count = response.data.data;
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
          this.getCount();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    getPsInfoList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, sort: 'psName+' },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psInfoList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    getTestInfoList() {
      this.$http.get('ldar/testingCompanyInfo', {
        params: {
          page: 1, rows: 10000, sort: 'name+', status: 1,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.testInfoList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>

<style>
.project-div {
  width: calc(100% - 40px);
  height: 200px;
  float: left;
  margin: 10px;
  border: solid 1px #dce6f1;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.project-div .el-form-item__content {
  color: rgb(101, 103, 105);
  font-weight: 600;
}
.project-title {
  margin: 10px 30px;
  font-size: 18px;
  font-weight: 600;
  color: #4398f0;
}
.project-title-special {
  margin: 10px 30px;
  font-size: 18px;
  font-weight: 600;
  color: rgb(252, 86, 102);
}
.project-subhead {
  font-size: 14px;
  font-weight: 600;
  color: rgb(101, 103, 105);
}
.project-left {
  margin: 10px 0px 10px 30px;
}
.project-hr {
  height: 4px;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: #dbecfe !important;
}
.project-hr-special {
  height: 4px;
  margin-top: 5px;
  margin-bottom: 10px;
  background-color: rgb(252, 86, 102);
}
.project .el-card__header {
  height: 75px;
}
</style>
