<template>
  <!-- 地表水--实时水质状态 -->
  <el-card type="title">
    <div class="mar-t-xs mar-l-sm">
      <el-form :model="queryForm" inline>
        <el-form-item label="测点：">
          <select-tree
            defaultExpandAll
            v-model="portId"
            filterable
            clearable
            style="width: 180px"
            :props="props"
            :options="stationData"
            @refresh="getStationData"
          />
        </el-form-item>
        <el-form-item label="评价因子：">
          <el-select
            v-model="queryForm.factorCodes"
            style="width: 180px"
            multiple
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in divisorData"
              :key="item.value"
              :label="item.factorName"
              :value="item.factorCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间：">
          <el-date-picker
            v-model="queryForm.dateTime"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            style="width: 150px"
            :clearable="false"
            :editable="false"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
          <el-button class="mar-l-sm" type="primary" icon="fas fa-download" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 【信息展示】 -->
    <el-form inline class="mar-t-xs mar-x-sm fn-flex">
      <el-form-item class="flex-1 fn-no-wrap" label="当前点位整体水质评价：">
        <span class="mar-l-xs">质量级别：{{messageList.grade}} </span>
        <span class="mar-l-xs">首要污染物：{{messageList.primaryPollutant}} </span>
        <span class="mar-l-xs">时间：【{{messageList.date}}】 </span>
        <span class="mar-l-xs">总体达标率：{{messageList.range}} </span>
        <span class="mar-l-xs">类型：{{messageList.type}} </span>
      </el-form-item>
    </el-form>
    <!-- 列表信息 -->
    <el-table
      border
      class="border-cell"
      highlight-current-row
      height="calc(100% - 38px)"
      v-loading="loading"
      :data="itemList"
      :span-method="cellMerge"
    >
      <el-table-column fixed align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column fixed label="区域" prop="region" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column fixed label="测点" prop="portName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column fixed label="日期" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column
        align="center"
        v-for="(item, index) in checkedFactorList"
        :key="index"
      >
        <!-- eslint-disable-next-line -->
        <template slot="header" slot-scope="{ row }">
          <span>{{item.factorName}}</span>
        </template>
        <el-table-column align="center" width="100">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>{{ item.unit }}</span>
          </template>
          <template slot-scope="{ row }">
            {{row[`${item.factorCode}`]}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>等级</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template slot-scope="{ row }">
            {{row[`WQL_${item.factorCode}`]}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="{ row }">
            <span>指数</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template slot-scope="{ row }">
            {{row[`WQI_${item.factorCode}`]}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="是否达标" prop="range" min-width="110" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { getDay } from '@/libs/tools';

export default {
  name: 'LotionQuality',
  data() {
    return {
      url: 'surfacewater/infectantBy60/waterState',
      // ------------------【检索条件数据】----------------------
      queryForm: {
        portIds: [],        // 站点数据
        factorCodes: [],    // 因子编码组
        dateTime: getDay(0, false, false),       // 线上状态
      },
      // portId: '',
      stationData: [],    // 站点信息
      stationClear: [],
      divisorData: [],    // 因子信息
      allfactorCode: [],
      checkedFactorList: [],
      factorList: [],
      das: [],
      props: {
        parent: 'parentId',
        value: 'id',
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
        disabled: 'disabled',
      },
      // ------------------【列表字段】----------------------
      loading: false,       // 加载状态
      itemList: [],         // 数据内容
      messageList: [],
      cellSpan1: {
        spanArr: [],
        pop: [],
      },
      cellSpan2: {
        spanArr: [],
        pop: [],
      },
      typeData: '',
    };
  },
  created() {
    this.getStation();
    if (this.itemList.length) {
      this.getSpanArr(this.itemList);
    }
  },
  computed: {
    portId: {
      get() {
        return this.queryForm.portIds[0];
      },
      set(val) {
        this.queryForm.portIds = val ? [val] : [];
      },
    },
  },
  watch: {
    'queryForm.portIds': {
      handler(newData, oldData) {
        if (newData.length !== 0 && newData !== oldData) {
          this.getDivisorDatas();
        }
      },
    },
  },
  methods: {
    /* ----------------------【数据处理方法】------------------------- */
    // 初始查询
    onQueryList() {
      this.getItemList();
    },

    // 合并单元格行列
    cellMerge({ rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.cellSpan1.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      if (columnIndex === 2) {
        const _row = this.cellSpan2.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      return undefined;
    },

    // 数据处理相关
    getSpanArr(data) {
      data.forEach((item, index) => {
        if (index === 0) {
          this.cellSpan1.spanArr.push(1);
          this.cellSpan1.pos = 0;
        } else if (data[index].region === data[index - 1].region) {
          // 判断当前元素与上一个元素是否相同
          this.cellSpan1.spanArr[this.cellSpan1.pos] += 1;
          this.cellSpan1.spanArr.push(0);
        } else {
          this.cellSpan1.spanArr.push(1);
          this.cellSpan1.pos = index;
        }
        if (index === 0) {
          this.cellSpan2.spanArr.push(1);
          this.cellSpan2.pos = 0;
        } else if (data[index].portName === data[index - 1].portName) {
          // 判断当前元素与上一个元素是否相同
          this.cellSpan2.spanArr[this.cellSpan2.pos] += 1;
          this.cellSpan2.spanArr.push(0);
        } else {
          this.cellSpan2.spanArr.push(1);
          this.cellSpan2.pos = index;
        }
      });
    },
    /* -----------------------【请求类接口】------------------------- */
    getStationData() {
      this.$http.get('surfacewater/userPort/getAuthorityTree', {
        params: {
          page: 1,
          rows: 100000,
        },
      }).then((response) => {
        if (response.data.success) {
          this.stationData = response.data.data.map((v) => {
            v.disabled = true;
            return v;
          });
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
    // 获取站点树
    getStation() {
      this.$http.get('surfacewater/userPort/getAuthorityTree', {
        params: {
          page: 1,
          rows: 100000,
        },
      }).then((response) => {
        if (response.data.success) {
          this.stationData = response.data.data;
          const nsv = [];
          this.stationData.forEach((res) => {
            nsv.push(res.children);
          });
          nsv.forEach((res) => {
            const nar = res;
            nar.forEach((el) => {
              this.stationClear.push(el);
            });
          });
          const ytr = [];
          ytr.push(this.stationClear[0].id);
          this.queryForm.portIds = ytr;
          this.getDivisorData();
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
    // 获取因子树
    getDivisorData() {
      this.$http.get('surfacewater/evaluationFactor', {
        params: {
          portId: this.queryForm.portIds[0],
        },
      }).then((response) => {
        if (response.data.success) {
          this.divisorData = response.data.data;
          const nav = [];
          this.divisorData.forEach((res) => {
            if (res.isShow) {
              nav.push(res.factorCode);
            }
          });
          this.queryForm.factorCodes = nav;
          this.getItemList();
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

    // 获取因子树
    getDivisorDatas() {
      if (Array.isArray(this.queryForm.portIds)) {
        // eslint-disable-next-line
        this.typeData = this.queryForm.portIds[0];
      } else {
        this.typeData = this.queryForm.portIds;
      }
      this.$http.get('surfacewater/evaluationFactor', {
        params: {
          portId: this.typeData,
        },
      }).then((response) => {
        if (response.data.success) {
          this.divisorData = response.data.data;
          const nav = [];
          this.divisorData.forEach((res) => {
            if (res.isShow) {
              nav.push(res.factorCode);
            }
          });
          this.queryForm.factorCodes = nav;
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

    // 获取列表数据
    getItemList() {
      this.loading = true;
      this.checkedFactorList = [];
      if (!Array.isArray(this.queryForm.portIds)) {
        const nsf = [];
        nsf.push(this.queryForm.portIds);
        this.queryForm.portIds = nsf;
      }
      if (this.queryForm.factorList) {
        delete this.queryForm.factorList;
      }
      this.$http.post(this.url, this.queryForm).then((response) => {
        if (response.data.success) {
          this.cellSpan1 = { spanArr: [], pop: [] };
          this.cellSpan2 = { spanArr: [], pop: [] };
          this.messageList = response.data.data;
          this.itemList = this.messageList.realTimeList;
          this.divisorData.forEach((res) => {
            this.queryForm.factorCodes.forEach((el) => {
              if (res.factorCode === el) {
                this.checkedFactorList.push(res);
              }
            });
          });
          this.getSpanArr(this.itemList);
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
    // 下载导出
    onDownload() {
      // this.das = this.queryForm.factorCodes;
      // this.das.forEach((res) => {
      //   this.allfactorCode.forEach((el) => {
      //     if (res === el.factorCode) {
      //       this.factorList.push(el);
      //     }
      //   });
      // });
      if (!this.queryForm.factorList) {
        this.queryForm.factorList = this.checkedFactorList;
      }
      // this.queryForm.factorList = [];
      // this.queryForm.factorList = this.checkedFactorList;
      this.$http.post('surfacewater/infectantBy60/exportWaterState', this.queryForm, {
        'responseType': 'blob',
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
      const filename = `实时水质状态${new Date().toLocaleDateString()}.xls`;
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

<style lang="scss" scoped>

</style>
