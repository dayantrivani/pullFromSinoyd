<!-- 排放量数据查询 -->
<template>
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="数据类型：">
        <el-select v-model="queryForm.dataType" style="width: 120px;">
          <el-option
            v-for="item in $enum.get('DATA_TYPE')"
            v-show="['RT', 'Hour', 'Day'].includes(item.value)"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据时间：">
        <div v-if="['RT', 'Minute'].includes(queryForm.dataType)">
          <el-date-picker
            style="width: 160px;"
            v-model="queryForm.fromTime"
            type="datetime"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH:00:00"
            :clearable="false"
            :editable="false"
            @change="onQueryList"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width: 160px;"
            v-model="queryForm.toTime"
            type="datetime"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH:59:59"
            :clearable="false"
            :editable="false"
            @change="onQueryList"
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
            @change="onQueryList"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width: 140px;"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
            @change="onQueryList"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input
          clearable
          v-model="queryForm.key"
          placeholder="请输入企业名称、站点名称"
          style="width: 220px"
          @keyup.enter.native="onQueryList()"
        ></el-input>
      </el-form-item>

      <el-form-item label="因子：">
        <el-select
          style="width:200px;"
          v-model="factorShowCodes"
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
      height="calc(100% - 68px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." fixed width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="行政区域" prop="regionName" fixed min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业名称" prop="psName" fixed min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" fixed min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="数据时间" prop="tstamp" fixed min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column
        v-for="item in queryForm.factorList"
        :key="item.factorShowCode"
        align="center"
        :prop="item.factorShowCode"
        :min-width="getLabelWidth(item.factorShowName, item.unit)"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.factorShowName }}</p>
          <p v-show="item.unit" style="line-height: 20px">
            （{{item.unit}}）
          </p>
          <span style="display: none">{{ row }}</span>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <Transfer-port ref="port" @getQueryData="getQueryData"></Transfer-port>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { getDay, tableTitleLen, toFactorTree } from '@/libs/tools';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';

