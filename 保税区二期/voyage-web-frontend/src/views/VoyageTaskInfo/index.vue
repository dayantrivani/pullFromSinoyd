<template>
  <!-- 项目管理 -->
  <el-card>
    <!-- <template slot="header"> -->
      <el-form :model="queryForm" class="mar-t-xs mar-l-xs" inline>
        <el-form-item label="走航区域：">
          <!-- <el-input
            v-model="queryForm.psName"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input> -->
          张家港保税区（金港镇）
        </el-form-item>

        <el-form-item label="走航类型：">
          <el-select style="width:110px;" v-model="queryForm.voyageType">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $enum.get('TASK_TYPE')"
              :key="key"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="任务起止时间：">
          <el-date-picker
            style="width:135px"
            v-model="queryForm.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width:135px"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 23:59:59"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="报告状态：">
          <el-select style="width:90px;" v-model="queryForm.voyageReportStatus">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $enum.get('TASK_STATUS')"
              :key="key"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    <!-- </template> -->

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="117">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">项目详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="任务ID" prop="taskId" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="走航区域" prop="voyageArea" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="走航路线" prop="voyageRoute" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="走航日期" prop="voyageDate" min-width="152" show-overflow-tooltip></el-table-column>
      <el-table-column label="走航类型" prop="voyageType" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $enum.getLabel('TASK_TYPE', scope.row.voyageType) }}
        </template>
      </el-table-column>
      <el-table-column label="走航结果" prop="voyageResult" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- 1 正常 2 异常 3 结果未出 -->
          <span :style="{ color: scope.row.voyageResult === 2 ? 'red' : '' }">
            {{ $enum.getLabel('TASK_RESULT', scope.row.voyageResult) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="报告状态" prop="voyageReportStatus" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $enum.getLabel('TASK_STATUS', scope.row.voyageReportStatus) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-tab ref="dialog" @query="getItemList"/>
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogTab from './components/DialogTab';

export default {
  name: 'VoyageTaskInfo',
  mixins: [queryList, deleteItem],
  components: {
    DialogTab,
  },
  data() {
    return {
      url: 'voyage/taskInfo',
      isAuto: false,
      loading: false,
      queryForm: {                  // 检索表单项
        voyageType: '',             // 走航类型
        fromDate: this.$tools.formatDate(new Date(new Date().setMonth(new Date().getMonth() - 3)), 'Y-m-d 00:00:00'), // 任务起止时间
        toDate: this.$tools.formatDate(new Date(), 'Y-m-d 23:59:59'),
        voyageReportStatus: '',     // 报告状态 1 已上传 0 未上传
        sort: 'voyageDate-',
      },
      itemList: [],
    };
  },
  computed: {
  },
  created() {
    this.onQueryList();
  },
  methods: {
    // onClickAdd() {                  // 新增按钮
    //   this.$refs.dialog.openDialog();
    // },
    onClickEdit(row) {              // 项目详情
      this.$refs.dialog.openDialog(row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
