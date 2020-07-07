<template>
  <!-- 地表水——实时数据 -->
  <el-card type="title">
    <!-- 检索条件 -->
    <div class="mar-t-xs mar-l-sm">
      <el-form :model="queryForm" inline>
        <el-form-item label="测点：">
          <select-port
            v-model="queryForm.portIds"
            filterable
            defaultExpandAll
            :options="stationData"
            :props="{ label: 'name', value: 'id' }">
          </select-port>
        </el-form-item>
        <el-form-item label="监测因子：">
          <select-port
            ref="factor"
            v-model="queryForm.factorCodes"
            filterable
            defaultExpandAll
            :options="divisorData"
            :props="{ label: 'name', value: 'factorCode' }">
          </select-port>
        </el-form-item>
        <el-form-item label="小时类型：">
          <el-radio-group v-model="queryForm.timeType">
            <el-radio :label="0">24小时</el-radio>
            <el-radio :label="1">48小时</el-radio>
            <el-radio :label="2">96小时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
          <el-button class="mar-l-sm" type="primary" icon="fas fa-download" @click="onDownload">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表信息 -->
    <el-table
      border
      highlight-current-row
      class="border-cell"
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
      :span-method="cellMerge"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index" fixed></el-table-column>
      <el-table-column label="测点" prop="monitoringPointName" min-width="160" show-overflow-tooltip fixed></el-table-column>
      <el-table-column label="日期" prop="tstamp" min-width="200" show-overflow-tooltip fixed></el-table-column>
      <!-- 用户选中的因子列循环生成 -->
      <el-table-column
        align="center"
        show-overflow-tooltip
        v-for="item in checkedFactorList"
        :key="item.factorCode"
        :min-width="getLabelWidth(item.name, item.unit)">
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.name }}</p>
          <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
          <span style="display: none">{{ row }}</span>
        </template>
        <template slot-scope="{ row }">
          <span :class="{ 'text-danger': isRed(row[item.factorCode]) }">
            {{ isOut(row[item.factorCode]) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </el-card>
</template>

<script>
import SelectPort from '@/components/select-port';
import { analyzeResp } from '@/global/libs/util';
import { tableTitleLen } from '@/libs/tools';

export default {
  name: 'RealtimeData',
  components: { SelectPort },
  data() {
    return {
      // ------------------------- 【查询条件字段】 ------------------------
      queryForm: {// 检索条件相关内容
        portIds: [],      // 监测点
        factorCodes: [],  // 监测因子
        timeType: 0,      // 小时类型
      },
      stationData: [],    // 站点信息
      divisorData: [],    // 因子信息
      allfactorCode: [],
      checkedFactorList: [],

      // ---------------------------【列表字段】 ----------------------------
      loading: false,     // 加载状态
      itemList: [],       // 数据内容
      cellSpan1: {
        spanArr: [],
        pop: [],
      },

      // --------------------------【分页字段】------------------------------
      pager: {            // 分页传参
        count: 0,
        page: 1,
        rows: 15,
      },
      codeList: [],
    };
  },
  created() {
    this.getSuperveneData();
    if (this.itemList.length) {
      this.getSpanArr(this.itemList);
    }
  },
  watch: {
  },
  computed: {
    // 获取选择的因子数组对象[{}]
    // checkedFactorList() {
    //   // 选择器对象中有计算属性checkedNodes，即为选择的因子叶子节点数组对象
    //   return this.$refs.factor ? this.$refs.factor.checkedNodes : [];
    // },
  },
  methods: {
    /* --------------------------数据处理方法----------------------------- */
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 处理单位换行 & 列宽
    getUnit(label, unit) {
      const unitText = unit ? `(${unit})` : '';
      return `${label}${unitText}`;
    },
    getLabelWidth(label, unit) {
      return tableTitleLen(this.getUnit(label, unit));
    },
    isOut(val) {
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    // 判断是否超标、超标则表示为红色
    isRed(val) {
      return typeof val === 'string' ? val.includes('red') : false;
    },
    getLabelLen(label, unit) {
      const labelText =  label.length > unit.length ? label : `（${unit}）`;
      return tableTitleLen(labelText);
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
      return undefined;
    },

    // 数据处理相关
    getSpanArr(data) {
      data.forEach((item, index) => {
        if (index === 0) {
          this.cellSpan1.spanArr.push(1);
          this.cellSpan1.pos = 0;
        } else if (data[index].monitoringPointName === data[index - 1].monitoringPointName) {
          // 判断当前元素与上一个元素是否相同
          this.cellSpan1.spanArr[this.cellSpan1.pos] += 1;
          this.cellSpan1.spanArr.push(0);
        } else {
          this.cellSpan1.spanArr.push(1);
          this.cellSpan1.pos = index;
        }
      });
    },
    /* --------------------------请求类接口------------------------------ */
    // 获取站点树
    getStation() {
      return this.$http.get('surfacewater/userPort/getAuthorityTree', {
        params: {
          page: 1,
          rows: 100000,
        },
      });
    },
    // 获取监测因子
    getDivisor() {
      return this.$http.get('surfacewater/userFactor/getAuthorityTree', {
        params: {
          page: 1,
          rows: 100000,
        },
      });
    },
    // 首次加载数据
    getSuperveneData() {
      this.loading = true;
      this.$http.all([this.getStation(), this.getDivisor()]).then((response) => {
        [{ data: { data: this.stationData } }, { data: { data: this.divisorData } }] = response;
        const nac = [];
        // 获取到所有的列表内容
        this.divisorData.forEach((res) => {
          nac.push(res.children);
        });
        nac.forEach((res) => {
          const nav = res;
          nav.forEach((el) => {
            this.allfactorCode.push(el);
          });
        });
        this.allfactorCode.forEach((res) => {
          this.codeList.push(res.factorCode);
        });
        // 获取到了部分默认因子
        // const das = ['w01009', 'w01010', 'w01003', 'w01001', 'w01014'];
        this.queryForm.factorCodes = this.codeList;
        this.queryForm.portIds =  this.getLowestChildren(this.stationData).map(n => n.id);
        // 下面代码默认选中所有因子
        // this.allfactorCode.forEach((res) => {
        //   this.queryForm.factorCodes.push(res.factorCode);
        // });
        this.getItemList();
      });
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      this.checkedFactorList = [];
      this.queryForm.factorCodes.forEach((res) => {
        this.allfactorCode.forEach((el) => {
          if (res === el.factorCode) {
            this.checkedFactorList.push(el);
          }
        });
      });
      const { page, rows } = this.pager;
      this.$http.post('surfacewater/infectantBy60/origin', this.queryForm, {
        params: {
          page,
          rows,
          // sort: 'tstamp-',
        },
      }).then((response) => {
        if (response.data.success) {
          this.cellSpan1 = { spanArr: [], pop: [] };
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
      this.$http.post('surfacewater/infectantBy60/export', this.queryForm, {
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
      const filename = `实时数据查询${new Date().toLocaleDateString()}.xls`;
      const linkNode = document.createElement('a');
      linkNode.download = filename;
      linkNode.style.display = 'none';
      linkNode.href = URL.createObjectURL(blob);
      document.body.appendChild(linkNode);
      linkNode.click();
      URL.revokeObjectURL(linkNode.href);
      document.body.removeChild(linkNode);
    },
    getLowestChildren(val) {  // 获取数组最底层值集合
      const arr = [];
      val.forEach((item) => {
        if (item.children) {
          arr.push(...(this.getLowestChildren(item.children)));
        } else {
          arr.push(item);
        }
      });
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
