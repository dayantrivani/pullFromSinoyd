<!-- 原辅料 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="关键字：">
          <el-input v-model="queryForm.name"
                    placeholder="企业名称、原辅料名称"
                    clearable
                    style="width:180px"
                    @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="CAS编号：">
          <el-input v-model="queryForm.casCode"
                    placeholder="CAS编号"
                    clearable
                    style="width:180px"
                    @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>
        <el-form-item label="物理状态：">
          <el-select v-model="queryForm.shape"
                     clearable
                     style="width: 150px;">
            <el-option v-for="(item, index) in $enum.shape"
                       :key="index"
                       :label="item"
                       :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList">查 询</el-button>
          <el-button type="primary"
                     icon="fas fa-download"
                     @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary"
                 icon="fas fa-plus"
                 @click="onClickAdd">新 增</el-button>
      <el-button type="danger"
                 icon="fas fa-trash-alt"
                 :disabled="!selectedIds.length"
                 @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table border
              highlight-current-row
              height="calc(100% - 70px)"
              v-loading="loading"
              :data="itemList"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                       type="selection"
                       width="37"></el-table-column>
      <el-table-column align="center"
                       label="No."
                       width="50"
                       type="index"
                       :index="index"></el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="67">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-pencil-alt"
                     @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName"
                       label="企业名称"
                       min-width="180"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="rawMaterialName"
                       label="原辅料名称"
                       min-width="180"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="casCode"
                       label="CAS编号"
                       show-overflow-tooltip></el-table-column>
      <el-table-column property="consumption"
                       label="生产量(t)"
                       min-width="100"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="物理状态"
                       min-width="110"
                       show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.shape[row.shape]}}
        </template>
      </el-table-column>
      <el-table-column label="原辅料类别"
                       min-width="110"
                       show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.rawMaterialType[row.rawMaterialType]}}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager"
                  @query="getItemList" />

    <!-- 弹出框 -->
    <dialog-form ref="dialog"
                 @query="getItemList" />
  </el-card>
</template>

<script>
import { queryListEnt, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';

export default {
  name: 'PSRawMaterial',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      url: 'bas/psRawMaterial',     // 数据列表加载状态
      // 查询表单绑定变量
      queryForm: {
        name: '',
        casCode: '',
        shape: '',
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
          sort: 'regionName-,psName-,rawMaterialName',
        },
      }).then((response) => {
        const filename = `原辅料${new Date().toLocaleDateString()}.xls`;
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
