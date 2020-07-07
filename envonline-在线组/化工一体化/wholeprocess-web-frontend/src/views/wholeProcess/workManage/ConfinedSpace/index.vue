<template>
  <div>
    <el-card class="project">
      <div slot="header"
           class="clearfix">
        <el-form inline
                 :model="queryForm"
                 label-width="100px"
                 style="overflow: hidden;">
          <el-row>
            <el-col :span="4"
                    style="font-size: 15px;font-weight: 550;">
              受限空间作业开展中：{{count.inProgress}}个
            </el-col>
            <el-col :span="3"
                    style="color:#409EFF;font-size: 15px;font-weight: 550;">
              一般受限空间作业数：{{count.level1}}个
            </el-col>
            <div style="float:right;">
              <el-form-item label="作业证编号：">
                <el-input v-model="queryForm.permitCode"
                           style="width:250px;"
                           placeholder="作业证编号">
                </el-input>
              </el-form-item>
              <el-form-item label="作业证状态：">
                <el-select v-model="queryForm.workStatus"
                           style="width:290px;"
                           clearable>
                  <el-option v-for="(item,index) in $enum.WORKSTATUS"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary"
                         icon="fas fa-search"
                         @click="onQueryList()">查 询</el-button>
            </div>
          </el-row>
          <el-row>
            <el-col :span="4"
                    style="color:#67C23A;font-size: 15px;font-weight: 550;">
              受限空间作业完成数：{{count.completed}}个
            </el-col>
            <el-col :span="3"
                    style="color:rgb(252, 86, 102);font-size: 15px;font-weight: 550;">
              特殊受限空间作业数：{{count.special}}个
            </el-col>
            <div style="float:right;">
              <el-form-item label="作业级别：">
                <el-select v-model="queryForm.workLevel"
                           style="width:250px;"
                           clearable>
                  <el-option label="所有" :value="-1"></el-option>
                  <el-option v-for="(item,index) in $enum.CONFINEDSPACE"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="计划时间：">
                <el-date-picker
                  v-model="queryForm.fromDate"
                  type="date"
                  style="width: 140px"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickStart"
                  placeholder="开始日期"></el-date-picker>
                <span class="demonstration">~</span>
                <el-date-picker
                  v-model="queryForm.toDate"
                  type="date"
                  style="width: 140px"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickEnd"
                  placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-button type="primary"
                         icon="fas fa-download"
                         :disabled="!itemList.length"
                         :loading="exportStatus"
                         @click="onClickExport()">导 出</el-button>
            </div>
          </el-row>
          <el-row>
            <div class="mar-l-sm mar-y-xs">
              <el-button type="primary"
                        icon="fas fa-plus"
                        @click="onClickAdd()"
                        aria-hidden="true">新 增</el-button>
            </div>
          </el-row>
        </el-form>
      </div>
      <div style="height:90%;overflow-y:auto">
        <div class="project-div"
             v-for="(item,index) in itemList"
             :key="index">
          <el-form :model="item"
                   label-position="right"
                   label-width="140px">
            <el-row>
              <el-col :span="16" :class="checkFlagTitle(item.flag)">
                作业证编号：{{item.permitCode}}</el-col>
              <el-col :span="6">
                <el-button class="mar-t-sm fn-right"
                           type="primary"
                           size="mini"
                           icon="fas fa-clipboard-check"
                           @click="onClickAudit(item)">审 核</el-button>
              </el-col>
            </el-row>
            <el-row style="height:30px;">
              <el-col style="margin-top:5px;"
                      :span="6">
                <span class="project-left">申请部门：</span>
                <span class="project-subhead">{{item.deptName}}</span>
              </el-col>
              <el-col style=";margin-top:5px;"
                      :span="6">
                <el-form-item label="申请人员：">{{item.applicantName}}</el-form-item>
              </el-col>
              <el-col style=";margin-top:5px;"
                      :span="6">
                <el-form-item label="作业级别：">
                  <span v-if="item.workLevel === 0">特殊</span>
                  <span v-if="item.workLevel === 1">一般</span>
                </el-form-item>
              </el-col>
              <el-col style="float:right;margin-top:5px;"
                      :span="6">
                <el-form-item label="作业证状态：">
                  <el-button :type="item.workStatus ? 'success' : 'warning'"
                             size="mini"
                             round>{{ item.workStatus ? '已完成' : '未完成'}}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <hr :class="checkFlagHr(item.flag)" />
            <el-row>
              <el-col :span="6">
                <span class="project-left">所属年度：</span>
                <span class="project-subhead">{{item.year}}</span>
              </el-col>
              <el-col :span="6">
                <el-form-item label="计划时间：">
                  {{item.beginDate ? $tools.formatDate(item.beginDate, 'Y-m-d') : ''}} 至
                  {{item.endDate ? $tools.formatDate(item.endDate,'Y-m-d') : ''}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="涉及外来：">
                  <span v-if="item.isExternal">涉及</span>
                  <span v-else>不涉及</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="施工单位：">
                  <span>{{item.externalCompany || item.workCompany}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <span class="project-left">安全措施条数：</span>
                <span class="project-subhead">{{item.safetyMeasureCount}}条</span>
              </el-col>
              <el-col :span="6">
                <el-form-item label="安全分析条数：">{{item.safetyAnalysisCount}}条</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核人员：">{{item.auditorName}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核时间：">
                  {{item.auditDate ? $tools.formatDate(item.auditDate,'Y-m-d') : ''}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="margin:0px 0px 0px 30px;">
                <el-button style="float:left;"
                           type="primary"
                           size="mini"
                           icon="fas fa-pencil-alt"
                           @click="onClickEdit(item)">编 辑</el-button>
                <el-button style="float:left;"
                           type="primary"
                           size="mini"
                           icon="fas fa-file-invoice"
                           @click="onClickDetail(item)">详 情</el-button>
                <el-button style="float:left;"
                           type="danger"
                           size="mini"
                           icon="fas fa-trash-alt"
                           @click="onDeleteItem(item)">删 除</el-button>
                <el-button style="float:left;"
                           icon="fas fa-link"
                           :type="item.workStatus ? 'primary' : 'warning'"
                           size="mini"
                           @click="onClickMeasures(item)">安全措施</el-button>
                <el-button style="float:left;"
                           icon="fas fa-link"
                           :type="item.workStatus ? 'primary' : 'warning'"
                           size="mini"
                           @click="onClickAnalysis(item)">安全分析</el-button>
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
    <dialog-form ref="dialog" @query="getItemList" />
    <dialog-detail ref="detail" />
    <dialog-audit ref="audit" @query="getItemList"/>
    <safety-measures ref="measure" />
    <safety-analysis ref="analysis" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';
import DialogDetail from './components/DialogDetail';
import DialogAudit from './components/DialogAudit';
import SafetyMeasures from './components/SafetyMeasures';
import SafetyAnalysis from './components/SafetyAnalysis';

export default {
  name: 'ConfinedSpaceWorkManage',
  mixins: [
    queryList,
  ],
  components: {
    DialogForm,
    DialogDetail,
    DialogAudit,
    SafetyMeasures,
    SafetyAnalysis,
  },
  data() {
    return {
      url: 'wholeprocess/confinedSpaceWork',
      itemList: [],
      count: {
        inProgress: 0,
        completed: 0,
        level1: 0,
        special: 0,
      },
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        permitCode: '',
        workStatus: '',
        fromDate: '',
        toDate: '',
        sort: 'permitCode-',
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    pickStart() {
      return {
        disabledDate: (time) => {
          if (this.queryForm.toDate) {
            return time.getTime() > new Date(this.queryForm.toDate).getTime();
          }
          return false;
        },
      };
    },
    pickEnd() {
      return {
        disabledDate: (time) => {
          if (this.queryForm.fromDate) {
            return time.getTime() < new Date(this.queryForm.fromDate).getTime();
          }
          return false;
        },
      };
    },
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
  },
  methods: {
    // 新增
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 编辑
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 详情
    onClickDetail(item) {
      this.$refs.detail.openDialog(item);
    },
    // 审核
    onClickAudit(item) {
      this.$refs.audit.openDialog(item.id);
    },
    // 安全措施
    onClickMeasures(item) {
      this.$refs.measure.openDialog(item);
    },
    // 安全分析
    onClickAnalysis(item) {
      this.$refs.analysis.openDialog(item);
    },
    onDeleteItem(item) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(`${this.url}`, { data: [item.id] })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
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
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.count = response.data.data.dataStatistics;
          this.itemList = response.data.data.dataList;
          this.pager.count = response.data.count;
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
    // 导出
    onClickExport() {
      this.exportStatus = true;
      this.$http.post('wholeprocess/confinedSpaceWork/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        const fileName = `进入受限空间作业${new Date().getTime()}.xls`;
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
  height: 112.5px;
}
</style>
