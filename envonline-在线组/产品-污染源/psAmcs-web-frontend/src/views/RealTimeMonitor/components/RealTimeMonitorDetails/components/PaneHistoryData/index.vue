<template>
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="数据类型：">
        <el-select v-model="queryForm.dataType" style="width: 150px;">
          <el-option
            v-for="item in $enum.get('DATA_TYPE')"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据时间：">
        <div v-if="queryForm.dataType === 'Minute' || queryForm.dataType === 'RT'">
          <el-date-picker
            popper-class="time-picker"
            style="width: 160px;"
            v-model="queryForm.fromTime"
            type="datetime"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH:00:00"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            popper-class="time-picker"
            style="width: 160px;"
            v-model="queryForm.toTime"
            type="datetime"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH:23:59"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </div>
        <div v-else>
          <el-date-picker
            style="width: 140px;"
            v-model="queryForm.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width: 140px;"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </div>
      </el-form-item>

      <!-- <el-form-item label="因子选择：">
        <el-select
          style="width:190px;"
          v-model="queryForm.factorCodes"
          multiple
          collapse-tags
        >
          <el-option
            v-for="(item, key) in factorList"
            :key="key"
            :value="item.factorShowCode"
            :label="item.factorShowName"
          ></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="因子选择：">
        <el-select
          style="width:180px;"
          v-model="queryForm.factorCodes"
          multiple
          collapse-tags
        >
          <el-option-group
            v-for="group in factorGroup"
            :key="group.name"
            :label="group.name">
            <el-option
              v-for="(item, key) in group.children"
              :key="key"
              :label="item.factorShowName"
              :value="item.factorShowCode">
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
      border
      highlight-current-row
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." fixed width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="200" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" fixed min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" fixed min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column
        v-for="item in dynamicCol"
        :key="item.factorShowCode"
        :label="item.factorShowName"
        :prop="item.factorShowCode"
        :min-width="getLabelLen(item.factorShowName, item.unit)"
      >
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.factorShowName }}</p>
          <p v-show="item.unit">{{ item.unit }}</p>
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
// import { formatDate } from '@/global/libs/tools';

