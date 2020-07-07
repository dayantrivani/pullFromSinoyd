<template>
  <div>
    <!-- 检索栏 -->
    <!-- <el-form inline :model="queryForm">
      <el-row class="mar-t-xs">
        <el-col :span="18">
          <el-form-item label="监测指标：">
            <el-select v-model="queryForm.monitoringIndex" clearable>
              <el-option
                v-for="(item,index) in $enum.monitoringIndex"
                :key="index"
                :label="item"
                :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="fas fa-search"
              :disabled="!bodyItem.itemType"
              @click="onQueryList">查 询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="fas fa-cloud-download-alt"
              :disabled="!bodyItem.itemType"
              @click="onClickDownload">批量打包下载</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="fas fa-cloud-download-alt">批量打包下载</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr class="mar-x-0 mar-t-0"> -->
    <!-- 操作按钮 -->
    <div class="mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        :disabled="!bodyItem.itemType"
        @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length || !bodyItem.itemType"
        @click="onDeleteItem()">删 除
      </el-button>
      <el-button
        type="primary"
        icon="fas fa-cloud-download-alt"
        :disabled="!bodyItem.itemType"
        @click="onClickDownload">批量打包下载</el-button>
    </div>

    <!-- 列表内容 -->
    <div style="margin:0 -10px">
      <el-table
        border
        highlight-current-row
        height="calc(87vh - 180px)"
        v-loading="loading"
        :data="itemList"
        :row-class-name="rowClassName"
        @select="onChangeCheck"
        @select-all="onChangeCheckAll"
        @selection-change="onChangeSelected">
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column align="center" label="操作" width="70">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="fas fa-pencil-alt"
              :disabled="!bodyItem.itemType"
              @click="onClickEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column property="monitoringTypeCodeIdValue" label="监测类型" min-width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="monitoringIndex" label="监测指标" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{$enum.monitoringIndex[scope.row.monitoringIndex]}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="监测时间" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.reportingPeriod === 1">
              {{scope.row.monitoringDate ? scope.row.monitoringDate.split(' ')[0] : ''}}
            </span>
            <span v-else-if="scope.row.reportingPeriod === 2">
              {{$enum.monitoringMonth[scope.row.monitoringMonth]}}
            </span>
            <span v-else-if="scope.row.reportingPeriod === 3">
              {{$enum.monitoringQuarter[scope.row.monitoringQuarter]}}
            </span>
            <span v-else-if="scope.row.reportingPeriod === 4">
              {{$enum.monitoringYearHalf[scope.row.monitoringYearHalf]}}
            </span>
          </template>
        </el-table-column>
        <el-table-column property="reportingDate" label="填报时间" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.reportingDate ? scope.row.reportingDate.split(' ')[0] : ''}}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 弹出框内容 -->
    <dialog-data ref="dialogData" @query="getItemList"/>

    <!-- 批量打包下载内容 -->
    <dialog-downlode ref="dialogDownlode"/>
  </div>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogData from './DialogData';
import DialogDownlode from './DialogDownlode';

export default {
  // 传入参数项
  props: {
    bodyItem: { // 联动查询条件
      type: Object,
    },
  },
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogData,
    DialogDownlode,
  },
  data() {
    return {
      url: 'sm/schemeReportData',            // 接口地址
      isAuto: false,
      queryForm: {                           // 检索表单项
        monitoringIndex: '',                // 监测指标
      },
      itemList: [],                         // 列表数据源
    };
  },
  computed: {},
  methods: {
    // 当选择项发生变化时会触发该事件
    onChangeSelected(option) {
      this.selected = option;
      this.selectedIds = option.map(val => val.id);
    },
    onQueryList(index) { // 此处有个参数index  1 日 monitoringDate 2 月 monitoringMonth 3 季 monitoringQuarter 4 年 monitoringYear
      this.$set(this.queryForm, 'reportingPeriod', this.bodyItem.activeName);
      this.$set(this.queryForm, 'monitoringTypeCodeId', this.bodyItem.itemType.rowGuid);
      this.$set(this.queryForm, 'schemeId', this.bodyItem.schemeId);
      if (index === '1') {
        this.$set(this.queryForm, 'sort', 'monitoringDate-');
      } else if (index === '2') {
        this.$set(this.queryForm, 'sort', 'monitoringMonth-');
      } else if (index === '3') {
        this.$set(this.queryForm, 'sort', 'monitoringQuarter-');
      } else if (index === '4') {
        this.$set(this.queryForm, 'sort', 'monitoringYearHalf-');
      }
      // this.$set(this.queryForm, 'sort', 'monitoringDate-');
      this.pager.page = 1;
      this.getItemList();
    },
    // 新增
    onClickAdd() {
      const row = {};
      this.$set(row, 'schemeId', this.bodyItem.schemeId.toString());
      this.$set(row, 'monitoringTypeCodeId', this.bodyItem.itemType.rowGuid);
      this.$set(row, 'reportingPeriod', this.bodyItem.activeName.toString());
      this.$set(row, 'dictName', this.bodyItem.itemType.dictName);
      this.$refs.dialogData.openDialog(row);
    },
    // 编辑
    onClickEdit(row) {
      this.$refs.dialogData.openDialog({ ...row, dictName: this.bodyItem.itemType.dictName });
    },
    // 批量打包下载
    onClickDownload() {
      const row = {};
      this.$set(row, 'reportingPeriod', this.bodyItem.activeName.toString());
      this.$set(row, 'monitoringIndex', this.queryForm.monitoringIndex.toString());
      this.$set(row, 'monitoringTypeCodeId', this.bodyItem.itemType.rowGuid);
      this.$set(row, 'schemeId', this.bodyItem.schemeId);
      this.$set(row, 'executionYear', this.bodyItem.executionYear);
      this.$refs.dialogDownlode.openDialog(row);
    },
  },
};
</script>
