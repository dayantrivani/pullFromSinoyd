<!-- 项目建设信息 -->
<template>
  <el-card>
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item  v-if="userType === 'gov'" label="企业名称：">
          <el-select
            v-model="queryForm.psId"
            autofocus
            filterable
            clearable
            style="width:250px"
            :disabled="userType === 'ent'">
            <el-option
              v-for="(item, index) in psBaseList"
              :key="index"
              :label="item.psName"
              :value="item.psId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input
            v-model="queryForm.projectName"
            clearable
            style="width:150px">
            <!-- @keyup.enter.native="getItemList(true)"> -->
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="getItemList(true)">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
      <div class="flex-1 text-right pad-l-sm">
        <data-upload @query="getItemList" />
        <el-button
          type="primary"
          icon="fas fa-upload"
          :disabled="!itemList.length"
          @click="onClickExport()">导 出
        </el-button>
      </div>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 71px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickInfo(scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="projectDate" label="项目时间" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.projectDate | date }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()"/>

    <!-- 编辑弹框 -->
    <dialog-form ref="dialog" :doc-type="docType" @query="getItemList()" />
  </el-card>
</template>


<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import DataUpload from './components/DataUpload';

export default {
  name: 'ProjectCreateInfo',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
    DataUpload,
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    docType() {
      if (!this.dict.DocType.length) return [];
      return this.dict.DocType.filter(v => v.dictName.includes('批文'));
    },
  },
  data() {
    return {
      url: 'bas/pSProjectInfo',
      isAuto: false,
      readOnly: false,
      // 字典数据
      dict: {
        DocType: [],
      },
      // 查询表单绑定变量
      queryForm: {
        projectName: '',  // 项目名称
        psId: '',         // 企业ID
      },
      psBaseList: [],
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.getDictList();
    this.getPsBaseList();
    this.getItemList();
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row, 'edit');
    },
    // 单击详情回调
    onClickInfo(row) {
      this.$refs.dialog.openDialog(row, 'info');
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post(`${this.url}/find`, this.queryForm, {
        params: { page, rows },
      }).then((response) => {
        if (response.data.success) {
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
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, psType: -1 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
        }
      });
    },
    // 导出
    onClickExport() {
      this.exportStatus = true;
      this.$http.post('bas/pSProjectInfo/export', this.queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        // const fileName = `项目建设信息${new Date().getTime()}.xls`;
        const fileName = `项目建设信息${new Date().toLocaleDateString()}.xls`;
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