export default {
  name: 'ConcentrationQuery',
  mixins: [queryList],
  components: { SelectPort, TransferPort },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      url: 'tpeci/historyData',
      isAuto: false,
      queryForm: {
        psId,
        key: '',
        isAll: true,
        portIds: [],
        factorList: [],
        dataType: 'Hour',
        fromTime: getDay(-1),
        toTime: getDay(0, true, true),
        fromDate: getDay(-2, false, false),
        toDate: getDay(0, false, false),
        sort: 'PsName+,PortName+,Tstamp-',
      },
      interval: 2, // 设置时间间隔 2天
      itemList: [],
      factorShowCodes: [], // 选择因子showCode
      factorList: [],
      portList: [], // 站点数据组
      downloading: false,
    };
  },
  created() {
    this.getPortList();
    this.getFactorList();
  },
  computed: {
    factorGroup() {                                   // 因子列表数据分组
      return toFactorTree(this.factorList);
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
    factorShowCodes() {
      this.onQueryList();
    },
    // eslint-disable-next-line
    'queryForm.dataType': function (val) {
      if (val === 'RT') {
        this.queryForm.fromDate = '';
        this.queryForm.toDate = '';
        this.queryForm.fromTime = getDay(0);
        this.queryForm.toTime = getDay(0, true, true);
        this.interval = 1; // 设置时间间隔 1天
      } else if (val === 'Hour') {
        this.queryForm.fromDate = getDay(-2, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
        this.interval = 2; // 设置时间间隔 2天
      } else if (val === 'Day') {
        this.queryForm.fromDate = getDay(-7, false, false);
        this.queryForm.toDate = getDay(0, false, false);
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
        this.interval = 7; // 设置时间间隔 7天
      }
      this.getFactorList();
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
      this.queryForm.isAll = portIds.length === 0;
      this.onQueryList();
    },
    // 站点选择
    selectPort() {
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    /* 接口方法 */
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          portType: 1,
          childPortType: 5,
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
    getFactorList() {              // 获取因子列表
      this.$http.get('cfg/pageShowItem', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          pageShowMainCode: 'TPECI_DataQueryAvg',
          sort: 'orderNum-',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          if (this.queryForm.dataType === 'RT') {
            this.factorList = response.data.data.filter(n => n.valueType === 'Rtd');
            this.factorShowCodes = response.data.data.filter(n => n.isShow && n.valueType === 'Rtd').map(n => n.factorShowCode);
          } else {
            this.factorList = response.data.data.filter(n => n.valueType !== 'Rtd');
            this.factorShowCodes = response.data.data.filter(n => n.isShow && n.valueType !== 'Rtd').map(n => n.factorShowCode);
          }
          this.onQueryList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取记录列表
    getItemList() {
      this.queryForm.factorList = this.factorList.filter(n => this.factorShowCodes.includes(n.factorShowCode)).map(n => ({
        factorShowCode: n.factorShowCode,
        factorShowName: n.factorShowName,
        factorName: n.factorName,
        factorCode: n.factorCode,
        unit: n.unit,
        unitCou: n.unitCou,
      }));
      let stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      let queryForm = {
        key: this.queryForm.key,
        isAll: this.queryForm.isAll,
        portIds: this.queryForm.portIds,
        factorList: this.queryForm.factorList,
        dataType: this.queryForm.dataType,
        fromDate: this.queryForm.fromDate,
        toDate: this.queryForm.toDate,
        sort: this.queryForm.sort,
      };
      if (this.queryForm.dataType === 'RT') {
        stamp = new Date(this.queryForm.toTime).getTime() - new Date(this.queryForm.fromTime).getTime();
        queryForm = {
          key: this.queryForm.key,
          isAll: this.queryForm.isAll,
          portIds: this.queryForm.portIds,
          factorList: this.queryForm.factorList,
          dataType: this.queryForm.dataType,
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          sort: this.queryForm.sort,
        };
      }
      if (stamp > this.interval * 3600 * 1000 * 24) {
        this.$message.warning(`请选择${this.interval}天内的时间`);
      } else {
        this.queryItemList(this.url, queryForm);
      }
    },
    queryItemList(url, queryForm) {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post(url, { ...queryForm }, {
        params: { page, rows },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
    // 下载数据
    onDownload() {
      this.downloading = true;
      let stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      let queryForm = {
        key: this.queryForm.key,
        isAll: this.queryForm.isAll,
        portIds: this.queryForm.portIds,
        factorList: this.queryForm.factorList,
        dataType: this.queryForm.dataType,
        fromDate: this.queryForm.fromDate,
        toDate: this.queryForm.toDate,
        sort: this.queryForm.sort,
      };
      if (this.queryForm.dataType === 'RT') {
        stamp = new Date(this.queryForm.toTime).getTime() - new Date(this.queryForm.fromTime).getTime();
        queryForm = {
          key: this.queryForm.key,
          isAll: this.queryForm.isAll,
          portIds: this.queryForm.portIds,
          factorList: this.queryForm.factorList,
          dataType: this.queryForm.dataType,
          fromTime: this.queryForm.fromTime,
          toTime: this.queryForm.toTime,
          sort: this.queryForm.sort,
        };
      }
      if (stamp > this.interval * 3600 * 1000 * 24) {
        this.$message.warning(`请选择${this.interval}天内的时间`);
      } else {
        this.$http.post(`${this.url}/export`, { ...queryForm }, {
          'responseType': 'blob',
        }).then((response) => {
          const filename = `浓度查询${new Date().toLocaleDateString()}.xls`;
          this.$tools.downloadFile(response, filename);
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.downloading = false;
        });
      }
    },
    /* 特殊方法 */
    getLabelWidth(label, unit) {   // 计算动态列宽度
      const labelLen = tableTitleLen(label);
      const unitLen = tableTitleLen(unit ? `(${unit})` : '');
      return labelLen >= unitLen ? labelLen : unitLen;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
