<!-- 泵站监测数据展示 -->
<template>
  <el-card>
    <el-form inline class="mar-t-xs mar-x-sm">
      <el-form-item label="数据时间：">
        <el-date-picker style="width:135px" v-model="queryForm.fromTime" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00" :clearable="false" :editable="false"></el-date-picker>&nbsp;~
        <el-date-picker style="width:135px" v-model="queryForm.toTime" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 23:59:59" :clearable="false" :editable="false"></el-date-picker>
      </el-form-item>

      <el-form-item label="因子：">
        <el-select style="width: 220px" v-model="factors" multiple collapse-tags @change="getFactorData">
          <el-option v-for="(item, index) in factorList" :key="index" :label="item.factorShowName"
            :value="item.factorShowCode">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="泵站：">
        <el-select style="width: 180px" v-model="queryForm.pumpStationIds" multiple collapse-tags>
          <el-option v-for="(item,index) in pumpStationList" :key="index" :label="item.pumpStationName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
      </el-form-item>
    </el-form>

    <el-table border highlight-current-row class="border-cell" :height="height" v-loading="loading" :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed property="pumpStationName" label="泵站名称" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="pumpStatusName" label="泵运行状态" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="refluxValveStatusName" label="逆流阀状态" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="inletValveStatusName" label="进水阀状态" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="levelGauge" label="液位计" min-width="80"></el-table-column>
      <el-table-column fixed property="tstamp" label="监测时间" min-width="160"></el-table-column>
      <el-table-column fixed property="inletInstantFlow" label="入口瞬时流量" min-width="110" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="outletInstantFlow" label="出口瞬时流量" min-width="110" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="inletTotalFlow" label="入口累计流量" min-width="110" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="outletTotalFlow" label="出口累计流量" min-width="110" show-overflow-tooltip>
      </el-table-column>
      <el-table-column v-for="item in colFactor" :key="item.id" show-overflow-tooltip class="fixed2-header-height"
        align="center" :min-width="getLabelWidth(item.factorName, item.unit)">
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.factorName }}</p>
          <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
          <span style="display: none">{{ row }}</span>
        </template>
        <template slot-scope="{ row }">
          <p :class="{ 'text-danger': isRed(row[item.factorCode]) }">
            {{ isOut(row[item.factorCode]) }}
          </p>
          <!-- <p v-if="row[`${item.code}-Standard`] !== '' && isRed(row[item.factorCode])">
            {{ row[`${item.code}-Standard`] }}
          </p> -->
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />
  </el-card>
</template>

<script>
import _ from 'lodash';
import { getDay } from '@/libs/tools.js';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { tableTitleLen } from '@/libs/tools';

export default {
  name: 'PumpStationOrginalData',
  mixins: [queryList],
  data() {
    return {
      downloading: false,       // 下载按钮状态
      url: 'pump/pumpStationOrginalRtd',
      isAuto: false,
      height: 'calc(100% - 30px)',
      colFactor: [],            // 动态列字段
      factors: [],              // 因子
      queryForm: {
        factors: [],            // 因子
        pumpStationIds: [],     // 泵站
        fromTime: getDay(-2, true, false),               // 任务起止时间
        toTime: getDay(0, true, true),
        sort: 'Tstamp-,pumpStationName+',
      },
      itemList: [],
      pumpStationList: [],      // 泵站列表
      factorList: [],           // 因子列表
    };
  },
  watch: {
    'queryForm.factors': {
      handler(val) {
        this.factors = _.cloneDeep(val).map(v => v.factorCode);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.onQueryList();
    this.loading = true;
    Promise.all([this.getFactorList(), this.getpumpStationList()]).then(() => {
      this.getItemList();
    }, () => {
      this.loading = false;
    });
  },
  methods: {
    /** 请求层 */
    getItemList() {        // 获取记录列表
      /** 需要注意的事项：
       * itemList        调用该接口前需先清空列表数据防止colFactor变动导致列报错
       * selectedIndexs  触发查询时取消勾选高亮
       */
      this.height = 'calc(100% - 31px)';
      this.loading = true;
      this.selectedIds = [];
      const { page, rows } = this.pager;
      this.itemList = [];
      this.colFactor = [];
      this.$http.post(this.url, this.queryForm, {
        params: { page, rows, sort: 'tstamp-,pumpStationName' },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.colFactor = this.factorList.filter(v => this.factors.includes(v.factorShowCode)).map(v => ({
            factorName: v.factorShowName,
            factorCode: v.factorShowCode,
            unit: v.unit,
          }));
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
          this.height = 'calc(100% - 30px)';
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    getFactorList() {              // 获取因子列表
      return new Promise((resolve) => {
        this.$http.get('cfg/pageShowItem', {
          params: {
            pageShowMainCode: 'pumpStationRealTimeFactors',
            isEnabled: true,
            page: 1,
            rows: 100000,
            sort: 'orderNum-',
          },
        }).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.factorList = response.data.data || [];
            this.queryForm.factors = this.factorList.filter(v => v.isShow).map(v => ({
              factorName: v.factorShowName,
              factorCode: v.factorShowCode,
              unit: v.unit,
            }));
            // this.factors = this.queryForm.factors.map(v => v.factorCode);
            this.colFactor = this.factorList.filter(v => v.isShow).map(v => ({
              factorName: v.factorShowName,
              factorCode: v.factorShowCode,
              unit: v.unit,
            }));
            resolve();
          }
        });
      });
    },
    getpumpStationList() {              // 获取泵站列表
      return new Promise((resolve) => {
        this.$http.get('pump/pumpStationInfo', {
          params: {
            page: 1,
            rows: 100000,
            sort: 'pumpStationName',
          },
        }).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.pumpStationList = response.data.data || [];
            this.queryForm.pumpStationIds = this.pumpStationList.map(v => v.id);
            resolve();
          }
        });
      });
    },
    onDownload() {                 // 导出按钮
      this.downloading = true;
      const { page, rows } = this.pager;
      this.$http.post(`${this.url}/export`, {
        page,
        rows,
        ...this.queryForm,
      }, {
        'responseType': 'blob',
        params: { sort: 'pumpStationName' },
      }).then((response) => {
        const filename = `泵站监测数据展示${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },

    /** 特殊方法 */
    getFactorData(val) {            // 获取走航因子数据
      this.queryForm.factors = this.factorList.filter(v => val.includes(v.factorShowCode)).map(v => ({
        factorName: v.factorShowName,
        factorCode: v.factorShowCode,
        unit: v.unit,
      }));
      // this.factors = this.queryForm.factors;
    },
    isRed(val) {                   // 因子是否显示为红色
      return typeof val === 'string' ? val.includes('red') : false;
    },
    isOut(val) {                   // 因子显示的值
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    getLabelWidth(label, unit) {   // 计算动态列宽度
      const labelLen = tableTitleLen(label);
      const unitLen = tableTitleLen(unit ? `(${unit})` : '');
      return labelLen >= unitLen ? labelLen : unitLen;
    },
  },
};
</script>

<style lang="scss" scoped>
.col-status {
  > .cell {
    line-height: 20px !important;
  }
  .online,
  .no-online {
    position: relative;
    top: 4px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: 20px;
    background-position: center center;
  }
  // .online {
  //   background-image: url('~@/assets/img/online.svg');
  // }
  // .no-online {
  //   background-image: url('~@/assets/img/offline.svg');
  // }
}
</style>
