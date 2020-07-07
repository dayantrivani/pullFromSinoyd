<template>
  <div>
    <dialog-modal ref="dialog"
                  maxScrollbar
                  title="项目详情"
                  size="large"
                  @close="closeDialog">
      <el-form inline
               :model="queryForm">
        <el-form-item label="装置名称：">
          <el-input v-model="queryForm.deviceName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList">查 询</el-button>
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
                         width="100"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="fas fa-file-invoice"
                       @click="onClickDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left"
                         prop="deviceName"
                         label="装置名称"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="deviceType"
                         width="120"
                         label="装置类型"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="totalSealPoint"
                         width="120"
                         label="总密封点"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="testPoint"
                         width="150"
                         label="本次检测密封点"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="leakagePoint"
                         width="160"
                         label="首次泄露密封点数量"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="status"
                         width="120"
                         label="当前状态"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{$enum.projectDeviceStatus[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="firstTestRate"
                         width="130"
                         label="首次检测速率"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         prop="postTestRate"
                         width="130"
                         label="通过检测后速率"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{postTestRate = scope.row.status===2?"--":scope.row.postTestRate}}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="currentCycleCou"
                         width="150"
                         label="本周预计排放总量"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{currentCycleCou = scope.row.status===2?"--":scope.row.currentCycleCou}}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="currentCycleReduceCou"
                         width="150"
                         label="此周期减排总量"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{currentCycleReduceCou = scope.row.status===2?"--":scope.row.currentCycleReduceCou}}</template>
        </el-table-column>
      </el-table>
      <paging-query :pager="pager"
                    @query="getItemList" />
    </dialog-modal>
    <project-device-seal-point ref="sealPoint" />
  </div>
</template>

<script>
import { queryList } from '@/libs/mixins';
import ProjectDeviceSealPoint from './ProjectDeviceSealPoint';

export default {
  name: 'ProjectDevice',
  components: {
    ProjectDeviceSealPoint,
  },
  mixins: [
    queryList,
  ],
  data() {
    return {
      itemList: [],
      isAuto: false,
      url: 'ldar/projectDevice',
      queryForm: {
        deviceName: '',
        projectId: '',
      },
    };
  },
  methods: {
    onClickDetail(row) {
      this.$refs.sealPoint.openDialog(row);
    },
    openDialog(id) {
      this.queryForm.projectId = id;
      this.$refs.dialog.openDialog();
      this.onQueryList();
    },
    closeDialog() {
      this.itemList = [];
      this.queryForm.deviceName = '';
      this.queryForm.projectId = '';
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
