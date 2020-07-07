<template>
  <!-- 用地规划 -->
  <div class="block">
    <div class="block-top">
      <upload-picture objectId="000004"/>
    </div>
    <div class="block-bottom">

      <!-- 按钮组 -->
      <div class="mar-y-xs mar-l-xs">
        <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
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
        height="calc(100% - 71px)"
        v-loading="loading"
        :data="itemList"
        @selection-change="onChangeSelected"
      >
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column label="操作" align="center" width="117">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-eye" @click="onClickEdit(scope.row)">编 辑</el-button>
          </template>
        </el-table-column>
        <el-table-column label="规划文件名称" prop="planDocName" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="规划启用时间" prop="planStartTime" min-width="160" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column label="上传文件名称" prop="uploadFileName" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="上传时间" prop="uploadFileTime" min-width="160" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="备注" prop="remark" min-width="160" show-overflow-tooltip></el-table-column>
      </el-table>

      <!-- 分页内容 -->
      <paging-query :pager="pager" @query="getItemList"></paging-query>

      <dialog-form ref="dialogform" @query="getItemList" />
    </div>
  </div>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'LandUsePlanning',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/parkLandUsePlanning', // 上传文件请求地址
      isAuto: false,      // 触发混合
      // dict: {             // 常量
      // },
      itemList: [],       // 列表数据
      loading: false,     // 加载状态
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    onClickAdd() {           // 单击新增回调
      this.$refs.dialogform.openDialog();
    },
    onClickEdit(row) {       // 单击编辑回调
      this.$refs.dialogform.openDialog(row);
    },

    /** 请求层 */
    getItemList() {          // 获取记录列表
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          sort: 'planDocName+,planStartTime-',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
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

    /* 特殊方法 */
  },
};
</script>

<style lang="scss" scoped>
.block{
  width: 100%;
  height: 100%;
  > .block-top {
    width: 100%;
    height: 50%;
    background-color: #FFF;
  }
  > .block-bottom {
    width: 100%;
    height: calc(50% - 10px);
    margin-top: 10px;
    background-color: #FFF;
    overflow: hidden;
  }
}
</style>
