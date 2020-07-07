<template>
  <el-card>
    <div slot="header"
         class="clearfix">
      <el-form inline
               :model="queryForm">
        <el-form-item label="企业名称：">
          <el-input clearable
                    v-model="queryForm.psName"></el-input>
        </el-form-item>
        <el-form-item label="报警类型：">
          <el-select clearable
                     v-model="queryForm.alarmType"
                     style="width:160px;">
            <el-option v-for="(item, index)  in $enum.alarmType"
                       :key="index"
                       :label="item"
                       :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报警生成时间：">
          <el-date-picker v-model="queryForm.fromTime"
                          type="date"
                          style="width:160px;"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="~">
          <el-date-picker v-model="queryForm.toTime"
                          type="date"
                          style="width:160px;"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border
              highlight-current-row
              height="calc(100% - 70px)"
              v-loading="loading"
              :data="itemList"
              :row-class-name="rowClassName">
      <el-table-column align="center"
                       type="index"
                       width="50"
                       label="No."></el-table-column>
      <el-table-column align="left"
                       width="300"
                       prop="psName"
                       label="企业名称"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="center"
                       width="150"
                       prop="alarmType"
                       label="报警类型"
                       show-overflow-tooltip>
        <template slot-scope="scope">{{$enum.alarmType[scope.row.alarmType]}}</template>
      </el-table-column>
      <el-table-column width="180"
                       align="center"
                       prop="createDate"
                       label="报警时间"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="left"
                       prop="alarmContent"
                       label="报警内容"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="left"
                       width="150"
                       prop="isProcessed"
                       label="是否处理"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button disabled v-if="scope.row.isProcessed==true"
                     type="success">已处理</el-button>
          <el-button disabled v-if="scope.row.isProcessed==false"
                     @click="checkProcessed(scope.row)"
                     type="danger">未处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager"
                  @query="getItemList" />
  </el-card>
</template>

<script>
import { queryList } from '@/libs/mixins';
import { analyzeResp } from '@/libs/util';

export default {
  name: 'LDARAlarmRecord',
  mixins: [
    queryList,
  ],
  data() {
    return {
      url: 'ldar/alarmRecord',
      itemList: [],
      queryForm: {
        psName: '',
        alarmCategory: '',
        alarmType: '',
        fromTime: '',
        toTime: '',
        sort: 'createDate-',
      },
    };
  },
  created() {
    const date1 = new Date();
    const date2 = new Date(date1);
    date2.setDate(date1.getDate() - 30);
    this.queryForm.fromTime = date2;
    this.queryForm.toTime = date1;
  },
  methods: {
    checkProcessed(row) {
      this.$confirm('将改变处理状态,请确认!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.put(this.url, row)
      )).then((response) => {
        if (response.status === 200 && response.data.msg.includes('成功')) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
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
