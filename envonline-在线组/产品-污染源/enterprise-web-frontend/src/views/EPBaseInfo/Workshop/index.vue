<!-- 部门/车间管理 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关键字：">
          <el-input v-model="queryForm.key" placeholder="企业/车间名称" clearable style="width:220px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="负责人姓名：">
          <el-input v-model="queryForm.leaderName" placeholder="请输入负责人姓名" clearable @keyup.enter.native="onQueryList()">
          </el-input>
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
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table border highlight-current-row height="calc(100% - 70px)" v-loading="loading" :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column property="departmentName" label="车间名称" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="explain" label="车间说明" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column property="leaderName" label="负责人姓名" show-overflow-tooltip></el-table-column>
      <el-table-column property="telephone" label="联系方式" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList" />

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
  </el-card>
</template>

<script>
import { queryListEnt, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';

export default {
  name: 'PSDepartment',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      url: 'bas/psDepartment',
      // 查询表单绑定变量
      queryForm: {
        key: '',   // 企业/车间名称
        leaderName: '',       // 负责人名称
        sort: 'regionName+,psName+,departmentName',
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
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export`, { ...this.queryForm }, {
        'responseType': 'blob',
        params: {
          sort: 'regionName-,psName-,departmentName',
        },
      }).then((response) => {
        const filename = `部门/车间管理${new Date().toLocaleDateString()}.xls`;
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
