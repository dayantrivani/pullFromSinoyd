<!-- 报警管理 -->
<template>
  <el-card>
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="开始时间：">
          <el-date-picker
            v-model="queryForm.fromDate"
            style="width:140px"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00"
            :picker-options="pickStart"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            v-model="queryForm.toDate"
            style="width:140px"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 23:59:59"
            :picker-options="pickEnd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="监测点位：">
          <tree-select
            v-model="queryForm.portIds"
            :options="stationList"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            :defaultExpandAll="true"
            @getTreeData="getAlarmData"
          ></tree-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="queryForm.isAll" @change="isSelectAll">显示全部站点</el-checkbox>
        </el-form-item>
        <!-- 报警类型 -->
        <el-form-item label="报警类型：">
          <el-select v-model="queryForm.alarmTypes" style="width: 150px" multiple collapse-tags>
            <el-option
              v-for="item in alarmTypeData"
              :key="item.id"
              :label="item.itemText"
              :value="item.itemValue">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 查询按钮 -->
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="getItemList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 表格内容 -->
    <el-table
      border
      height="calc(100% - 32px)"
      highlight-current-row
      v-loading="loading"
      :data="itemList"
    >
      <!-- <el-table-column align="center" type="selection" width="36"></el-table-column> -->
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="monitoringPointName" label="点位名称" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="recordDateTime" label="时间" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="itemText" label="报警类型" min-width="60" show-overflow-tooltip></el-table-column>
      <el-table-column property="content" label="报警内容" min-width="300" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import TreeSelect from '@/components/select-tree';
import { getDay } from '@/libs/tools';
// import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'WarnerManage',
  components: {
    TreeSelect,
  },
  data() {
    return {
      queryForm: {                              // 检索栏数据
        fromDate: getDay(-7),
        toDate: getDay(0, true, true),
        alarmTypes: [],
        portIds: [],
        isAll: true,
      },
      loading: false,                           // 列表加载状态
      itemList: [],                             // 列表数据源
      alarmTypeData: [],                        // 报警类型数据源
      isAlarm: [],
      pager: {                                  // 分页传参
        count: 0,
        page: 1,
        rows: 15,
      },
      stationList: [],                          // 站点数据源
      alarmTypeClear: [],                       // 报警数据处理
      stationClearData: [],                     // 数据信息
      alarmTypeLength: '',                      // 测试
      pickStart: {
        disabledDate: (time) => {
          if (this.queryForm.toDate === '' || this.queryForm.toDate === null) {
            return time.getTime() > Date.now();
          }
          return time.getTime() > new Date(this.queryForm.toDate).getTime();
        },
      },
      pickEnd: {
        disabledDate: time => time.getTime() < new Date(this.queryForm.fromDate).getTime()
          || time.getTime() > Date.now(),
      },
    };
  },
  created() {
    this.getAlarmType();
    this.getStation();
    // this.getItemList();
  },
  // beforeMount() {
  //   this.getAlarmType();
  //   this.getItemList();
  // },
  watch: {
    // 这里监控站点数据里面的值
    queryForm: {
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this.queryForm, 'isAll', false);
        } else {
          this.$set(this.queryForm, 'isAll', true);
        }
        // if (newData.length > 0 && newData.length < this.stationClearData.length) {
        //   this.queryForm.isAll = false;
        // } else {
        //   this.queryForm.isAll = true;
        // }
      },
      deep: true,
    },
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 全部报警类型
    isSelectAll(val) {
      if (val) {
        this.queryForm.portIds = [];
      }
      // if (val) {
      //   this.queryForm.portIds = [];
      //   this.queryForm.isAll = true;
      // } else {
      //   this.queryForm.isAll = false;
      // }
    },
    // 下拉框方法
    getPointData() {},
    getAlarmData() {},
    // 获取报警类型
    getAlarmType() {
      this.$http.get('airquality/alarmType', {
        params: {
          alarmType: 1,
        },
      }).then((response) => {
        this.alarmTypeData = response.data.data;
        this.alarmTypeData.forEach((res) => {
          this.alarmTypeClear.push(res.itemValue);
        });
        this.queryForm.alarmTypes = this.alarmTypeClear;
        this.getItemList();
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 获取站点树
    getStation() {
      this.$http.get('airquality/userPort/getAuthorityTree')
        .then((response) => {
          if (response.data.success) {
            this.stationList = response.data.data;
            this.stationList.forEach((res) => {
              res.children.forEach((es) => {
                this.stationClearData.push(es.id);
              });
            });
            // this.queryForm.portIds = this.stationClearData;
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
    // 获取列表内容
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post('airquality/alarmRecord', this.queryForm, {
        params: { page, rows, sort: 'recordDateTime-' },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
