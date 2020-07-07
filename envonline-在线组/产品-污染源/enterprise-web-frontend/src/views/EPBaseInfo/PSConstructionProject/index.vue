<!-- 建设项目 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关键字：">
          <el-input
            v-model="queryForm.key"
            placeholder="请输入企业/项目名称"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-input placeholder="请输入内容" v-model="queryForm.input3" class="input-with-select">
            <el-select v-model="queryForm.investmentType" slot="prepend" style="width:140px">
              <el-option label="总投资(万元)" :value="0"></el-option>
              <el-option label="环保投资(万元)" :value="1"></el-option>
            </el-select>
            <el-input></el-input>
          </el-input> -->
          <template slot="label">
            <el-select v-model="queryForm.investmentType" style="width:140px">
              <el-option label="总投资(万元)" :value="0"></el-option>
              <el-option label="环保投资(万元)" :value="1"></el-option>
            </el-select>
          </template>
          <el-input-number
            v-model="queryForm.investmentLow"
            controls-position="right"
            :precision="0"
            :min="0"
            :max="2147483647"
            clearable
            @keyup.enter.native="onQueryList()"></el-input-number>
          到
          <el-input-number
            v-model="queryForm.investmentUpper"
            controls-position="right"
            :precision="0"
            :min="0"
            :max="2147483647"
            clearable
            @keyup.enter.native="onQueryList()"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          <el-button type="primary" icon="fas fa-download" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column property="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="constructionLocation" label="建设地点" show-overflow-tooltip></el-table-column>
      <el-table-column property="totalInvestment" label="总投资(万元)" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="protectionInvestment" label="环保投资(万元)" min-width="110" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
  </el-card>
</template>

<script>
import { queryListEnt, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';

export default {
  name: 'PSConstructionProject',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      url: 'bas/psConstructionProject',
      // 查询表单绑定变量
      queryForm: {
        key: '',                // 企业名称
        investmentType: 0,      // 投资类型
        // investmentLow: 0,      // 投资额区间（低）
        // investmentUpper: 0,    // 投资额区间（高）
        sort: 'regionName+,psName+,projectName',
      },
    };
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 获取记录列表
    getItemList() {
      if (this.queryForm.investmentLow > this.queryForm.investmentUpper) {
        this.$message.warning({
          message: '请输入合适投资区间！',
          duration: 3000,
          showClose: true,
        });
        return;
      }
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
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
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export`, { ...this.queryForm }, {
        'responseType': 'blob',
        params: {
          sort: 'regionName-,psName-,projectName',
        },
      }).then((response) => {
        const filename = `建设项目${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
  },
};
</script>
