<!-- 统计分析 -->
<template>
  <el-card>
    <!-- 查询表单项项 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="开始时间：">
          <el-date-picker
            v-model="queryForm.fromDate"
            style="width:135px"
            type="date"
            :picker-options="pickStart"
            value-format="yyyy-MM-dd 00:00:00"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            v-model="queryForm.toDate"
            style="width:135px"
            type="date"
            :picker-options="pickEnd"
            value-format="yyyy-MM-dd 23:59:59"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <!-- 查询区域/测点：检索 -->
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
        <!-- 查询按钮 -->
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
        <!-- 导出按钮 -->
        <el-form-item>
          <el-button type="primary" icon="fas fa-upload" :loading="downloading" @click="onDownload">导出Excel</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 表格内容 -->
     <el-table
      border
      :data="itemList"
      v-loading="loading"
      height="calc(100% - 32px)"
      highlight-current-row
    >
      <el-table-column fixed label="No." type="index" :index="index" align="center" width="70"></el-table-column>
      <el-table-column
        fixed label="监测点名称" property="monitoringPointName" align="center" width="160" show-overflow-tooltip
      ></el-table-column>
      <el-table-column fixed label="日期" property="dateTime" align="center" width="160" show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="空气质量指数(AQI)" align="center" prop="aqivalue" width="110"></el-table-column>
      <el-table-column label="首要污染物" align="center" prop="primaryPollutant" width="100"></el-table-column>
      <el-table-column label="空气质量指数级别" align="center" prop="grade" width="100"></el-table-column>
      <el-table-column label="空气质量指数类别" align="center">
        <el-table-column align="center" width="100">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>类别</span>
          </template>
          <template slot-scope="{ row }">
            {{row.classLevel}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>颜色</span>
          </template>
          <template slot-scope="{ row }">
            <div :style="styleChange(row)"></div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="污染物浓度及空气质量指数（IAQI）" align="center">
        <el-table-column align="center" min-width="110">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>PM<sub>2.5</sub>1小时平均</span>
          </template>
          <el-table-column align="center" width="130">
            <!-- eslint-disable-next-line -->
            <template slot="header" slot-scope="{ row }">
              <span>浓度/(mg/m<sup>3</sup>){{row}}</span>
            </template>
            <template slot-scope="{ row }">
              {{row.pm25}}
            </template>
          </el-table-column>
          <el-table-column label="分指数" align="center" prop="pm25_IAQI"></el-table-column>
        </el-table-column>
        <el-table-column align="center">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>PM<sub>10</sub>1小时平均</span>
          </template>
          <el-table-column align="center" width="130">
            <!-- eslint-disable-next-line -->
            <template slot="header" slot-scope="{ row }">
              <span>浓度/(mg/m<sup>3</sup>)</span>
            </template>
            <!-- 内容 -->
            <template slot-scope="{ row }">
              {{row.pm10}}
            </template>
          </el-table-column>
          <el-table-column label="分指数" align="center" prop="pm10_IAQI"></el-table-column>
        </el-table-column>
        <el-table-column align="center" width="160">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>二氧化氮(NO<sub>2</sub>)1小时平均</span>
          </template>
          <el-table-column align="center" width="130">
            <!-- eslint-disable-next-line -->
            <template slot="header" slot-scope="{ row }">
              <span>浓度/(mg/m<sup>3</sup>)</span>
            </template>
            <!-- 内容 -->
            <template slot-scope="{ row }">
              {{row.no2}}
            </template>
          </el-table-column>
          <el-table-column label="分指数" align="center" prop="no2_IAQI"></el-table-column>
        </el-table-column>
        <el-table-column align="center" width="160">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>二氧化硫(SO<sub>2</sub>)1小时平均</span>
          </template>
          <el-table-column align="center" width="130">
            <!-- eslint-disable-next-line -->
            <template slot="header" slot-scope="{ row }">
              <span>浓度/(mg/m<sup>3</sup>)</span>
            </template>
            <template slot-scope="{ row }">
              {{row.so2}}
            </template>
          </el-table-column>
          <el-table-column label="分指数" align="center" prop="so2_IAQI"></el-table-column>
        </el-table-column>
        <el-table-column align="center" width="160">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>臭氧(O<sub>3</sub>)1小时平均</span>
          </template>
          <el-table-column align="center" width="130">
            <!-- eslint-disable-next-line -->
            <template slot="header" slot-scope="{ row }">
              <span>浓度/(mg/m<sup>3</sup>)</span>
            </template>
            <template slot-scope="{ row }">
              {{row.o3}}
            </template>
          </el-table-column>
          <el-table-column label="分指数" align="center" prop="o3_IAQI"></el-table-column>
        </el-table-column>
        <el-table-column align="center" width="160">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>一氧化碳(CO)1小时平均</span>
          </template>
          <el-table-column align="center" width="130">
            <!-- eslint-disable-next-line -->
            <template slot="header" slot-scope="{ row }">
              <span>浓度/(mg/m<sup>3</sup>)</span>
            </template>
            <template slot-scope="{ row }">
              {{row.co}}
            </template>
          </el-table-column>
          <el-table-column label="分指数" align="center" prop="co_IAQI"></el-table-column>
        </el-table-column>
      </el-table-column>
      <!-- <el-table-column label="空气质量指数(AQI)" align="center" prop="aqivalue" width="110"></el-table-column>
      <el-table-column label="首要污染物" align="center" prop="primaryPollutant" width="100"></el-table-column>
      <el-table-column label="空气质量指数级别" align="center" prop="grade" width="100"></el-table-column>
      <el-table-column label="空气质量指数类别" align="center">
        <el-table-column align="center" width="100">
          <template slot="header">
            <span>类别</span>
          </template>
          <template slot-scope="{ row }">
            {{row.classLevel}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template slot="header">
            <span>颜色</span>
          </template>
          <template slot-scope="{ row }">
            <div :style="styleChange(row)"></div>
          </template>
        </el-table-column>
      </el-table-column> -->
    </el-table>

    <!-- 分页相关内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { getDay } from '@/libs/tools';
import TreeSelect from '@/components/select-tree';

export default {
  name: 'MinStatisticAnalysis',
  components: {
    TreeSelect,
  },
  data() {
    return {
      queryForm: {                              // 检索栏数据
        fromDate: getDay(-6),
        toDate: getDay(0, true, false),
        portIds: [],
        isAll: true,
      },
      loading: false,
      downloading: false,
      stationList: [],                              // 站点数据（有层级）
      stationClearData: [],                         // 所有站点（没有层级）
      itemList: [],                                 // 列表数据源
      pager: {            // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
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
    this.getStation();
  },
  beforeMount() {
    this.getItemList();
  },
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
    // 站点下拉框触发事件
    getAlarmData() {},
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
    // 样式改变
    styleChange(val) {
      return {
        'background-color': val.rgbvalue,
        'height': '25px',
      };
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
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取列表内容
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post('airquality/hourAQI', this.queryForm, {
        params: { page, rows, sort: 'dateTime-' },
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
    // 导出数据
    onDownload() {
      this.downloading = true;
      // const { page, rows } = this.pager;
      this.$http.post('airquality/hourAQI/export', this.queryForm, {
        'responseType': 'blob',
        params: { sort: 'dateTime-' },
      }).then((response) => {
        this.exportExcel(response.data);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 导出excel
    exportExcel(data) {
      const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      const filename = `小时评价数据${new Date().toLocaleDateString()}.xls`;
      const linkNode = document.createElement('a');
      linkNode.download = filename;
      linkNode.style.display = 'none';
      linkNode.href = URL.createObjectURL(blob);
      document.body.appendChild(linkNode);
      linkNode.click();
      URL.revokeObjectURL(linkNode.href);
      document.body.removeChild(linkNode);
    },
  },
};
</script>
