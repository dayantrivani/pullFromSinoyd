<!-- 数据有效补集率 -->
<template>
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="时间类型：">
        <el-select v-model="queryForm.queryDateType" style="width: 100px;">
          <el-option label="日" value="day"></el-option>
          <el-option label="月" value="month"></el-option>
          <el-option label="季" value="quarter"></el-option>
          <el-option label="年" value="year"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div v-show="queryForm.queryDateType === 'day'">
          <el-date-picker
            style="width:140px"
            v-model="queryForm.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width:140px"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </div>
        <el-date-picker
          v-show="queryForm.queryDateType === 'month'"
          type="month"
          placeholder="选择月"
          value-format="yyyy-M"
          format="yyyy-MM"
          v-model="monthRange"
          :clearable="false">
        </el-date-picker>
        <el-date-picker
          style="width: 120px;"
          v-show="['year', 'quarter'].includes(queryForm.queryDateType)"
          type="year"
          placeholder="选择年"
          value-format="yyyy"
          format="yyyy"
          v-model="queryForm.year"
          :clearable="false">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="queryForm.queryDateType === 'quarter'">
        <el-select v-model="queryForm.quarter">
          <el-option label="第一季度" value="1"></el-option>
          <el-option label="第二季度" value="2"></el-option>
          <el-option label="第三季度" value="3"></el-option>
          <el-option label="第四季度" value="4"></el-option>
        </el-select>
      </el-form-item>
      <!-- <Select-port-group v-model="queryForm"></Select-port-group> -->
      <el-form-item label="站点：">
        <select-port
          v-model="queryForm.portIds"
          filterable
          :options="portList"
          :field="[
            { name: 'psName', key: 'psId' },
            { name: 'portName', key: 'id' }
          ]">
        </select-port>
        <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="selectPort">站 点</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="fas fa-download"
          :loading="downloading"
          @click="onDownload"
        >导 出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 63px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." fixed width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="200" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" fixed min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="烟尘" align="center">
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>实测浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a34013-Avg']}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="140">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>基准氧含量浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a34013-ZsAvg']}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>排放量</span>
          </template>
          <template slot-scope="{ row }">
            {{row['"a34013-Cou']}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="SO2" align="center">
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>实测浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a21026-Avg']}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="140">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>基准氧含量浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a21026-ZsAvg']}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>排放量</span>
          </template>
          <template slot-scope="{ row }">
            {{row['"a21026-Cou']}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="NOx" align="center">
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>实测浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a21002-Avg']}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="140">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>基准氧含量浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a21002-ZsAvg']}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>排放量</span>
          </template>
          <template slot-scope="{ row }">
            {{row['"a21002-Cou']}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="流速" align="center">
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>实测浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a01011-Avg']}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="氧量" align="center">
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>实测浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a19001-Avg']}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="温度" align="center">
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>实测浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a01012-Avg']}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="静压" align="center">
        <el-table-column align="center" width="100">
          <template slot="header" slot-scope="{ row }">
            <span hidden>{{row}}</span>
            <span>实测浓度</span>
          </template>
          <template slot-scope="{ row }">
            {{row['a01013-Avg']}}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <Transfer-port ref="port" @getQueryData="getQueryData"></Transfer-port>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay, tableTitleLen } from '@/libs/tools';
import SelectPort from '@/components/widget/select-port';
import TransferPort from '@/components/widget/transfer-port';

