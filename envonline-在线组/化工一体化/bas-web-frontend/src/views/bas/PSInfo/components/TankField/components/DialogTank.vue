<template>
  <dialog-modal
    ref="dialogtank"
    size="middle"
    title="储罐信息"
    @close="closeDialog"
  >
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
      height="calc(86vh - 128px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="stName" label="储罐名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="stCode" label="储罐编码" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="stContent" label="装置内容" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column property="safeDistance" label="安全距离(米)" min-width="95" show-overflow-tooltip></el-table-column>
      <el-table-column property="maximumStorage" label="最大储存量(立方米)" min-width="135" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="isMajorHazards" label="是否为重大危险源" min-width="125" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.isMajorHazards ? '是' : '否' }}
        </template>
      </el-table-column>
       <el-table-column property="longitude" label="经度" min-width="70" show-overflow-tooltip></el-table-column>
        <el-table-column property="latitude" label="纬度" min-width="70" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <!-- 弹出框相关内容 -->
    <dialog-tankdata ref="tankdata" :ketid="ketid" :psids="psids" @query="getItemList" />
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogTankdata from './DialogTankdata';

export default {
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogTankdata,
  },
  data() {
    return {
      url: 'keyPoints/storageTankInfo',
      itemList: [],                       // 列表数据源
      ketid: '',
      psids: '',                          // 企业ID
    };
  },
  methods: {
    // 打开弹出框
    openDialog(row) {
      this.ketid = row.id;
      this.psids = row.psId;
      this.getItemList();
      // 显示编辑表单
      this.$refs.dialogtank.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialogtank.closeDialog();
    },
    // 新增按钮
    onClickAdd() {
      // 弹出弹出框
      this.$refs.tankdata.openDialog();
    },
    onClickEdit(row) {
      // 弹出弹出框
      this.$refs.tankdata.openDialog(row);
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      // this.$set(this.queryForm, 'psId', this.psInfo.id);
      this.$http.get('keyPoints/storageTankInfo', {
        params: {
          page,
          rows,
          tankFarmId: this.ketid,
        },
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

<style lang="sass" scoped>

</style>
