<template>
  <!-- *********************************模块名：【地表水——实时在线信息】********************************* -->
  <!--【检索条件】 -->
  <el-card type="title">
    <div class="mar-t-xs mar-l-sm">
      <el-form :model="queryForm" inline>
        <el-form-item label="测点：">
          <select-port
            v-model="queryForm.monitoringPointUid"
            filterable
            defaultExpandAll
            :options="stationData"
            :props="{ label: 'name', value: 'id' }">
          </select-port>
        </el-form-item>
        <el-form-item label="监测因子：">
          <select-port
            v-model="queryForm.pollutantCode"
            filterable
            defaultExpandAll
            :options="divisorData"
            :props="{ label: 'name', value: 'factorCode' }">
          </select-port>
        </el-form-item>
        <el-form-item label="联网状态：">
          <el-select v-model="queryForm.isOnline" filterable style="width: 100px">
            <el-option label="全部" value=""></el-option>
            <el-option label="离线" :value="0"></el-option>
            <el-option label="在线" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 【信息展示】 -->
    <el-form inline class="mar-t-xs mar-x-sm fn-flex">
      <el-form-item class="flex-1 fn-no-wrap">
        <span class="text-warning mar-r-lg">在线率：{{ onlineData.onlineRate}} </span>
        <span class="text-info mar-r-lg">联网总数：{{ onlineData.sum}}个</span>
        <span class="text-success mar-r-lg"> <i class="fas fa-laptop"></i> 在线：{{ onlineData.online}}个 </span>
        <span class="text-danger mar-r-lg"> <i class="fas fa-laptop"></i> 离线：{{ onlineData.offline}}个 </span>
      </el-form-item>
    </el-form>
    <!-- 【列表信息】 -->
    <el-table border highlight-current-row height="calc(100% - 68px)" v-loading="loading" :data="itemList">
      <el-table-column align="center" label="No." width="50" type="index" :index="index" fixed></el-table-column>
      <el-table-column label="测点" prop="monitoringPointName" min-width="220" show-overflow-tooltip fixed></el-table-column>
      <el-table-column align="center" label="联网状态" prop="isOnline" min-width="120" show-overflow-tooltip fixed>
        <template slot-scope="{ row }">
          <i class="fas fa-laptop" :style="{ color: row.isOnline ? 'green' : 'red' }"></i>
        </template>
      </el-table-column>
      <el-table-column label="最新数据时间" prop="tstamp" min-width="200" show-overflow-tooltip fixed></el-table-column>
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
  name: 'OnlineInformations',
  components: { SelectPort },
  data() {
    return {
      url: 'surfacewater/portInfo/real',
      // ------------------【检索条件数据】----------------------
      queryForm: {// 检索条件相关内容
        monitoringPointUid: [],    // 站点数据
        pollutantCode: [],         // 因子编码组
        isOnline: '',              // 线上状态
      },
      stationData: [],    // 站点信息
      divisorData: [],    // 因子信息
      allfactorCode: [],
      checkedFactorList: [],

      // ------------------【特殊数据字段】---------------------
      onlineData: {},

      // -------------------【列表字段】------------------------
      loading: false,       // 加载状态
      itemList: [],         // 数据内容
      pager: {              // 分页传参
        count: 0,
        page: 1,
        rows: 15,
      },
      codeList: [],
    };
  },
  created() {
    this.getSuperveneData();
    this.getOnlineData();
  },
  watch: {},
  computed: {},
  methods: {
    /* ----------------------【数据处理方法】------------------------- */
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
      this.getOnlineData();
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

    /* -----------------------【请求类接口】------------------------- */
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
    // 发送并发请求
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
        // const das = ['w01009', 'w01010', 'w01003', 'w01001', 'w01014'];
        this.queryForm.pollutantCode = this.codeList;
        this.queryForm.monitoringPointUid =  this.getLowestChildren(this.stationData).map(n => n.id);
        // 获取到了所有的子集因子。
        // this.allfactorCode.forEach((res) => {
        //   this.queryForm.pollutantCode.push(res.factorCode);
        // });
        this.getItemList();
      });
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      this.checkedFactorList = [];
      this.queryForm.pollutantCode.forEach((res) => {
        this.allfactorCode.forEach((el) => {
          if (res === el.factorCode) {
            this.checkedFactorList.push(el);
          }
        });
      });
      const { page, rows } = this.pager;
      this.$http.post(this.url, this.queryForm, {
        params: {
          page,
          rows,
          sort: 'tstamp-',
        },
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
    // 获取线上数据内容
    getOnlineData() {
      this.$http.get('surfacewater/portInfo/home').then((response) => {
        this.onlineData = response.data.data;
      }, ({ response }) => {
        analyzeResp(response);
      });
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
