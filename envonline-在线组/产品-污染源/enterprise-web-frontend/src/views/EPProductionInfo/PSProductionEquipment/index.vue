<!-- 生产区设备 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关键字：">
          <el-input
            v-model="queryForm.name"
            placeholder="企业名称、设备名称"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          <el-button type="primary" icon="fas fa-download" @click="onDownload" :loading="downloading">导 出</el-button>
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
      <el-table-column property="equipmentCode" label="设备系统编号" show-overflow-tooltip></el-table-column>
      <el-table-column property="equipmentName" label="设备名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="specificationType" label="规格型号" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
  </el-card>
</template>

<script>
import { queryListEnt, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'PSProductionEquipment',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      url: 'bas/psProductionEquipment',
      // 查询表单绑定变量
      queryForm: {
        name: '',
        sort: 'psName-,facilityName',
      },
      downloading: false,
      itemList: [],               // 表格列表
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
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export`, { ...this.queryForm }, {
        'responseType': 'blob',
        params: {
          sort: 'regionName-,psName-,facilityName',
        },
      }).then((response) => {
        const filename = `生产区设备${new Date().toLocaleDateString()}.xls`;
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
