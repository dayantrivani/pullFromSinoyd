<template>
  <dialog-modal
    scrollbar
    ref="dialogitem"
    size="middle"
    title="监控因子"
    @close="closeDialog">

    <!-- 操作按钮 -->
    <div class="mar-b-xs">
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
      height="calc(86vh - 115px)"
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
      <el-table-column property="factorName" label="因子名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorCode" label="因子编码" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="isDefaultShow" label="是否默认显示" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.isDefaultShow ? '显示' : '不显示' }}
        </template>
      </el-table-column>
      <el-table-column property="status" label="是否启用" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.status ? '启用' : '停用' }}
        </template>
      </el-table-column>
      <el-table-column property="sortNum" label="排序号" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框相关内容 -->
    <divisor-form ref="divisor" :keys="keys" @query="getItemList"></divisor-form>
  </dialog-modal>
</template>

<script>
// 引入混合 - 保存记录方法
import { queryList, deleteItem } from '@/global/libs/mixins';
import DivisorForm from './DivisorForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DivisorForm,
  },
  data() {
    return {
      url: 'keypoints/factorDisplayItem',
      loading: false,                             // 表单加载状态
      itemList: [],                               // 列表数据源
      queryData: {
        mainId: '',                                 // keyID值
      },
      keys: '',
    };
  },
  computed: {
  },
  methods: {
    // 新增监控因子
    onClickAdd() {
      this.$refs.divisor.openDialog();
    },
    // 编辑监控因子
    onClickEdit(row) {
      this.$refs.divisor.openDialog(row);
    },
    // 打开对话框
    openDialog(row) {
      this.row = Object.assign({}, row);
      this.queryData.mainId = row.id;
      this.keys = row.id;
      this.getItemList();
      this.$refs.dialogitem.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialogitem.closeDialog();
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      // this.$set(this.queryForm, 'psId', this.psInfo.id);
      this.$http.post('keypoints/factorDisplayItem/find', this.queryData, {
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
