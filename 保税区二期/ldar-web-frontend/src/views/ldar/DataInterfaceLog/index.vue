<template>
  <div>
    <el-card>
      <div slot="header"
           class="clearfix">
        <el-form inline
                 :model="queryForm">
          <el-form-item label="关键字：">
            <el-input clearable
                      style="width:150px;"
                      placeholder="企业名称/信用代码"
                      v-model="queryForm.ps"></el-input>
          </el-form-item>
          <el-form-item label="日志类型：">
            <el-select v-model="queryForm.type"
                       style="width:100px;"
                       clearable>
              <el-option v-for="(item,index) in $enum.logType"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接入时间：">
            <el-date-picker v-model="queryForm.fromDate"
                            style="width:120px;"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="~">
            <el-date-picker v-model="queryForm.toDate"
                            style="width:120px;"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否成功：">
            <el-select v-model="queryForm.isSuccess"
                       style="width:100px;"
                       clearable>
              <el-option v-for="(item,index) in $enum.whether"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       icon="fas fa-search"
                       @click="onQueryList">查 询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="itemList"
                border
                stripe
                height="calc(100% - 30px)"
                v-loading="loading">
        <el-table-column type="index"
                         width="50"
                         label="No."></el-table-column>
        <el-table-column align="center"
                         label="操作"
                         width="140">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="fas fa-search"
                       @click="openRequestData(scope.row)">传输数据</el-button>
          </template>
        </el-table-column>
        <el-table-column min-width="120"
                         prop="type"
                         label="类型"
                         show-overflow-tooltip></el-table-column>
        <el-table-column min-width="200"
                         prop="psName"
                         label="企业名称"
                         show-overflow-tooltip></el-table-column>
        <el-table-column min-width="200"
                         prop="psCode"
                         label="信用代码"
                         show-overflow-tooltip></el-table-column>
        <el-table-column min-width="200"
                         prop="name"
                         label="检测企业"
                         show-overflow-tooltip></el-table-column>
        <el-table-column min-width="200"
                         prop="requestTime"
                         label="接入时间"
                         show-overflow-tooltip></el-table-column>
        <el-table-column min-width="200"
                         prop="errorContent"
                         label="失败错误信息"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column min-width="150"
                         prop="projectId"
                         label="项目id"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer;"
                 @click="openProjectData(scope.row.projectId)">{{scope.row.projectId}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column min-width="400"
                         prop="requestData"
                         label="上传数据"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer;"
                 @click="openRequestData(scope.row.requestData)">{{scope.row.requestData}}</div>
          </template></el-table-column> -->
      </el-table>
      <paging-query :pager="pager"
                    @query="getItemList" />
    </el-card>
    <dialog-form ref="dialog" />
    <request-data-dialog ref="requestDataDialog" />
  </div>
</template>

<script>
import { queryList, deleteItem } from '@/libs/mixins';
import DialogForm from './components/DialogForm';
import RequestDataDialog from './components/RequestDataDialog';

export default {
  name: 'LDARPlan',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
    RequestDataDialog,
  },
  data() {
    return {
      url: 'ldar/dataInterfaceLog',
      queryForm: {
        fromTime: '',
        toTime: '',
        ps: '',
        type: 1,
        sort: 'requestTime-',
      },
    };
  },
  methods: {
    openProjectData(projectId) {
      this.$refs.dialog.openDialog(projectId);
    },
    openRequestData(row) {
      this.$refs.requestDataDialog.openDialog(row);
    },
  },
};
</script>
