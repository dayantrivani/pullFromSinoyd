<template>
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="数据值类型：">
        <el-select v-model="queryForm.dataType" style="width: 150px;">
          <el-option
            v-for="item in $enum.get('DATA_TYPE')"
            :key="item.value"
            v-show="['Hour', 'RT', 'Day'].includes(item.value)"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据时间：">
        <div v-if="queryForm.dataType === 'Minute' || queryForm.dataType === 'RT'">
          <el-date-picker
            style="160px"
            v-model="queryForm.fromTime"
            type="datetime"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH:00:00"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="160px"
            v-model="queryForm.toTime"
            type="datetime"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH:59:59"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </div>
        <div v-else>
          <el-date-picker
            style="width: 140px"
            v-model="queryForm.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width: 140px"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="因子：">
        <el-select
          style="width:180px;"
          v-model="factorCodes"
          multiple
          collapse-tags
          clearable
        >
          <el-option-group
            v-for="(item, key) in factorGroup"
            :key="key"
            :label="item.name">
            <el-option
              v-for="(ele, index) in item.children"
              :key="index"
              :label="ele.factorShowName"
              :value="ele.factorShowCode">
            </el-option>
          </el-option-group>
        </el-select>
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
      ref="table"
      border
      highlight-current-row
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." fixed width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="200" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" fixed min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" fixed min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column
        v-for="item in queryForm.factorList"
        :key="item.factorShowName"
        :label="item.factorShowName"
        :prop="item.factorShowCode"
        align="center"
        :min-width="getLabelLen(item.factorShowName, item.unit)"
      >
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.factorShowName }}</p>
          <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
          <span style="display:none">{{ row }}</span>
        </template>
        <template slot-scope="{ row }">
          <p
            :class="{ 'text-danger': row[item.factorShowCode] && (row[item.factorShowCode]).startsWith('red') }"
          >{{ row[item.factorShowCode] | isRed }}</p>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay, tableTitleLen, toFactorTree } from '@/libs/tools';

export default {
  name: 'OutletHistoryData',
  mixins: [queryList],
  components: {},
  data() {
    return {
      isAuto: false,
      queryForm: {
        isAll: false,
        key: '',
        dataType: 'Hour',
        toDate: getDay(0, false, false),
        fromDate: getDay(-30, false, false),
        fromTime: '',
        toTime: '',
        portIds: [],
        factorList: [],
        sort: 'PsName+,PortName+,Tstamp-',
      },
      dateType: {
        type: 'date', // 时间控件的类型 date精确到日 datetime 精确到时
        width: '140px',
        format: '',
      },
      itemList: [],
      factorList: [],
      factorAction: 1, // 因子类型，数据类型Hour,Minute,Day,AuditHour,monthReport为1，RT为2 用于在切换小时，分钟数据时避免重复请求
      factorCodes: [],
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
  computed: {
    ...mapState({
      portInfo: state => state.portInfo,
    }),
    factorGroup() {                                   // 因子列表数据分组
      return toFactorTree(this.factorList);
    },
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.dataType': function (val) {
      this.$forceUpdate();
      if (val === 'RT') {
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.queryForm.fromTime = getDay(-2);
        this.queryForm.toTime = getDay(0, true, true);
      } else if (val === 'Hour' || val === 'AuditHour') {
        this.queryForm.fromDate = getDay(-30, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
      } else {
        this.queryForm.fromDate = getDay(-365, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
      }
      if (val === 'RT') {
        if (this.factorAction !== 2) {
          this.getFactorList();
        } else {
          this.onQueryList();
        }
        this.factorAction = 2;
      } else {
        if (this.factorAction !== 1) {
          this.getFactorList();
        } else {
          this.onQueryList();
        }
        this.factorAction = 1;
      }
    },
    // eslint-disable-next-line
    'portInfo.portId'(val) {
      this.queryForm.portIds = [val];
      this.onQueryList();
    },
  },
  methods: {
    onTabClick() {
      this.queryForm.portIds = [this.portInfo.portId];
      this.getFactorList();
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
      this.handleTabelData();
      this.getItemList();
    },
    handleTabelData() {
      /**
       * 通过已选择的因子code取出该因子的value, text,unit 属性
       */
      this.queryForm.factorList = this.factorList.filter(n => this.factorCodes.includes(n.factorShowCode)).map(n => ({
        factorShowCode: n.factorShowCode,
        factorShowName: n.factorShowName,
        factorName: n.factorName,
        factorCode: n.factorCode,
        unit: n.unit,
      }));
    },
    // 获取因子数据
    getFactorList() {
      this.$http.post('bas/portFactors/valueType', {
        portIds: this.queryForm.portIds || [this.portInfo.portId || ''],
        dataType: this.queryForm.dataType,
        sort: 'factorsName-',
      }).then((response) => {
        if (response.data.success) {
          this.factorList = response.data.data || [];
          this.factorCodes = this.factorList.map(n => n.factorShowCode);
          this.handleTabelData();
          this.onQueryList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      let queryForm = { ...this.queryForm };
      if (this.queryForm.dataType === 'RT') {
        queryForm = {
          isAll: this.queryForm.isAll,
          key: this.queryForm.key,
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          portIds: this.queryForm.portIds,
          factorList: this.queryForm.factorList,
          sort: this.queryForm.sort,
          dataType: this.queryForm.dataType,
        };
      } else {
        queryForm = {
          isAll: this.queryForm.isAll,
          key: this.queryForm.key,
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          factorList: this.queryForm.factorList,
          sort: this.queryForm.sort,
          dataType: this.queryForm.dataType,
        };
      }
      this.$http.post('tpeci/historyData', queryForm, {
        params: { page, rows },
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
      if (this.queryForm.dataType === 'RT') {
        queryForm = {
          isAll: this.queryForm.isAll,
          key: this.queryForm.key,
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          portIds: this.queryForm.portIds,
          factorList: this.queryForm.factorList,
          sort: this.queryForm.sort,
          dataType: this.queryForm.dataType,
        };
      } else {
        queryForm = {
          isAll: this.queryForm.isAll,
          key: this.queryForm.key,
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          factorList: this.queryForm.factorList,
          sort: this.queryForm.sort,
          dataType: this.queryForm.dataType,
        };
      }
      this.$http.post('tpeci/historyData/export', queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `历史数据${new Date().toLocaleDateString()}.xls`;
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
