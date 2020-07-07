<template>
  <!-- 仪器型号管理 -->
  <dialog-modal ref="dialog" size="middle" title="仪器型号管理" :append-to-body="true" @close="closeDialog">

    <!-- 头部 -->
    <el-form inline>
      <el-form-item label="关键字：">
        <el-input v-model="queryForm.key" style="width: 190px;" placeholder="仪器名称、仪器编号">
        </el-input>
      </el-form-item>
      <el-form-item label="仪器类型：">
        <el-select v-model="queryForm.instrumentType" placeholder="请选择" style="width: 150px;">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in dict.InstrumentCategory" :key="index"
            :label="item.dictName" :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table
      v-loading="loading"
      border
      :data="itemList"
      height="calc(86vh - 114px)"
      highlight-current-row>
      <el-table-column align="center" label="No." width="45" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="success" icon="fas fa-check" @click="onClickEdit(scope.row)">确认</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="instrumentTypeName" label="仪器类型" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentName" label="仪器名称" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentCode" label="仪器编号" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentModel" label="仪器型号" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentNum" label="仪器数量" min-width="150" align="center"
        show-overflow-tooltip></el-table-column>
      <!-- 数据未确定 -->
      <el-table-column prop="manufacturer" label="制造厂商" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  data() {
    return {
      url: 'bas/instrumentMainInfo/',
      isAuto: false,
      queryForm: {
        key: '',
        instrumentType: '',
      },
      itemList: [],
      // 字典表 -- 常量
      dict: {
        InstrumentCategory: [],
      },
    };
  },
  methods: {
    openDialog() {
      this.$refs.dialog.openDialog();
      this.getDictList();
    },
    getItemList() { // 查询按钮
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/instrumentMainInfo/', {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200) {
          // 企业名称字段
          response.data.data.forEach((item) => {
            // 仪器类型传过来的是一串编码
            this.dict.InstrumentCategory.forEach((data) => {
              if (data.rowGuid === item.instrumentType) {
                this.$set(item, 'instrumentTypeName', data.dictName);
              }
            });
          });
          // this.tableData = response.data.data;
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
        this.loading = false;
      });
    },
    /* 特殊方法 */
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
          this.getItemList();
        });
      });
    },

    onClickEdit(val) { // 点击操作中的确认按钮
      this.$emit('getInstruData', val);
      this.$refs.dialog.closeDialog();
    },
    closeDialog() {
      this.itemList = [];
      this.selectedIds = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