export default {
  name: 'DataQuery',
  mixins: [queryList],
  components: { SelectPort, TransferPort },
  data() {
    return {
      isAuto: false,
      queryForm: {
        queryDateType: 'day',
        portIds: [],
        isAll: true,
        fromDate: getDay(-1, false, false),
        toDate: getDay(0, false, false),
        year: `${new Date().getFullYear()}`,
        mon: `${new Date().getMonth() + 1}`,
        quarter: `${((new Date().getMonth() + 1) % 3) + 1}`,
        portType: this.amcsType,
      },
      itemList: [],
      factorList: [],
      childPortTypeList: [],
      portList: [], // 站点数据组
      dynamicCol: [],
      downloading: false,
    };
  },
  filters: {
    isRed(val) {
      if (val && val.startsWith('red')) {
        return val.substring(4);
      }
      return val;
    },
  },
  created() {
    this.queryForm.portType = this.amcsType;
    this.getPortList();
    this.getItemList();
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
    dateRange: {
      get() {
        return (!this.queryForm.fromDate && !this.queryForm.toDate)
          ? ''
          : [this.queryForm.fromDate, this.queryForm.toDate];
      },
      set(val) {
        [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
      },
    },
    monthRange: {
      get() {
        return (!this.queryForm.year && !this.queryForm.mon)
          ? ''
          : `${this.queryForm.year}-${this.queryForm.mon}`;
      },
      set(val) {
        [this.queryForm.year, this.queryForm.mon] = val.split('-') || ['', ''];
      },
    },
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this.queryForm, 'isAll', false);
        } else {
          this.$set(this.queryForm, 'isAll', true);
        }
      },
      deep: true,
    },
  },
  methods: {
    // 站点选择事件
    onChangeCheck(val) { // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    getQueryData(portIds) {
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },
    // 站点选择
    selectPort() {
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES', this.amcsType),
          portType: this.amcsType,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getLabelLen(label, unit = '') {
      if (unit) {
        const labelText = label.length > unit.length ? label : `（${unit}）`;
        return tableTitleLen(labelText);
      }
      return tableTitleLen(label);
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
      // this.handleTabelData();
    },
    handleTabelData() {
      /**
       * 通过已选择的因子code取出该因子的value, text,unit 属性
       */
      this.dynamicCol = !this.queryForm.factorCodes.length ? []
        : this.queryForm.factorCodes.map(
          code => this.factorList.find(factor => factor.factorShowCode === code)
        );
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      const url = 'amcs/capRate/';
      let queryForm = { ...this.queryForm };
      if (this.queryForm.queryDateType === 'day') {
        queryForm = {
          queryDateType: this.queryForm.queryDateType,
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          portType: this.queryForm.portType,
        };
      } else if (this.queryForm.queryDateType === 'month') {
        queryForm = {
          queryDateType: this.queryForm.queryDateType,
          year: this.queryForm.year,
          mon: this.queryForm.mon,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          portType: this.queryForm.portType,
        };
      } else if (this.queryForm.queryDateType === 'quarter') {
        queryForm = {
          queryDateType: this.queryForm.queryDateType,
          year: this.queryForm.year,
          quarter: this.queryForm.quarter,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          portType: this.queryForm.portType,
        };
      } else if (this.queryForm.queryDateType === 'year') {
        queryForm = {
          queryDateType: this.queryForm.queryDateType,
          year: this.queryForm.year,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          portType: this.queryForm.portType,
        };
      }
      this.$http.post(url, queryForm, {
        params: {
          page,
          rows,
          sort: 'regionName-,psName-,portName-',
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
    // 下载数据
    onDownload() {
      this.downloading = true;
      let queryForm = { ...this.queryForm };
      if (this.queryForm.queryDateType === 'day') {
        queryForm = {
          queryDateType: this.queryForm.queryDateType,
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          portType: this.queryForm.portType,
        };
      } else if (this.queryForm.queryDateType === 'month') {
        queryForm = {
          queryDateType: this.queryForm.queryDateType,
          year: this.queryForm.year,
          mon: this.queryForm.mon,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          portType: this.queryForm.portType,
        };
      } else if (this.queryForm.queryDateType === 'quarter') {
        queryForm = {
          queryDateType: this.queryForm.queryDateType,
          year: this.queryForm.year,
          quarter: this.queryForm.quarter,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          portType: this.queryForm.portType,
        };
      } else if (this.queryForm.queryDateType === 'year') {
        queryForm = {
          queryDateType: this.queryForm.queryDateType,
          year: this.queryForm.year,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          portType: this.queryForm.portType,
        };
      }
      this.$http.post('amcs/capRate/export/', queryForm, {
        'responseType': 'blob',
        params: {
          sort: 'regionName-,psName-,portName-',
        },
      }).then((response) => {
        const filename = `数据有效补集率${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
