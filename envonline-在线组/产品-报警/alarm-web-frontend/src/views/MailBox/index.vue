<template>
  <!-- 人员短信发送配置 -->
  <el-card class="title-card" type="title">
    <!-- 查询表单 -->
    <el-form inline :model="queryForm" class="mar-t-xs mar-l-xs fn-no-wrap">
      <el-form-item label="时间：">
        <el-date-picker
          style="width:220px"
          v-model="date"
          unlink-panels
          :clearable="false"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input
          clearable
          v-model="queryForm.userName"
          placeholder="请输入姓名">
          <!-- @keyup.enter.native="onQueryList"> -->
        </el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input
          clearable
          v-model="queryForm.telephone"
          placeholder="请输入手机号">
          <!-- @keyup.enter.native="onQueryList"> -->
        </el-input>
      </el-form-item>
      <el-form-item label="短信类型：">
        <el-select v-model="queryForm.recordType" placeholder="请选择短信类型">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="人工发送" :value="1"></el-option>
          <el-option label="自动发送" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <hr/>
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        @click="onClickAdd">新 增</el-button>
    </div>
    <el-table
      border
      height="calc(100% - 73px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column property="userName" label="姓名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="telephone" label="手机号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sendTime" min-width="150px" label="发送时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="recordType" label="短信类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.recordType === 1">人工发送</span>
          <span v-else-if="scope.row.recordType === 2">自动发送</span>
        </template>
      </el-table-column>
      <el-table-column property="sendContent" label="发送内容" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <add-dialog ref="addDialog" @onQueryList="onQueryList"></add-dialog>
  </el-card>
</template>

<script>
import AddDialog from './components/AddDialog';
import { formatDate } from '@/global/libs/tools';

export default {
  name: 'MailBox',
  components: { AddDialog },
  data() {
    return {
      loading: false,
      queryForm: {
        userName: '',
        telephone: '',
        fromDate: formatDate(new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6)),
          'Y-m-d'),
        toDate: formatDate(new Date(), 'Y-m-d'),
        recordType: -1,
        sort: 'sendTime-',
      },
      selectedIds: [],
      pager: {
        rows: 15,
        page: 1,
        count: 1,
      },
      itemList: [],
    };
  },
  created() {
    this.getItemList();
  },
  computed: {
    date: {
      get() {
        return [this.queryForm.fromDate, this.queryForm.toDate];
      },
      set(val) {
        if (val) {
          [this.queryForm.fromDate, this.queryForm.toDate] = val;
        } else {
          [this.queryForm.fromDate, this.queryForm.toDate] = ['', ''];
        }
      },
    },
  },
  methods: {
    // 页面基本方法
    index(index) { // 表格索引衔接
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    _rowClassName({ row }) { // 勾选样式修改
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    // 表格
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    onClickAdd() { // 新增事件
      this.$refs.addDialog.openDialog();
    },
    getItemList() {
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.get('alarm/sendRecord', {
        params: {
          rows,
          page,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
