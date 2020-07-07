<template>
  <!-- 报警信息 -->
  <div style="height: calc(100% - 40px)">
    <!-- 查询表单 -->
    <div class="mar-t-xs mar-l-sm" style="height: 35px;">
      <el-form inline :model="queryForm">
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
        <el-form-item label="报警类型：">
          <el-select
            v-model="alarmTypeId"
            clearable
            style="width:150px"
            class="z-pointer">
            <el-option v-for="(item, key) in alarmTypeList"
              :key="key"
              :label="item.alarmTypeName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-upload" @click="onExport">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column prop="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="portName" label="排口名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="alarmTstamp" label="报警时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="alarmTypeName" label="报警类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="alarmContent" label="报警内容" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PortAlarmRecord',
  data() {
    return {
      loading: false, // 下拉表格加载
      queryForm: {
        fromDate: this.$hp.formatDate(new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6)),
          'Y-m-d'),
        toDate: this.$hp.formatDate(new Date(), 'Y-m-d'),
        portId: '',
        alarmTypeIds: [],
        systemTypeCode: 'AutoSampleSystem',
      },
      itemList: [],
      selectedIds: [],
      pager: {
        page: 1,
        rows: 15,
        total: 1,
      },
      alarmTypeList: [], // 报警类型
    };
  },
  created() {
    // console.log(this.portItem);
  },
  computed: {
    ...mapState({
      portItem: state => state.sample.portItem,
    }),
    date: {
      get() {
        let date;
        if (this.queryForm.fromDate !== '' && this.queryForm.toDate !== '') {
          date = [this.queryForm.fromDate, this.queryForm.toDate];
        } else {
          date = '';
        }
        return date;
      },
      set(val) {
        if (val) {
          [this.queryForm.fromDate, this.queryForm.toDate] = val;
        } else {
          [this.queryForm.fromDate, this.queryForm.toDate] = ['', ''];
        }
      },
    },
    alarmTypeId: {
      get() {
        return this.queryForm.alarmTypeIds.join(',');
      },
      set(val) {
        this.queryForm.alarmTypeIds = val.split(',');
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
    onTabClick() {
      this.queryForm.portId = this.portItem.portId;
      // this.getItemList();
      this.getAlarmTypeList();
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    getItemList() {
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.post('alarm/alarmRecord?sort=alarmTstamp-', {
        ...this.queryForm,
      }, {
        params: {
          page,
          rows,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.total = response.data.total || response.data.count;
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
    getAlarmTypeList() {
      // this.loading = true;
      this.$http.post('alarm/alarmType/code',
        { alarmTypeCodes: ['AlarmForOverSample'] }).then((response) => {
        if (response.data.success) {
          this.alarmTypeList = response.data.rows || response.data.data || response.data;
          this.$set(this.queryForm, 'alarmTypeIds', this.alarmTypeList.map(n => n.id));
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
        this.getItemList();
        // this.loading = false;
      });
    },
    onExport() {
      this.$http.get('alarm/alarmRecord/export?sort=alarmTstamp-', {
        params: {
          ...this.queryForm,
        },
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `报警信息${new Date().getTime()}.xls`;
        const blob = new Blob([response.data], { type: 'application/x-xls' });
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
  },
};
</script>

<style>

</style>
