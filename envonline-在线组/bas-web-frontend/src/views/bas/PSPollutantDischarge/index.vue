<!-- 重点排污单位 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="行政区域：">
          <select-tree-lazy v-model="queryForm.regionCodeId" />
        </el-form-item>
        <el-form-item label="重点排污单位名称：">
          <el-input
            v-model="queryForm.psName"
            placeholder="请输入重点排污单位"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="年份：">
          <el-date-picker
            v-model="queryForm.ye"
            value-format="yyyy"
            type="year"
            :clearable="true"
            placeholder="请选择"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="名录类别：">
          <el-select
            v-model="queryForm.categoryList"
            clearable
            multiple
            collapse-tags
            style="width: 150px;"
          >
            <el-option
              v-for="(item, index) in $enum.keyPollutantCategory"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          <el-button type="primary" icon="fas fa-upload" @click="onDownload">导 出</el-button>
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
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <!-- <el-button type="primary" icon="el-icon-view">预览</el-button> -->
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="regionName" label="行政区域" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column property="psName" label="重点排污单位名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column property="ye" label="年份" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column property="categoryName" label="名录类别" min-width="180" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
  </el-card>
</template>

<script>
import { queryList } from '@/plugins/mixins';
import DialogForm from './components/DialogForm';
import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';

export default {
  name: 'PSSolidWasteDisposal',
  mixins: [                   // 混合
    queryList,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
    SelectTreeLazy,
  },
  data() {
    return {
      url: 'bas/psPollutantDischarge/query',
      // 查询表单绑定变量
      queryForm: {
        psName: '',
        ye: '',
        regionCodeId: '',
        categoryList: [],
      },
      itemList: [],
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    onSaveSelected(selection) { // 表格选中的数据id
      this.selectedIds = selection.map(val => val.id);
    },
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      return new Promise((resolve) => {
        this.$http.post(this.url, {
          ...this.queryForm,
        }, {
          params: {
            page,
            rows,
            sort: 'regionName+,psName',
          },
        }).then((response) => {
          if (response.data.success) {
            this.itemList = response.data.data;
            this.pager.total = response.data.count;
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
          resolve(response);
        }).finally(() => {
          this.loading = false;
        });
      });
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 删除记录
    onDeleteItem(callback) {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/psPollutantDischarge', { data: this.selectedIds })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          if (callback) {
            callback(this.selectedIds);
          } else {
            this.getItemList();
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, () => {});
    },
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post('bas/psPollutantDischarge/export', { ...this.queryForm, sort: 'regionName+,psName' }, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `重点排污单位${new Date().toLocaleDateString()}.xls`;
        this.downloadFile(response, filename);
      }).finally(() => {
        this.downloading = false;
      });
    },
    downloadFile(response, fileName) {
      const fileBlob = new Blob([response.data], { type: 'application/x-xls' });
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(fileBlob, fileName);
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(fileBlob);
        link.download = fileName || decodeURI(response.headers['content-disposition']).split('=')[1];
        document.body.appendChild(link);  // fix: 修复在火狐未触发下载问题
        link.click();
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }
    },
  },
};
</script>
