<template>
  <el-card class="title-card">
    <!-- 标题内容 -->
    <template slot="header">{{title}}</template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        :disabled="addDisabled"
        @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
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
      @select="_select"
      @select-all="_selectAll"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="factorName" label="因子名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="dgiMn" label="计算类型" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          {{['污染物', '参数'][scope.row.category]}}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <add-factors-dialog ref="dialog" :title="title" @onQuerylist="getItemList"></add-factors-dialog>
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/plugins/mixins';
import AddFactorsDialog from './AddFactorsDialog';

export default {
  name: 'FactorsConfig',
  components: { AddFactorsDialog },
  mixins: [queryList, deleteItem],
  props: {
    title: {
      default: '',
    },
  },
  data() {
    return {
      isAuto: false,
      url: 'cfg/transferEffectiveFactors',
      portType: 1, // 排口类型
      configType: 1, // 配置类型
      addDisabled: true, // 新增按钮禁用
      queryForm: {
        category: 1,
        configId: 1,
      },
      itemList: [],
    };
  },
  methods: {
    rowClassName({ rowIndex }) {
      const className = 'selected-row';
      return this.selectedIndex.includes(rowIndex) ? className : '';
    },
    onClickAdd() {
      this.$refs.dialog.openDialog({
        portType: this.portType,
        configId: this.queryForm.configId,
        configType: this.configType,
        category: this.queryForm.category,
      });
    },
    // 点击配置树后改变id
    setConfigId(item) {
      this.addDisabled = item.addDisabled;
      this.portType = item.portType;
      this.configType = item.configType;
      this.queryForm.configId = item.id;
      this.queryForm.category = item.category;
      this.getItemList();
    },
    // 删除记录
    onDeleteItem() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(`${this.url}`, { data: this.selectedIds })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>

<style>

</style>
