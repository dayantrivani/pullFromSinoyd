<template>
  <!-- 污染物批量配置 -->
  <dialog-modal ref="dialog" title="污染物批量配置" size="middle"
    :append-to-body="true" @close="beforeCloseDialog"
  >

    <!-- 查询条件 -->
    <el-form inline :model="queryForm">
      <el-form-item>
        <el-input v-model="queryForm.factorCode" placeholder="请输入编码" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryForm.oldFactorCode" placeholder="请输入原编码" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryForm.factorName" placeholder="请输入中文名称" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        <el-button
          type="success"
          icon="fas fa-check"
          :disabled="!selectedIds.length"
          @click="onClickAdd">确 认
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table border ref="itemList"  height="calc(86vh - 142px)" v-loading="loading"
      :data="itemList" highlight-current-row @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="factorCode" label="编码" min-width="120"></el-table-column>
      <el-table-column property="factorName" label="中文名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="oldFactorCode" label="原编码" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="unit" label="单位(浓度)" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="unitCou" label="单位(排放量)" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="defaultDataType" label="省缺数据类型" min-width="120" show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
// 引入混合 - 保存记录方法
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  data() {
    return {
      url: 'cfg/factors/',
      isAuto: false,
      queryForm: {
        factorCode: '',      // 编码
        oldFactorCode: '',   // 原编码
        factorName: '',      // 中文名称
      },
      itemList: [],
    };
  },
  methods: {
    // 打开弹框
    openDialog(val) {
      this.$set(this.queryForm, 'category', val);
      this.$refs.dialog.openDialog();
      this.onQueryList();
    },
    // 确认按钮
    onClickAdd() {
      this.$emit('add', { selectedIds: this.selectedIds });
    },
    // 数据选中状态修改时
    onChangeSelected(val) {
      this.selectedIds = val;
    },
    // 获取空对象
    getEmptyItem() {
      return {
        factorCode: '',      // 编码
        oldFactorCode: '',   // 原编码
        factorName: '',      // 中文名称
      };
    },
    closeDialog() {
      this.queryForm = {
        factorCode: '',      // 编码
        oldFactorCode: '',   // 原编码
        factorName: '',      // 中文名称
      };
      this.itemList = [];
      this.selectedIds = [];
      this.$refs.dialog.closeDialog();
    },
    // dialog框关闭前的回调
    beforeCloseDialog() {
      this.queryForm = this.getEmptyItem();
      this.itemList = [];
      this.selectedIds = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
