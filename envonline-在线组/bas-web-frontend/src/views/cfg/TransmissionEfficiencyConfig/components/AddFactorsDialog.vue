<template>
  <dialog-modal
    ref="dialog"
    size="middle"
    :title="`新增${title}`"
    @close="closeDialog">
    <el-form
      class="pad-x-sm"
      ref="form"
      label-position="right"
      inline
      :model="queryForm">
      <el-form-item label="因子名称：">
        <el-input
          v-model="queryForm.factorName"
          clearable
          style="width:160px"
          @keyup.enter.native="onQueryList"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button
          type="success"
          icon="fas fa-check"
          v-loading="checkLoading"
          :disabled="!selectedIds.length"
          @click="onClickCheck">确 认</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      class="scroll"
      style="height: calc(100% - 70px);"
      border
      highlight-current-row
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="_select"
      @select-all="_selectAll"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="factorCode" label="因子编码" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorName" label="因子名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="unit" label="浓度单位" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="defaultDataType" label="缺省类型" min-width="130" show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import { queryList } from '@/plugins/mixins';

export default {
  name: 'AddFactorsDialog',
  mixins: [queryList],
  props: {
    title: {
      default: '',
    },
  },
  data() {
    return {
      isAuto: false,
      url: 'cfg/factors',
      category: 1, // 1 污染物因子  2 参数因子
      queryForm: {
        factorName: '',
        category: 1,
      },
      configId: 1,
      configType: 1,
      checkLoading: false,
      itemList: [],
    };
  },
  methods: {
    rowClassName({ rowIndex }) {
      const className = 'selected-row';
      return this.selectedIndex.includes(rowIndex) ? className : '';
    },
    openDialog(item) {
      this.$set(this, 'configId', item.configId);
      this.$set(this, 'configType', item.configType);
      this.$set(this, 'category', item.category);
      this.queryForm.category = item.portType;
      this.onQueryList();
      this.$refs.dialog.openDialog();
    },
    onClickCheck() { // 点击确认新增节点
      this.checkLoading = true;
      let factorList = this.itemList.filter(n => this.selectedIds.includes(n.id));
      factorList = factorList.map(n => ({
        factorCode: n.factorCode,
        factorName: n.factorName,
        factorId: n.id,
      }));
      this.$http.post('cfg/transferEffectiveFactors', {
        configId: this.configId,
        configType: this.configType,
        category: this.category,
        factorsList: factorList,
      }).then((response) => {
        if (response.data.code === 200) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          this.$refs.dialog.closeDialog();
          this.$emit('onQuerylist');
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }).finally(() => {
        this.checkLoading = false;
      });
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>

<style>
.scroll .el-table__body-wrapper.is-scrolling-none {
  height: calc(100% - 35px);
  overflow-y: auto;
}
</style>