export default {
  name: 'OutletHistoryData',
  mixins: [queryList],
  props: ['portType'],
  components: {},
  data() {
    return {
      isAuto: false,
      queryForm: {
        dataType: 'Hour',
        portType: this.portType,
        toDate: getDay(0, false, false),
        fromDate: getDay(-1, false, false),
        fromTime: '',
        toTime: '',
        portId: '',
        factorCodes: [],
        sort: 'PsName,PortName,Tstamp-',
      },
      interval: 30, // 实时数据设置时长2天，分钟数据设置时长7天，小时数据/审核小时数据设置时长30天，日数据/报表日数据设置时长365天
      dateType: {
        type: 'date', // 时间控件的类型 date精确到日 datetime 精确到时
        width: '140px',
        format: '',
      },
      itemList: [],
      factorList: [],
      factorAction: 1, // 因子类型，数据类型Hour,Minute,Day,AuditHour,monthReport为1，RT为2 用于在切换小时，分钟数据时避免重复请求
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
    this.getFactorList();
    // this.getItemList();
  },
  computed: {
    ...mapState({
      portInfo: state => state.portInfo,
    }),
    factorGroup() {                              // 因子列表数据分组
      return toFactorTree(this.factorList);
    },
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.dataType': function (val) {
      // let stamp = 0;
      if (val === 'RT') {
        // stamp = (new Date(this.queryForm.toDate || this.queryForm.toTime).getTime()
        //   - new Date(this.queryForm.fromDate || this.queryForm.fromTime).getTime()) / (3600 * 1000 * 24);
        // if (stamp > 2) {
        this.queryForm.fromTime = getDay(-1);
        this.queryForm.toTime = getDay(0, true, true);
        // } else {
        // this.queryForm.fromTime = formatDate(this.queryForm.fromDate || this.queryForm.fromTime, 'Y-m-d H:i:s');
        // this.queryForm.toTime = this.queryForm.toDate
        // ? formatDate(this.queryForm.toDate, 'Y-m-d 23:59:59') : formatDate(this.queryForm.toTime, 'Y-m-d H:i:s');
        // }
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.interval = 2; // 设置时间间隔 2天
      } else if (val === 'Minute') {
        // stamp = (new Date(this.queryForm.toDate || this.queryForm.toTime).getTime()
        //   - new Date(this.queryForm.fromDate || this.queryForm.fromTime).getTime()) / (3600 * 1000 * 24);
        // if (stamp > 7) {
        this.queryForm.fromTime = getDay(-6);
        this.queryForm.toTime = getDay(0, true, true);
        // } else {
        // this.queryForm.fromTime = formatDate(this.queryForm.fromDate || this.queryForm.fromTime, 'Y-m-d H:i:s');
        // this.queryForm.toTime = this.queryForm.toDate
        // ? formatDate(this.queryForm.toDate, 'Y-m-d 23:59:59') : formatDate(this.queryForm.toTime, 'Y-m-d H:i:s');
        // }
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.interval = 7; // 设置时间间隔 7天
      } else if (val === 'Hour' || val === 'AuditHour') {
        // stamp = (new Date(this.queryForm.toDate || this.queryForm.toTime).getTime()
        //   - new Date(this.queryForm.fromDate || this.queryForm.fromTime).getTime()) / (3600 * 1000 * 24);
        // if (stamp > 30) {
        this.queryForm.fromDate = getDay(-30, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        // } else {
        // this.queryForm.fromDate = formatDate(this.queryForm.fromDate || this.queryForm.fromTime, 'Y-m-d');
        // this.queryForm.toDate = formatDate(this.queryForm.toDate || this.queryForm.toTime, 'Y-m-d');
        // }
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
        this.interval = 30; // 设置时间间隔 30天
      } else {
        // stamp = (new Date(this.queryForm.toDate || this.queryForm.toTime).getTime()
        //   - new Date(this.queryForm.fromDate || this.queryForm.fromTime).getTime()) / (3600 * 1000 * 24);
        // if (stamp > 365) {
        this.queryForm.fromDate = getDay(-365, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        // } else {
        // this.queryForm.fromDate = formatDate(this.queryForm.fromDate || this.queryForm.fromTime, 'Y-m-d H:i:s');
        // this.queryForm.toDate = formatDate(this.queryForm.toDate || this.queryForm.toTime, 'Y-m-d');
        // }
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
        this.interval = 365; // 设置时间间隔 365天
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
      this.onQueryList();
    },
  },
  methods: {
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
      this.handleTabelData();
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
    // 获取因子数据
    getFactorList() {
      this.queryForm.portId = this.portInfo.portId;
      this.$http.post('bas/portFactors/valueType', {
        portIds: [this.portInfo.portId || ''],
        dataType: this.queryForm.dataType,
        // sort: 'factorsName-',
      }).then((response) => {
        if (response.data.success) {
          this.factorList = response.data.data || [];
          this.queryForm.factorCodes = this.factorList.map(factor => factor.factorShowCode);
          this.onQueryList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取列表数据
    getItemList() {
      let stamp = 0;
      this.queryForm.portId = this.portInfo.portId;
      let url = 'amcs/historyData';
      let queryForm = { ...this.queryForm };
      if (this.queryForm.dataType === 'monthReport') {
        if (this.queryForm.portType === 1) url = 'amcs/report/water?sort=tstamp-';
        if (this.queryForm.portType === 2) url = 'amcs/report/air?sort=tstamp-';
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portId: this.queryForm.portId,
          factorCodes: this.queryForm.factorCodes,
          portType: this.queryForm.portType,
          reportType: this.queryForm.dataType,
        };
        stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      } else if (['Minute', 'RT'].includes(this.queryForm.dataType)) {
        queryForm = {
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          portId: this.queryForm.portId,
          factorCodes: this.queryForm.factorCodes,
          portType: this.queryForm.portType,
          dataType: this.queryForm.dataType,
          sort: 'Tstamp-',
        };
        stamp = new Date(this.queryForm.toTime).getTime() - new Date(this.queryForm.fromTime).getTime();
      } else {
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portId: this.queryForm.portId,
          factorCodes: this.queryForm.factorCodes,
          portType: this.queryForm.portType,
          dataType: this.queryForm.dataType,
          sort: 'Tstamp-',
        };
        stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      }
      if (stamp > this.interval * 3600 * 1000 * 24) {
        this.$message.warning(`请选择${this.interval}天内的时间`);
      } else {
        this.queryItemList(url, queryForm);
      }
    },
    queryItemList(url, queryForm) {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post(url, queryForm, {
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
      let url = 'amcs/historyData/export';
      let queryForm = { ...this.queryForm };
      const factorList = this.factorList.filter(n => this.queryForm.factorCodes.includes(n.factorShowCode)).map(n => ({
        factorShowCode: n.factorShowCode,
        factorShowName: n.factorShowName,
        unit: n.unit,
      }));
      if (this.queryForm.dataType === 'monthReport') {
        if (this.queryForm.portType === 1) url = 'amcs/report/water/excel?sort=tstamp-';
        else if (this.queryForm.portType === 2) url = 'amcs/report/air/excel?sort=tstamp-';
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portId: this.queryForm.portId,
          factorList,
          portType: this.queryForm.portType,
          reportType: this.queryForm.dataType,
        };
      } else if (['Minute', 'RT'].includes(this.queryForm.dataType)) {
        queryForm = {
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          portId: this.queryForm.portId,
          factorList,
          portType: this.queryForm.portType,
          dataType: this.queryForm.dataType,
          sort: 'Tstamp-',
        };
      } else {
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portId: this.queryForm.portId,
          factorList,
          portType: this.queryForm.portType,
          dataType: this.queryForm.dataType,
          sort: 'Tstamp-',
        };
      }
      this.$http.post(url, queryForm, {
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
