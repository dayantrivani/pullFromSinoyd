<!-- 设备管理-公用工程信息 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="类别：">
          <el-tooltip
            effect="dark"
            placement="top-start"
            :disabled="((dict.UtilitySystemCategory
              .filter((n) => n.rowGuid === queryForm.categoryCodeId)[0] || {}).dictName || '').length < 5"
            :content="(dict.UtilitySystemCategory.filter((n) => n.rowGuid === queryForm.categoryCodeId)[0] || {}).dictName">
            <el-select v-model="queryForm.categoryCodeId" clearable>
              <el-option v-for="(item, index) in dict.UtilitySystemCategory" :key="index" :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="建筑结构：">
          <el-select v-model="queryForm.buildingStructureCodeId" clearable>
            <el-option v-for="(item, index) in dict.BuildingStructure" :key="index" :label="item.dictName" :value="item.rowGuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          <el-button type="primary" icon="fas fa-download" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" style="position: relative">
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
      <el-table-column property="categoryName" label="类别" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="landOccupationArea" label="占地面积" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column property="buildingStructureName" label="建筑结构" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="mainRisk" label="主要危险性" min-width="160" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';

export default {
  name: 'UtilitySystemInfo',
  mixins: [                   // 混合
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/utilitySystemInfo',
      // 查询表单绑定变量
      queryForm: {
        psId: '', // 企业id
        categoryCodeId: '',   // 类别
        buildingStructureCodeId: '', // 建筑结构
        sort: 'categoryCodeId',
      },
      dict: { // 字典表数据
        UtilitySystemCategory: [],
        BuildingStructure: [],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    this.queryForm.psId = this.orgGuid;
    this.getDictList();
    this.$nextTick(() => {
      this.onQueryList();
    });
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
      }).then((response) => {
        const filename = `共用工程信息${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 特殊方法
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.posion{
  position: absolute;
  right: 0;
  width: 300px;
  bottom: 2px;
}
</style>
