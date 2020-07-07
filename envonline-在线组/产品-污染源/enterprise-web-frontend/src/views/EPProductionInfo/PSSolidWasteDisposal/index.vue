<!-- 固废处置 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关键字：">
          <el-input
            v-model="queryForm.name"
            placeholder="企业名称、危险废物名称"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="危险废物类别：">
          <el-select
            v-model="queryForm.solidWasteCode"
            clearable
            filterable
            style="width: 150px;"
          >
            <el-option
              v-for="(item, index) in dict.SolidWasteCategory"
              :key="index"
              :label="item.dictName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包装方式：">
          <el-input
            v-model="queryForm.packing"
            placeholder="请输入包装方式"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="物理状态：">
          <el-select v-model="queryForm.shape" clearable style="width: 150px;">
            <el-option
              v-for="(item, index) in $enum.shape"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
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
      <el-table-column property="solidWasteName" label="危险废物名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column property="solidWasteCategory" label="危险废物类别" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column property="solidWasteCode" label="危险废物代码" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column property="majorDangerousIngredient" label="主要危险成分" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column label="物理状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.shape[row.shape]}}
        </template>
      </el-table-column>
      <el-table-column property="packing" label="包装方式" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="eiaProduction" label="环评产生量(t/a)" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="solidWasteNum" label="危险废物编号" min-width="110" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" :SolidWasteCategory="dict.SolidWasteCategory" />
  </el-card>
</template>

<script>
import { queryListEnt, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';

export default {
  name: 'PSSolidWasteDisposal',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      url: 'bas/psSolidWasteDisposal',
      // 查询表单绑定变量
      queryForm: {
        name: '',
        solidWasteCode: '',
        shape: '',
        packing: '',
        sort: 'regionName-,psName-,solidWasteName',
      },
      itemList: [],
      dict: {
        SolidWasteCategory: {},
      },
    };
  },
  beforeMount() {
    this.getDictList();
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 判断对象是否为空
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0;
    },
    // 获取字典表数据
    getDictList() {
      // 页面无需字典表时不执行
      if (this.isEmptyObj(this.dict)) { return; }
      const dictList = Object.keys(this.dict);
      // 循环请求字典表
      dictList.forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => { this.dict[key] = val; });
      }));
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
          sort: 'regionName-,psName-,solidWasteName',
        },
      }).then((response) => {
        const filename = `固废处置${new Date().toLocaleDateString()}.xls`;
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
