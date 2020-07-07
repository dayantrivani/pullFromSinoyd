<template>
  <dialog-modal
    scrollbar
    ref="dialog"
    size="middle"
    title="监控参数"
    @close="closeDialog">

    <!-- 操作按钮 -->
    <!-- <div class="mar-b-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div> -->

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(86vh - 82px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected">
      <!-- <el-table-column align="center" type="selection" width="37"></el-table-column> -->
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="factorName" label="参数名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorCode" label="参数编号" min-width="100" show-overflow-tooltip></el-table-column>
     <el-table-column property="factorType" label="所属类型" min-width="80" show-overflow-tooltip
      :formatter="changeOne"></el-table-column>
      <el-table-column property="unit" label="单位" min-width="60" show-overflow-tooltip></el-table-column>
      <el-table-column property="alertUpper" label="二级报警阀值(高高限)" min-width="157" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="earlyAlertUpper" label="一级报警阀值(高限)" min-width="143" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="earlyAlertLow" label="低限" min-width="75" show-overflow-tooltip></el-table-column>
      <el-table-column property="alertLow" label="低低限" min-width="75" show-overflow-tooltip></el-table-column>
      <el-table-column property="sortNum" label="排序号" min-width="75" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框相关内容 -->
    <divisor-form ref="divisor" :mindid="mindid" :psids="psids" @query="getItemList"></divisor-form>
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
      url: 'keypoints/monitorFactorSetting',      // 路由地址
      itemList: [],                               // 列表数据源
      mindid: '',                              // 罐体ID
      psids: '',                                  // 企业ID
    };
  },
  computed: {
  },
  methods: {
    changeOne(row) {
      if (row.factorType === 1) {
        return '易燃易爆';
      }
      if (row.factorType === 2) {
        return '有毒有害';
      }
      if (row.factorType === 3) {
        return '其他';
      }
      return '';
    },
    // 新增监控因子
    onClickAdd() {
      // t弹出弹出框
      this.$refs.divisor.openDialog();
    },
    // 编辑监控因子
    onClickEdit(row) {
      // t弹出弹出框
      this.$refs.divisor.openDialog(row);
    },
    // 打开对话框
    openDialog(row) {
      this.row = Object.assign({}, row);
      this.mindid = row.id;
      this.psids = row.psId;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: {
          portId: this.mindid,
          page,
          rows,
          sort: 'sortNum-',
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
