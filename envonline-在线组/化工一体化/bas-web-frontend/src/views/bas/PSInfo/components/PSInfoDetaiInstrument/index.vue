<template>
  <!-- 仪器管理 -->
  <el-card type="title">

    <!-- 头部 -->
    <template slot="header">仪器管理</template>

    <!-- 查询条件 -->
    <el-form class=" mar-x-sm mar-t-sm" inline>
      <el-form-item label="关键字：">
        <el-input v-model="queryForm.key" style="width: 220px;"
          placeholder="仪器名称、仪器编号、站点名称"></el-input>
      </el-form-item>
      <el-form-item label="仪器类型：">
        <el-select v-model="queryForm.instrumentType">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in dict.InstrumentCategory" :key="index"
            :label="item.dictName" :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="queryForm.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in $enum.instrumentStatus" :key="index"
           :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>

    <!-- 按钮组 -->
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
      v-loading="loading"
      height="calc(100% - 113px)"
      border
      :data="itemList"
      highlight-current-row
      @selection-change="selectionChange">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="instrumentType" label="仪器类型" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ getInstrumentTypeName(row.instrumentType) }}
        </template>
      </el-table-column>
      <el-table-column prop="instrumentName" label="仪器名称" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentCode" label="仪器编号" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentModel" label="仪器型号" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="psId" label="污染源名称" min-width="150" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">{{ row.psId ? psInfo.psName : '' }}</template>
      </el-table-column>
      <el-table-column prop="portName" label="点位名称" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="effectiveDate" label="有效期" min-width="150" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" min-width="80" align="center"
        show-overflow-tooltip>
        <template slot-scope="{ row }">{{ $enum.instrumentStatus[row.status].label }}</template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 新增仪器信息 -->
    <form-item-ins-dialog ref="add" @query="getItemList"/>

    <!-- 编辑仪器信息 -->
    <Tabs-ins-dialog ref="edit" @query="getItemList"/>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import FormItemInsDialog from './components/FormItemInsDialog.vue';
import TabsInsDialog from './components/TabsInsDialog.vue';

export default {
  name: 'PSInfoDetaiInstrument',
  mixins: [queryList, deleteItem],
  components: {
    FormItemInsDialog,
    TabsInsDialog,
  },
  data() {
    return {
      url: 'bas/instrument/',
      loading: false,
      isAuto: false,
      queryForm: {
        psId: '',
        key: '',
        instrumentType: '',
        status: '',
      },
      itemList: [
        // { id: '1234' },
        // { id: '3142' },
      ],
      // 字典表常量
      dict: {
        InstrumentCategory: [],
      },
    };
  },
  computed: {
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  created() {
    this.$set(this.queryForm, 'psId', this.psInfo.id);
    this.getDictList();
    this.getItemList();
  },
  methods: {
    selectionChange(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    onClickAdd() {
      this.$refs.add.openDialog(this.psInfo.id);
    },
    onClickEdit(row) {
      this.$refs.edit.openDialog(row);
    },
    onDeleteItem() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/instrument/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          this.getItemList();
          this.selectedIds = [];
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },

    /* 特殊方法 */
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },
    // 获取仪器类型名称
    getInstrumentTypeName(val) {
      return this.dict.InstrumentCategory.filter(item => item.rowGuid === val)[0].dictName;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
