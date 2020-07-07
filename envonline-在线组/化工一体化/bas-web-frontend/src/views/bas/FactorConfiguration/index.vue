<!-- 详细--罐体信息 -->
<template>
  <el-card fill>
    <!-- 因子显示配置 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="配置名称：">
          <el-input  v-model="queryForm.configName" style="width:185px"></el-input>
        </el-form-item>
        <el-form-item label="配置编号：">
          <el-input v-model="queryForm.configCode" style="width:185px"></el-input>
        </el-form-item>
        <el-form-item label="模块名称：">
          <el-input v-model="queryForm.moduleName" style="width:185px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      height="calc(100% - 70px)"
      border
      v-loading="loading"
       :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="36">
      </el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index">
      </el-table-column>
      <el-table-column align="center" label="操作" width="116">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="warning" icon="fas fa-cog" @click="onClickConfig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
      <el-table-column label="配置名称" prop="configName" show-overflow-tooltip min-width="290px"></el-table-column>
      <el-table-column label="配置编号" prop="configCode" show-overflow-tooltip min-width="250px"></el-table-column>
      <el-table-column label="模块名称" prop="moduleName" show-overflow-tooltip min-width="150px"> </el-table-column>
      <el-table-column label="是否启用" prop="status" show-overflow-tooltip min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? "启用" : "停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sortNum" show-overflow-tooltip min-width="100px"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialogform" @query="getItemList" />
    <dialog-item ref="dialogitem" @query="getItemList" />
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';
import DialogItem from './components/DialogItem';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'FactorConfiguration',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
    DialogItem,
  },
  data() {
    return {
      url: 'keypoints/factorDisplayMain',               // 接口地址
      // 检索表单项数据源
      queryForm: {
        configName: '',
        configCode: '',
        moduleName: '',
      },
      // 列表数据源
      itemList: [],
    };
  },
  methods: {
    // 新增按钮
    onClickAdd() {
      this.$refs.dialogform.openDialog();
    },
    // 编辑按钮
    onClickEdit(row) {
      this.$refs.dialogform.openDialog(row);
    },
    // 配置按钮
    onClickConfig(row) {
      this.$refs.dialogitem.openDialog(row);
    },
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post('keypoints/factorDisplayMain/find', this.queryForm, {
        params: { page, rows, sort: 'sortNum-' },
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
  },
};
</script>
