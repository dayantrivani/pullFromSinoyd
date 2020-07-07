<template>
<!-- 安全管理组织信息 -->
  <el-card type="title" v-loading="loading">
    <template slot="header">安全管理组织信息</template>
    <div class="title-info mar-t-xs mar-l-sm">组织信息</div>
    <div class="mar-y-xs mar-l-sm fill-auto">
      <el-button type="primary" icon="fas fa-save" @click="onSaveItem">保 存</el-button>
      <!-- <el-button icon="fas fa-times" @click="onClickClose">关 闭</el-button> -->
    </div>
    <hr class="mar-x-sm">
    <el-form label-width="211px" class="item-space mar-x-sm mar-t-xs" :model="formModel" v-loading="formLoad">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="安全管理机构名称：">
            <el-input v-model="formModel.organizationName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="安全生产管理人数(人)：">
            <el-input-number
              v-model="formModel.managementNumber"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="从业人数(人)：">
            <el-input-number
              v-model="formModel.employmentNumber"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="应缴纳工伤保险员工人数(人)：">
            <el-input-number
              v-model="formModel.shouldPayInjuryInsuranceNumber"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际缴纳工伤保险员工人数(人)：">
            <el-input-number
            v-model="formModel.actualPayInjuryInsuranceNumber"
            controls-position="right"
            :min="0"
          ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="企业组织架构图：">
            <upload-picture ref="architecture" :limit="3" :docTypeId="1"></upload-picture>
          </el-form-item>
        </el-col>
      <!-- </el-row> -->
      <!-- <el-row :gutter="10"> -->
        <el-col :span="12">
          <el-form-item label="安全管理机构图：">
            <upload-picture ref="organization" :limit="3" :docTypeId="2"></upload-picture>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr class="mar-x-sm block">
    <div class="title-info mar-t-xs mar-l-sm">人员信息</div>
    <div class="mar-y-xs mar-l-sm fill-auto">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem(getItemList)"
      >删 除</el-button>
    </div>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 386px)"
      v-loading="tableLoad"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="70">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="人员姓名" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="手机" prop="mobilePhone" show-overflow-tooltip></el-table-column>
      <el-table-column label="人员类别" prop="personnelCategoryCodeId" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ personCategory.find(e => e.rowGuid === row.personnelCategoryCodeId)
            && personCategory.find(e => e.rowGuid === row.personnelCategoryCodeId).dictName }}
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <dialog-form ref="dialog" @query="getItemList"></dialog-form>
  </el-card>
</template>

<script>
import UploadPicture from '@/components/upload-picture';
import { deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { mapState } from 'vuex';
import DialogForm from './components/DialogForm';

export default {
  name: 'SafetyManageOrgInfo',
  mixins: [deleteItem],
  components: { DialogForm, UploadPicture },
  data() {
    return {
      url: 'bas/manageOrgPerson',
      personCategory: [],
      loading: false,
      formLoad: false,
      tableLoad: false,
      formModel: {},
      selectedIds: [],
      itemList: [],
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  created() {
    this.getOrganizeAndPersonInfo();
    this.getPersonCategory();
  },
  watch: {},
  computed: {
    // 企业信息
    ...mapState({
      psInfo: state => state.psInfo,
    }),
    isEidt() {
      return !!this.formModel.id;
    },
  },
  methods: {
    // 获取人员类别
    getPersonCategory() {
      this.$store.dispatch('dict/GET_SELECT_TYPE', 'SafetyManageOrgPersonnelCategory')
        .then((response) => {
          this.personCategory = response;
        });
    },
    // 获取组织信息及组织下的人员信息
    getOrganizeAndPersonInfo() {
      const { page, rows } = this.pager;
      this.loading = true;
      this.$http.get('bas/safetyManageOrgInfo', {
        params: {
          page,
          rows,
          psId: this.psInfo.id,
        },
      }).then((response) => {
        if (response.data.success) {
          this.formModel = response.data.data || {};
          this.$refs.architecture.getImg(this.formModel.id);
          this.$refs.organization.getImg(this.formModel.id);
          this.itemList = this.formModel.dtoManageOrgPerson || [];
          this.pager.count = response.data.count || 0;
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: response.data.msg,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 获取组织信息
    getOrganizeInfo() {
      this.formLoad = true;
      this.$http.get(`bas/safetyManageOrgInfo/${this.psInfo.id}`)
        .then((response) => {
          if (response.data.success) {
            this.formModel = response.data.data || {};
            this.getItemList();
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              message: response.data.msg,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.formLoad = false;
        });
    },
    // 获取人员信息
    getItemList() {
      if (!this.formModel.id) { return; }
      this.tableLoad = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/manageOrgPerson', {
        params: {
          rows,
          page,
          organizationInfoId: this.formModel.id,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data || [];
          this.pager.count = response.data.count;
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: response.data.msg,
          });
        }
      }, (({ response }) => {
        analyzeResp(response);
      })).finally(() => {
        this.tableLoad = false;
      });
    },
    // 表格勾选
    onChangeSelected(rows) {
      this.selectedIds = rows.map(row => row.id);
    },
    // 点击新增
    onClickAdd() {
      const data = { organizationInfoId: this.formModel.id, psId: this.psInfo.id };
      this.$refs.dialog.openDialog(data);
    },
    // 点击编辑
    onClickEdit(item) {
      this.$refs.dialog.openDialog(item);
    },
    // 保存组织信息
    onSaveItem() {
      this.formLoad = true;
      this.formModel.psId = this.psInfo.id;
      this.$http[this.isEidt ? 'put' : 'post']('bas/safetyManageOrgInfo', this.formModel)
        .then((response) => {
          if (response.data.success) {
            this.formModel = response.data.data;
            this.$refs.architecture.onUpload(this.formModel.id);
            this.$refs.organization.onUpload(this.formModel.id);
            this.$message({
              showClose: true,
              type: 'success',
              message: response.data.msg,
            });
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              message: response.data.msg,
            });
          }
        }, ({ response }) =>  {
          analyzeResp(response);
        }).finally(() => {
          this.formLoad = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
