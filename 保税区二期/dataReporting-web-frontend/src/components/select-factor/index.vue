<template>
  <dialog-modal
    scrollbar
    ref="dialog"
    size="middle"
    title="因子配置"
    min-width="750px"
    @close="closeDialog">
    <div class="fn-clear fn-no-wrap">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
      <el-form inline :model="queryForm" class="fn-right fn-no-wrap">
        <el-form-item>
          <el-select
            autofocus
            clearable
            placeholder="请选择样品类型"
            style="width: 150px"
            v-model="queryForm.sampleTypeCodeId">
            <el-option
              v-for="(item, index) in dict.DataReportingSampleType"
              :key="index"
              :label="item.dictName"
              :value="item.rowGuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input clearable placeholder="请输入因子编码" v-model="queryForm.factorCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable placeholder="请输入因子名称" v-model="queryForm.factorName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="getItemList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      highlight-current-row
      height="calc(86vh - 115px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="sampleTypeCodeIdValue"
        label="样品类型"
        min-width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="factorName" label="因子名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorCode" label="因子编码" width="110"></el-table-column>
      <el-table-column property="sortNum" label="排序值" show-overflow-tooltip></el-table-column>
      <el-table-column property="unit" label="量纲" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="remark" label="备注" width="120" show-overflow-tooltip></el-table-column>
    </el-table>

    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-form ref="form" :factorType="factorType" @query="getItemList" />

  </dialog-modal>
</template>

<script>
import DialogForm from './components/dialog-form';
import { queryList, deleteItem, saveItem } from '@/global/libs/mixins';

export default {
  name: 'SelectFactor',
  components: {
    DialogForm,
  },
  mixins: [
    queryList,
    deleteItem,
    saveItem,
  ],
  props: {
    factorType: String,
  },
  data() {
    return {
      url: 'sm/sampleFactor',
      queryForm: {
        sampleTypeCodeId: '',
        factorName: '',
        factorCode: '',
      },
      dict: {
        DataReportingSampleType: [],
      },
    };
  },
  created() {
    this.getDictList();
  },
  methods: {
    openDialog() {
      this.queryForm.sampleTypeCodeId = this.factorType;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.itemList = [];
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    onClickAdd() {
      this.$refs.form.openDialog();
    },
    onClickUpdate(row) {
      this.$refs.form.openDialog(row);
    },
  },
};
</script>
