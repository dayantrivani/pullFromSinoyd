<template>
  <div>
    <dialog-modal ref="dialog"
                  title="装置详情"
                  size="large"
                  @close="closeDialog">
      <el-form inline
               :model="queryForm">
        <el-form-item label="是否合格：">
          <el-select v-model="queryForm.isQualified"
                     clearable>
            <el-option v-for="(item,index) in $enum.isQualified"
                       :key="index"
                       :label="item"
                       :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
      <el-table border
                highlight-current-row
                height="70vh"
                v-loading="loading"
                :data="itemList"
                :row-class-name="rowClassName">
        <el-table-column align="center"
                         type="index"
                         width="50"
                         label="No."></el-table-column>
        <el-table-column align="center"
                         label="操作"
                         width="180"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button style="float:left;margin-top:5px;"
                       type="primary"
                       icon="fas fa-images"
                       @click="onClickPicture(scope.row)">密封点图档</el-button>
            <el-button v-if="scope.row.isRectify !== 0"
                       type="primary"
                       icon="fas fa-file-invoice"
                       @click="onClickDetail(scope.row)">修复历史</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="sealPointNo"
                         width="180"
                         label="密封点编号"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="sealPointType"
                         label="密封点类型"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="firstTestDate"
                         label="首次检测日期"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.firstTestDate | date }}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="firstTestRate"
                         label="首次检测速率"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="isQualified"
                         label="是否合格"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ isQualified = scope.row.isQualified?"是":"否" }}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="postRepairRate"
                         label="修复后速率"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ postRepairRate = scope.row.isQualified === true && scope.row.isRectify === 0?"--":scope.row.postRepairRate }}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="isRectify"
                         label="是否通过整改"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{isRectify = scope.row.isQualified === true && scope.row.isRectify === 0?"--":$enum.projectDeviceIsRectify[scope.row.isRectify]}}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="currentCycleCou"
                         label="本周预计排放总量"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="currentCycleReduceCou"
                         label="本期减排总量"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{currentCycleReduceCou = scope.row.isQualified === true && scope.row.isRectify === 0?"--":scope.row.currentCycleReduceCou}}</template>
        </el-table-column>
      </el-table>
      <paging-query :pager="pager"
                    @query="getItemList" />
    </dialog-modal>
    <seal-point-repair-history ref="history" />
    <file ref="docList" />
  </div>
</template>

<script>
import { queryList } from '@/libs/mixins';
import SealPointRepairHistory from './SealPointRepairHistory';
import File from './components/pectureFile';

export default {
  name: 'ProjectDeviceSealPoint',
  components: {
    SealPointRepairHistory,
    File,
  },
  mixins: [
    queryList,
  ],
  data() {
    return {
      itemList: [],
      isAuto: false,
      type: [10],
      url: 'ldar/projectDeviceSealPoint',
      queryForm: {
        projectDeviceId: '',
        isQualified: '',
      },
    };
  },
  methods: {
    onClickDetail(row) {
      this.$refs.history.openDialog(row);
    },
    onClickPicture(row) {
      this.$refs.docList.openDialog(row, this.type);
    },
    openDialog(row) {
      this.queryForm.projectDeviceId = row.id;
      this.onQueryList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.itemList = [];
      this.queryForm.projectDeviceId = '';
      this.queryForm.isQualified = '';
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
