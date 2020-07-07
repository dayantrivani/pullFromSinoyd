<template>
  <dialog-modal
    ref="dialog"
    size="small"
    scrollbar
    view
    title="发展历程维护"
    @close="closeDialog">
    <!-- 按钮组 -->
    <div class="mar-b-xs mar-l-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 65px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="时间节点" prop="nodeDate" min-width="120" show-overflow-tooltip>
        <template slot-scope="{ row }">{{ row.nodeDate && row.nodeDate.split(' ')[0] }}</template>
      </el-table-column>
      <el-table-column label="显示内容" prop="eventContent" min-width="220" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-form ref="dialogform" @query="getItemList" />
  </dialog-modal>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './DialogForm';

export default {
  // 使用混合
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/parkDevelopHistory',        // 必须, 接口地址
      isAuto: false,
      loading: false,               // 表单加载状态
      queryForm: {
        sort: 'nodeDate+',
      },
      itemList: [],
    };
  },
  methods: {
    openDialog() {     // 打开对话框
      this.$refs.dialog.openDialog();
      this.onQueryList();
    },

    onClickEdit(row) {          // 编辑
      this.$refs.dialogform.openDialog(row);
    },
    onClickAdd() {           // 单击新增回调
      this.$refs.dialogform.openDialog();
    },


    /** 请求接口 */

    /** 特殊方法 */
    closeDialog() {       // 关闭对话框
      this.$emit('query');
      this.itemList = [];
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
