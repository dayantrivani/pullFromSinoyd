<!-- 详细--罐体信息 -->
<template>
  <el-card type="title">

    <!-- 检索条件 -->
    <div class="mar-t-xs mar-l-sm">
      <el-form :model="queryForm" inline>
        <el-form-item label="所属类型：">
          <el-select v-model="queryForm.factorType" clearable  style="width: 150px">
            <el-option :value="1" label="易燃易爆"></el-option>
            <el-option :value="2" label="有毒有害"></el-option>
            <el-option :value="3" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <!-- 因子名称/因子编码： -->
        <el-form-item label="因子名称/因子编码：">
          <el-input v-model.trim="queryForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <hr>

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
      border
      highlight-current-row
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="65">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="factorName" label="因子名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorCode" label="因子编码" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column
        property="factorType"
        label="所属类型"
        min-width="60"
        show-overflow-tooltip
        :formatter="changeOne"
      ></el-table-column>
      <el-table-column property="unit" label="单位" min-width="60" show-overflow-tooltip></el-table-column>
      <el-table-column property="defaultDataType" label="缺省数据类型" width="140"></el-table-column>
      <el-table-column property="sortNum" label="排序号" width="90"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框 -->
    <dialog-form ref="dialogform" @query="getItemList" />
    <!-- <dialog-item ref="dialogitem" @query="getItemList" /> -->
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'FactorManagement',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'keypoints/majorHazardsFactors',
      // 检索表单项数据源
      queryForm: {
        factorType: '',
        name: '',
      },
      // 列表数据源
      itemList: [],
    };
  },
  methods: {
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 新增按钮
    onClickAdd() {
      this.$refs.dialogform.openDialog();
    },
    // 编辑按钮
    onClickEdit(row) {
      this.$refs.dialogform.openDialog(row);
    },
    // 改变列表的数据格式
    changeOne(row) {
      if (row.factorType === 1) {
        return '易燃易爆';
      }
      if (row.factorType === 2) {
        return '有毒有害';
      }
      if (row.factorType === 3) {
        return '其他';
      }
      return '';
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post('keypoints/majorHazardsFactors/find', this.queryForm, {
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
