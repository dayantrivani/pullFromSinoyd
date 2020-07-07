<!-- 排放量数据查询 -->
<template>
  <el-card>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="关键字：">
        <el-input
          v-model="queryForm.key"
          clearable
          style="width:220px"
          placeholder="请输入企业名称、站点名称"
          @keyup.enter.native="onQueryList()">
        </el-input>
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
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." fixed width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" fixed width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-eye" @click="onClickInfo(scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="行政区域" prop="regionName" min-width="100" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="160" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" fixed min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="最新数据时间" prop="tstamp" fixed min-width="160" show-overflow-tooltip></el-table-column>
      <div v-for="item in queryForm.factorList" :key="item.factorShowCode">
        <el-table-column :label="`${item.factorName}已排放量${item.unit ?  `(${item.unit})` : ''}`" align="center">
          <el-table-column align="center">
            <template slot="header" slot-scope="{ row }">
              <span hidden>{{row}}</span>
              <span>当日</span>
            </template>
            <template slot-scope="{ row }">
              {{row[`${item.factorCode}-DPQ`]}}
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="{ row }">
              <span hidden>{{row}}</span>
              <span>当月</span>
            </template>
            <template slot-scope="{ row }">
              {{row[`${item.factorCode}-MPQ`]}}
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="{ row }">
              <span hidden>{{row}}</span>
              <span>当年</span>
            </template>
            <template slot-scope="{ row }">
              {{row[`${item.factorCode}-YPQ`]}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          align="center"
          :prop="`${item.factorCode}-YUQ`"
          :min-width="getLabelWidth(`${item.factorName}当年剩余量`, item.unit)"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }" slot="header">
            <p style="line-height: 20px">{{ `${item.factorName}当年剩余量` }}</p>
            <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
            <span style="display: none">{{ row }}</span>
          </template>
        </el-table-column>
      </div>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <Transfer-port ref="port" @getQueryData="getQueryData"></Transfer-port>
    <dialog-form ref="dialog" @query="getItemList"></dialog-form>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import { tableTitleLen, toFactorTree } from '@/libs/tools';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';
import DialogForm from './components/DialogForm';

export default {
  name: 'EmissionQuery',
  mixins: [queryList],
  components: { SelectPort, TransferPort, DialogForm },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      url: 'tpeci/realtime',
      isAuto: false,
      queryForm: {
        psId,
        key: '',
        portIds: [],
        isAll: true,
        factorList: [],
      },
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
    onClickInfo(row) {
      this.$refs.dialog.openDialog(row);
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
          pageShowMainCode: 'TPECI_DataQueryCou',
          sort: 'orderNum-',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.factorList = response.data.data;
          this.factorShowCodes = response.data.data.filter(n => n.isShow).map(n => n.factorShowCode);
          this.onQueryList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      const factorList = this.factorList.filter(n => this.factorShowCodes.includes(n.factorShowCode)).map(n => ({
        factorShowCode: n.factorShowCode,
        factorShowName: n.factorShowName,
        factorName: n.factorName,
        factorCode: n.factorCode,
        unitCou: n.unitCou,
        unit: n.unit,
      }));
      this.queryForm.factorList = factorList;
      this.$http.post(this.url, { ...this.queryForm }, {
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
      this.$http.post(`${this.url}/export`, { ...this.queryForm }, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `排放量数据查询${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
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
