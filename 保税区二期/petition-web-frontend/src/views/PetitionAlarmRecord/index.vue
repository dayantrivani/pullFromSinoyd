<template>
  <!-- 逾期记录 -->
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="应处理时间：">
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
          @change="onQueryList"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
          @change="onQueryList"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="服务工单编号" v-model="queryForm.workNo" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="任务名称" v-model="queryForm.workName" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="网格" v-model="queryForm.gridName" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryForm.status"
          placeholder="状态"
          clearable
          style="width: 140px;"
        >
          <el-option label="未消警" :value="0"></el-option>
          <el-option label="已消警" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 32px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-eye" @click="onClickEdit(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="网格名称" prop="gridName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="服务工单编号" prop="workNo" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="任务名称" prop="workName" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理部门" prop="processDept" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理时间" prop="processTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="应处理时间" prop="processEndTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="逾期时间" prop="overdueTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.status ? '已消警' : '未消警'}}
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <service-order-dialog ref="dialog"></service-order-dialog>
  </el-card>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import { analyzeResp } from '@/global/libs/util';
import ServiceOrderDialog from '../ServiceOrderDialog';

export default {
  name: 'PetitionAlarmRecord',
  mixins: [                   // 混合
    queryList,
  ],
  components: { ServiceOrderDialog },
  data() {
    return {
      loading: false,
      url: 'petition/alarmRecord',
      queryForm: {
        fromDate: getDay(-29, false, false),
        toDate: getDay(0, false, false),
        workNo: '', // 服务工单编号
        petitionInfoId: '', // 信访主键id
        workName: '', // 任务名称
        gridName: '', // 网格名称
        status: '', // 状态（0未消警，1已消警）
        sort: 'gridName+',
      },
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
      itemList: [],
    };
  },
  methods: {
    onClickEdit(item) {
      this.getPetitionInfo(item.petitionInfoId);
    },
    // 获取记录列表
    getPetitionInfo(id) {
      this.$http.get('petition/petitionInfo', {
        params: { id },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$refs.dialog.openDialog(response.data.data[0]);
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
  },
};
</script>

<style>

</style>
