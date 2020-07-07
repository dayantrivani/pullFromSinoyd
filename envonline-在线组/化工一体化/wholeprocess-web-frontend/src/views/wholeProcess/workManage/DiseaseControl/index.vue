<template>
  <div>
    <el-card class="project">
      <div slot="header"
           class="clearfix">
        <el-form inline
                 :model="queryForm"
                 style="overflow: hidden;">
          <el-row>
            <el-form-item label="职业病名称：">
              <el-input v-model="queryForm.diseaseName"
                          clearable
                          style="width:200px;"
                          placeholder="职业病名称">
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
            <el-button type="primary"
                         icon="fas fa-search"
                         @click="onQueryList()">查 询</el-button>
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
             v-for="(item, index) in itemList"
             :style="{ height: `${Math.ceil(item.deptList.length / 4) * 40 + 90}px`}"
             :key="index">
          <el-form :model="item"
                   label-position="right"
                   label-width="30px">
            <el-row>
              <el-col :span="16" class="project-title">
                职业病名称：{{ item.diseaseName }}</el-col>
            </el-row>
            <hr :class="checkFlagHr(1)" />
            <el-row>
              <el-col :span="6" v-for="(dept, index) in item.deptList" :key="index">
                <el-form-item>
                  <el-tag size="medium" type="warning">{{dept.deptName}} {{dept.numOfperson}}人</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="margin:5px 0px 0px 30px;">
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
                           type="primary"
                           size="mini"
                           @click="onClickAnnex(item)">附 件</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-card>
    <dialog-form ref="dialog" @query="getItemList" />
    <dialog-detail ref="detail" />
    <dialog-annex ref="annex" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';
import DialogDetail from './components/DialogDetail';
import DialogAnnex from './components/DialogAnnex';

export default {
  name: 'DiseaseControl',
  mixins: [
    queryList,
  ],
  components: {
    DialogForm,
    DialogDetail,
    DialogAnnex,
  },
  data() {
    return {
      url: 'wholeprocess/occupationalDisease2Person',
      isAuto: false,
      itemList: [],
      psId: '',
      queryForm: {
        diseaseName: '',
        deptId: '',
        jobId: '',
        sort: 'diseaseName+',
      },
      deptList: [],
      postList: [],
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
    // 新增
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 详情
    onClickDetail(item) {
      this.$refs.detail.openDialog(item.diseaseId);
    },
    // 附件信息
    onClickAnnex(item) {
      this.$refs.annex.openDialog(item.diseaseId);
    },
    // 删除
    onDeleteItem(item) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('wholeprocess/occupationalDisease', { data: [item.diseaseId] })
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
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      // const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
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
    checkFlagHr(flag) {
      switch (flag) {
        case 1: return 'project-hr-special';
        default: return 'project-hr';
      }
    },
  },
};
</script>

<style>
.project-div {
  width: calc(50% - 30px);
  /* height: 120px; */
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
  height: 80px;
}
</style>
