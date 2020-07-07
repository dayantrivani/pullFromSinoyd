<template>
  <!-- 数据查询 -->
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="站点类型：">
        <el-select v-model="queryForm.childPortType" @change="onChangeChildPortType">
          <el-option
            v-for="item in childPortTypeList"
            :key="item.value"
            :value="item.dictValue"
            :label="item.dictName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监管级别：">
        <el-select
          style="width: 90px;"
          v-model="queryForm.keyPollutant"
          @change="onChangeKeyPollutant"
        >
          <el-option :value="-1" label="全部">
          </el-option>
          <el-option
            v-for="(item, key) in $enum.get('KEY_POLLUTANT')"
            :key="key"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="queryForm.keyPollutant === 1">
        <el-date-picker
          v-model="queryForm.ye"
          value-format="yyyy"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
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
        <div v-if="['RT', 'Minute'].includes(queryForm.dataType)">
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
            value-format="yyyy-MM-dd HH:59:59"
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
      <el-form-item label="因子：">
        <el-select
          class="select-multiple"
          style="width:180px;"
          v-model="queryForm.factorCodes"
          multiple
          collapse-tags
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
      <el-form-item label="站点：">
        <select-port
          width="180px"
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
      <el-table-column label="区域" prop="regionName" min-width="150" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="200" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" fixed min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" fixed min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column
        align="center"
        v-for="item in dynamicCol"
        :key="item.factorShowName"
        :label="item.factorShowName"
        :prop="item.factorShowCode"
        :min-width="getLabelLen(item.factorShowName, item.unit)"
      >
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.factorShowName }}</p>
          <p v-show="item.unit">{{ item.unit ? `（${item.unit}）` : '' }}</p>
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
    <Transfer-port
      ref="port"
      @getQueryData="getQueryData"
      :childPortTypes="queryForm.childPortType"
      :keyPollutant="queryForm.keyPollutant"></Transfer-port>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay, tableTitleLen, toFactorTree } from '@/libs/tools';
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
        factorCodes: [],
        portIds: [],
        isAll: true,
        keyPollutant: -1,
        ye: -1,
        fromDate: getDay(-1, false, false),
        toDate: getDay(0, false, false),
        fromTime: '',
        toTime: '',
        portType: this.amcsType,
        childPortType: '1',
        dataType: 'Hour',
        sort: 'PsName,PortName,Tstamp-',
      },
      pickerOneDate: '',
      itemList: [],
      factorList: [],
      childPortTypeList: [],
      portList: [],                // 站点数据组
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
    this.getChildPortTypeList();
    // this.getItemList();
  },
  computed: {
    ...mapState({
      portInfo: state => state.portInfo,
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
    factorGroup() {                                   // 因子列表数据分组
      return toFactorTree(this.factorList);
    },
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.dataType': function (val) {
      if (val === 'RT') {
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.queryForm.fromTime = getDay(-1);
        this.queryForm.toTime = getDay(0, true, true);
      } else if (val === 'Minute') {
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.queryForm.fromTime = getDay(-6);
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
      this.pickerOneDate = '';
      this.getFactorList();
    },
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
    onChangeCheck(val) {         // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    getQueryData(portIds) {      // 穿梭框确认查询主列表数据
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },
    selectPort() {               // 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    onChangeChildPortType() {    // 改变站点类型
      this.getFactorList();
      this.getPortList();
    },
    onChangeKeyPollutant(val) {  // 改变监管级别
      this.getPortList();
      if (val === 1) {
        this.queryForm.ye = `${new Date().getFullYear()}`;
      } else {
        this.queryForm.ye = -1;
      }
    },

    /** 接口层 */
    getChildPortTypeList() {     // 获取测点类型数据
      this.$http.get(`sys/enumCode/child/PortType/${this.amcsType === 1 ? 'Water' : 'Air'}`).then((response) => {
        if (response.data) {
          this.childPortTypeList = response.data || [];
          this.childPortTypeList = this.childPortTypeList.filter((n) => {
            const childPortTypesArr = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
            return childPortTypesArr.includes(n.dictValue) || childPortTypesArr.includes(n.dictValue - 0);
          });
          this.getFactorList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getFactorList() {            // 获取因子数据
      this.$http.get('cfg/pageShowItem', {
        params: {
          // eslint-disable-next-line
          pageShowMainCode: `${this.queryForm.dataType === 'RT' ? 'real' : 'history'}For${this.$enum.getLabel('LABEL_CODE', this.amcsType)}0${this.queryForm.childPortType}`,
          isEnabled: true,
          page: 1,
          rows: 100000,
          sort: 'valueType+,orderNum',
        },
      }).then((response) => {
        if (response.data.success) {
          this.factorList = response.data.data || [];
          this.queryForm.factorCodes = this.factorList.filter(v => v.isShow).map(factor => factor.factorShowCode);
          this.onQueryList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList() {              // 获取列表数据
      this.itemList = [];
      this.dynamicCol = this.factorList.filter(p => this.queryForm.factorCodes.includes(p.factorShowCode));
      this.dynamicCol.sort((n, m) => { // 排序数组，相同因子放在相邻列
        let temp = 0;
        if (n.factorCode < m.factorCode) {
          temp = -1;
        } else if (n.factorCode > m.factorCode) {
          temp = 1;
        } else {
          temp = 0;
        }
        return temp;
      });
      this.loading = true;
      const { page, rows } = this.pager;
      let url = 'amcs/historyData';
      let queryForm = { ...this.queryForm };
      if (this.queryForm.dataType === 'Minute' || this.queryForm.dataType === 'RT') {
        queryForm = {
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          keyPollutant: this.queryForm.keyPollutant,
          ye: this.queryForm.ye,
          portType: this.queryForm.portType,
          childPortType: this.queryForm.childPortType,
          sort: this.queryForm.sort,
          factorCodes: this.queryForm.factorCodes,
          dataType: this.queryForm.dataType,
        };
      } else if (this.queryForm.dataType === 'monthReport') {
        url = `amcs/report/${this.$enum.getLabel('LABEL_CODE', this.amcsType).toLowerCase()}?sort=tstamp-`;
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          keyPollutant: this.queryForm.keyPollutant,
          ye: this.queryForm.ye,
          portType: this.queryForm.portType,
          childPortType: this.queryForm.childPortType,
          factorCodes: this.queryForm.factorCodes,
          reportType: this.queryForm.dataType,
        };
      } else {
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          keyPollutant: this.queryForm.keyPollutant,
          ye: this.queryForm.ye,
          portType: this.queryForm.portType,
          childPortType: this.queryForm.childPortType,
          sort: this.queryForm.sort,
          factorCodes: this.queryForm.factorCodes,
          dataType: this.queryForm.dataType,
        };
      }
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
    getPortList() {              // 获取站点数据
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.queryForm.childPortType,
          portType: this.amcsType,
          keyPollutant: this.queryForm.keyPollutant,
          sort: 'portName+',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onDownload() {               // 下载数据
      this.downloading = true;
      let url = 'amcs/historyData/export';
      let factorList = this.factorList.filter(n => this.queryForm.factorCodes.includes(n.factorShowCode));
      factorList = factorList.map(n => ({
        factorShowCode: n.factorShowCode,
        factorShowName: n.factorShowName,
        unit: n.unit,
      }));
      let queryForm = { ...this.queryForm, factorList };
      if (this.queryForm.dataType === 'monthReport') {
        url = `amcs/report/${this.$enum.getLabel('LABEL_CODE', this.amcsType).toLowerCase()}/excel?sort=tstamp-`;
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          keyPollutant: this.queryForm.keyPollutant,
          ye: this.queryForm.ye,
          portType: this.queryForm.portType,
          childPortType: this.queryForm.childPortType,
          factorList,
          reportType: this.queryForm.dataType,
        };
      } else if (['RT', 'Minute'].includes(this.queryForm.dataType)) {
        queryForm = {
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          keyPollutant: this.queryForm.keyPollutant,
          ye: this.queryForm.ye,
          portType: this.queryForm.portType,
          childPortType: this.queryForm.childPortType,
          sort: this.queryForm.sort,
          factorList,
          dataType: this.queryForm.dataType,
        };
      } else {
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
          portIds: this.queryForm.portIds,
          isAll: this.queryForm.isAll,
          keyPollutant: this.queryForm.keyPollutant,
          ye: this.queryForm.ye,
          portType: this.queryForm.portType,
          childPortType: this.queryForm.childPortType,
          sort: this.queryForm.sort,
          factorList,
          dataType: this.queryForm.dataType,
        };
      }
      this.$http.post(url, queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.amcsType)}数据查询${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },

    /** 特殊方法 */
    getLabelLen(label, unit) {   // 计算动态列宽度
      const labelLen = tableTitleLen(label);
      const unitLen = tableTitleLen(unit ? `(${unit})` : '');
      return labelLen >= unitLen ? labelLen : unitLen;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
