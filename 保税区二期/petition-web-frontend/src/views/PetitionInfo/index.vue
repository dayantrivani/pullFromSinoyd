<template>
  <!-- 数据管理 -->
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="交办时间：">
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
        <el-input placeholder="处理部门" v-model="queryForm.processDept" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="下级处理部门" v-model="queryForm.subProcessDept" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryForm.statuses"
          multiple
          placeholder="状态"
          style="width: 140px;"
        >
          <el-option label="待签收" value="待签收"></el-option>
          <el-option label="处办中" value="处办中"></el-option>
          <el-option label="下级处办中" value="下级处办中"></el-option>
          <el-option label="撤单" value="撤单"></el-option>
          <el-option label="办结" value="办结"></el-option>
          <el-option label="下级已反馈" value="下级已反馈"></el-option>
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
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-eye" @click="onClickEdit(scope.row)">查看</el-button>
          <el-button type="primary" icon="fas fa-map-marker-alt">定位</el-button>
        </template>
      </el-table-column>
      <el-table-column label="经度" prop="longitude" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="纬度" prop="latitude" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="网格" prop="gridName" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="服务工单编号" prop="workNo" min-width="160" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span :class="{ 'text-danger': row.condition === '报警', 'text-warning': row.condition === '预警' } ">{{row.workNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" prop="workName" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理部门" prop="processDept" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="下级处理部门" prop="subProcessDept" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="交办时间" prop="transferTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="签收时间" prop="acceptTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="应签收时间" prop="acceptEndTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理时间" prop="processTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="应处理时间" prop="processEndTime" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="部门满意" prop="deptSatisfaction" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="类型" prop="type" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <service-order-dialog ref="dialog"></service-order-dialog>
  </el-card>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { getDay } from '@/libs/tools';
import { formatDate } from '@/global/libs/tools';
import ServiceOrderDialog from '../ServiceOrderDialog';

export default {
  name: 'PetitionInfo',
  mixins: [                   // 混合
    queryList,
  ],
  components: { ServiceOrderDialog },
  data() {
    return {
      loading: false,
      url: 'petition/petitionInfo',
      queryForm: {
        fromDate: formatDate(`${new Date().getFullYear()}-01-01`),
        toDate: getDay(0, true, false),
        workNo: '', // 服务工单编号
        workName: '', // 任务名称
        processDept: '', // 处理部门
        subProcessDept: '', // 下级处理部门
        statuses: ['待签收', '处办中', '下级处办中', '下级已反馈'], // 状态（待签收、处办中、下级处办中、撤单、办结、下级已反馈）
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
      this.$refs.dialog.openDialog(item);
    },
  },
};
</script>

<style>

</style>
