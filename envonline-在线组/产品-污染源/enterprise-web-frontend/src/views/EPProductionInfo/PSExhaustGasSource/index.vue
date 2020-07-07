<!-- 废气源 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关键字：">
          <el-input
            v-model="queryForm.name"
            placeholder="企业名称、废气源名称"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="产生源类别：">
          <el-select v-model="queryForm.sourceCategory" clearable style="width: 150px;">
            <el-option
              v-for="(item, index) in $enum.sourceCategorys"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收集方式：">
          <el-select v-model="queryForm.collectionMethod" clearable style="width: 150px;">
            <el-option
              v-for="(item, index) in $enum.collectionMethods"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
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
      <el-table-column property="exhaustGasSourceName" label="废气源名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column property="exhaustGasSourceCode" label="废气源编号" min-width="120" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column property="longitude" label="经度" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="latitude" label="纬度" min-width="90" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="产生源类别" min-width="110" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.sourceCategorys[row.sourceCategory]}}
        </template>
      </el-table-column>
      <el-table-column label="收集方式" min-width="110" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.collectionMethods[row.collectionMethod]}}
        </template>
      </el-table-column>
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

export default {
  name: 'PSExhaustGasSource',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      url: 'bas/psExhaustGasSource',     // 数据列表加载状态
      // 查询表单绑定变量
      queryForm: {
        name: '',
        sourceCategory: '',
        sort: 'psName+,exhaustGasSourceName',
      },
      itemList: [],
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
  },
};
</script>
