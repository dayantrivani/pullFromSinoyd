<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-row>
          <el-form-item label="关键字：">
            <el-input v-model="queryForm.key"
                        clearable
                        style="width:200px;"
                        placeholder="关键字">
            </el-input>
          </el-form-item>
          <el-form-item label="所属部门：">
            <el-select v-model="queryForm.deptId"
                        style="width:200px;"
                        clearable>
              <el-option v-for="(item, index) in deptList"
                      :key="index"
                      :label="item.deptName"
                      :value="item.rowGuid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属岗位：">
            <el-select v-model="queryForm.jobId"
                        style="width:200px;"
                        clearable>
              <el-option v-for="(item, index) in postList"
                      :key="index"
                      :label="item.postName"
                      :value="item.rowGuid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否存在职业病：">
            <el-select v-model="queryForm.isOccupationalDisease"
                        style="width:100px;"
                        clearable>
              <el-option label="所有" value=""></el-option>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary"
                        icon="fas fa-search"
                        @click="onQueryList()">查 询</el-button>
        </el-row>
      </el-form>
    </div>
    <el-row v-resize class="fill-h">
    <!-- 第一列：接触信息 -->
      <el-col :span="12">
        <el-card type="title" class="fill-h">
          <div class="mar-y-xs mar-l-sm">
            <el-button type="primary"
                        icon="fas fa-plus"
                        @click="onAddPerson()">新 增</el-button>
            <el-button type="danger"
                        icon="fas fa-trash-alt"
                        @click="onDeletePerson()">删 除</el-button>
            <el-button type="primary"
                         icon="fas fa-download"
                         :disabled="!itemList.length"
                         :loading="exportUserStatus"
                         @click="onClickDownloadUser()">导 出</el-button>
          </div>
          <el-table
            border
            highlight-current-row
            height="calc(100% - 30px)"
            :data="itemList"
            :row-class-name="rowClassName"
            @select="onChangeCheck"
            @select-all="onChangeCheckAll"
            @selection-change="onChangeSelected"
            @row-click="onClickRow">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center" label="No."></el-table-column>
            <el-table-column align="center" label="操作" width="67" show-overflow-tooltip>
              <template slot-scope="{ row }">
                <el-button type="primary"
                          icon="fas fa-pencil-alt"
                          @click="onEditPerson(row)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="deptName" label="所属部门">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="jobName" label="所属岗位">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="接触人员">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="isOccupationalDisease" label="是否存在职业病" width="120">
              <template slot-scope="{ row }">
                {{ row.isOccupationalDisease ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="healthCheckDate" label="最新体检时间" width="160">
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <paging-query :pager="pager" @query="getItemList"/>
        </el-card>
      </el-col>
    <!-- 第二列：职业病记录详情 -->
      <el-col :span="12">
        <el-card type="title">
          <div class="mar-y-xs mar-l-sm">
            <el-button type="primary"
                        icon="fas fa-plus"
                        @click="onAddRecord()">新 增</el-button>
            <el-button type="danger"
                        icon="fas fa-trash-alt"
                        @click="onDeleteRecord()">删 除</el-button>
            <el-button type="primary"
                         icon="fas fa-download"
                         :disabled="!recordList.length"
                         :loading="exportRecordStatus"
                         @click="onClickDownloadRecord()">导 出</el-button>
          </div>
          <el-table
            border
            ref="detail"
            height="calc(100% - 30px)"
            :data="recordList"
            :row-class-name="rowClassName"
            @selection-change="onChangeSelectRecord">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center" label="No."></el-table-column>
            <el-table-column align="center"
                       label="操作"
                       width="120"
                       show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="primary"
                          icon="fas fa-pencil-alt"
                          @click="onEditRecord(scope.row)">编辑</el-button>
                <el-button type="primary"
                          icon="fas fa-folder"
                          @click="onClickDownload(scope.row)">附件</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="contactTime" label="接触时间" width="110" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="diseaseName" label="职业病名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="harmExtent" label="危害程度" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="healthCheckDate" label="体检时间" width="110" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <paging-query :pager="pager2" @query="getRecordList"/>
        </el-card>
      </el-col>
    </el-row>
    <dialog-person ref="personDialog" @query="getItemList" ></dialog-person>
    <dialog-annex ref="annex" ></dialog-annex>
    <dialog-record ref="recordDialog" @query="updateList" :healthCheckId="queryForm2.healthCheckId"></dialog-record>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogPerson from './components/DialogPerson';
import DialogRecord from './components/DialogRecord';
import DialogAnnex from './components/DialogAnnex';

export default {
  name: 'DiseaseRecord',
  components: {
    DialogPerson,
    DialogRecord,
    DialogAnnex,
  },
  // 注册 mixins
  mixins: [queryList, deleteItem],
  data() {
    return {
      url: 'wholeprocess/occupationalDiseaseHealthCheck',
      itemList: [],
      recordList: [],
      queryForm: {
        key: '',
        deptId: '',
        jobId: '',
        isOccupationalDisease: '',
      },
      pager2: {
        page: 1,
        rows: 15,
        count: 0,
      },
      queryForm2: {
        healthCheckId: '',
        'sort': 'diseaseName+,healthCheckDate-',
      },
      exportUserStatus: false,    // 人员导出状态
      exportRecordStatus: false,  // 记录导出状态
      healthCheckId: '',
      selectRecordIds: [],
      psId: '',       // 企业id
      deptList: [],   // 部门列表
      postList: [],   // 岗位列表
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    this.psId = this.userType === 'ent' ? this.orgGuid : this.$store.state.auth.user.orgGuid;
    this.getDeptList();
    this.getPostList();
    this.onQueryList();
  },
  methods: {
    onAddPerson() {
      this.$refs.personDialog.openDialog();
    },
    onEditPerson(row) {
      this.$refs.personDialog.openDialog(row);
    },
    onDeletePerson() {
      this.$confirm('此操作将永久删除所选数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(this.url, { data: this.selectedIds })
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
    // 点击表格行的回调函数
    onClickRow(row) {
      this.queryForm2.healthCheckId = row ? row.id : '';
      this.pager2.page = 1;
      this.getRecordList();
    },
    updateList() {
      this.getItemList();
      this.getRecordList();
    },
    // 获取职业病记录
    getRecordList() {
      this.loading = true;
      const { page, rows } = this.pager2;
      this.$http.get('wholeprocess/occupationalDiseaseCheckRecord', {
        params: { page, rows, ...this.queryForm2 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.recordList = response.data.data;
          this.pager2.count = response.data.count;
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
    onAddRecord() {
      this.$refs.recordDialog.openDialog();
    },
    onEditRecord(row) {
      this.$refs.recordDialog.openDialog(row);
    },
    onChangeSelectRecord(val) {
      this.selectRecordIds = val.map(e => e.id);
    },
    onDeleteRecord() {
      this.$confirm('此操作将永久删除所选数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('wholeprocess/occupationalDiseaseCheckRecord', { data: this.selectRecordIds })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getRecordList();
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
    onClickDownloadUser() {
      this.exportUserStatus = true;
      this.$http.post('wholeprocess/occupationalDiseaseHealthCheck/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        const fileName = `接触人员${new Date().getTime()}.xls`;
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
        this.exportUserStatus = false;
      });
    },
    onClickDownloadRecord() {
      this.exportRecordStatus = true;
      this.$http.post('wholeprocess/occupationalDiseaseCheckRecord/export', this.queryForm2, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        const fileName = `体检记录${new Date().getTime()}.xls`;
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
        this.exportRecordStatus = false;
      });
    },
    // 下载附件
    onClickDownload(row) {
      this.$refs.annex.openDialog(row.id);
    },
    getDeptList() {
      this.$http.get(`sinoyd-wrybase/sys/department/guid/${this.psId}`)
        .then((response) => {
          if (response.status === 200) {
            this.deptList = response.data;
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
    getPostList() {
      this.$http.get('sinoyd-frame/sys/posts/list', {
        params: {
          pageNo: 1,
          pageSize: 999,
          postName: '',
          orgGuid: this.psId,
        },
      }).then((response) => {
        if (response.status === 200) {
          this.postList = response.data.data;
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
  },
};
</script>
