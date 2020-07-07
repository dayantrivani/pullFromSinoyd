<template>
  <div>
    <dialog-modal ref="dialog" title="装置详情" size="full" @close="closeDialog">
      <el-table :data="itemList" border stripe :height="tableHeight">
        <el-table-column align="center" type="index" width="50" label="No."></el-table-column>
        <el-table-column align="center" label="操作" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="fas fa-file-invoice"
              @click="onClickDetail(scope.row)"
            >修复历史</el-button>
            <el-button
              type="primary"
              icon="fas fa-images"
              @click="onClickDetail(scope.row)"
            >密封点图档</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="sealPointNo"
          width="180"
          label="密封点编号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="sealPointType" label="密封点类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="firstTestDate" label="首次检测日期" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.firstTestDate | date }}</template>
        </el-table-column>
        <el-table-column align="center" prop="firstTestRate" label="首次检测速率" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="isQualified" label="是否合格" show-overflow-tooltip>
          <template slot-scope="scope">{{ isQualified = scope.row.isQualified?"合格":"不合格" }}</template>
        </el-table-column>
        <el-table-column align="center" prop="postRepairRate" label="修复后速率" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="isRectify" label="是否通过整改" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          prop="currentCycleCou"
          label="本周预计排放总量"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="currentCycleReduceCou"
          label="本期减排总量"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <paging-query :pager="pager" @query="getItemList" />
    </dialog-modal>
    <seal-point-repair-history ref="history" />
  </div>
</template>

<script>
import { queryList } from '@/libs/mixins';
import SealPointRepairHistory from './SealPointRepairHistory';

export default {
  name: 'ProjectDeviceSealPoint',
  components: {
    SealPointRepairHistory,
  },
  mixins: [
    queryList,
  ],
  data() {
    return {
      tableHeight: document.body.clientHeight - 150,
      itemList: [],
      isAuto: false,
      url: '/ldar/projectDeviceSealPoint',
      queryForm: {
        projectDeviceId: '',
      },
    };
  },
  methods: {
    onClickDetail(row) {
      this.$refs.history.openDialog(row);
    },
    openDialog(row) {
      this.queryForm.projectDeviceId = row.id;
      this.onQueryList();
      this.$refs.dialog.openDialog();
    },
  },
};
</script>
