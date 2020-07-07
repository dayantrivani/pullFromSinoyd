<template>
  <!-- 浓度阈值 -->

  <!-- 主体内容 -->
  <div class="main-box">

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(86vh - 122px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column label="因子名称" prop="factorName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="上限值" prop="alertUpper" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="下限值" prop="alertLow" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="unit" min-width="90" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="是否启用" prop="status" min-width="90" show-overflow-tooltip>
        <template slot-scope="{ row }">
           {{ $enum.getLabel('APPROVAL_ISENABLE', +row.status) }}
        </template>
      </el-table-column> -->
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />
  </div>
</template>

<script>
// import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      /** 阈值列表 */
      url: 'tpeci/valveSchemeDetail',
      isAuto: false,                // 告诉混合不要在created时调取查询接口
      loading: false,               // 列表加载状态
      isShow: true,
      queryForm: {                  // 查询条件
        schemeId: '',
        type: 2,
        status: '',                 // 是否启用
        factorName: '',             // 因子名称
        sort: 'modifyDate-,factorName',
      },
      itemList: [],                 // 列表数据
    };
  },
  methods: {
    openDialog() {                  // 打开弹框
      this.queryForm.schemeId = this.mainrow.schemeId;
      this.onQueryList();
    },

    /** 请求层 */

    /** 特殊方法 */
    closeDialog() {                // 标签页对话框关闭时调取此方法
      this.selectedIds = [];
      this.queryForm = {
        schemeId: '',
        type: 2,
        status: '',                 // 是否启用
        factorName: '',             // 因子名称
        sort: 'modifyDate-,factorName',
      };
      this.itemList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
