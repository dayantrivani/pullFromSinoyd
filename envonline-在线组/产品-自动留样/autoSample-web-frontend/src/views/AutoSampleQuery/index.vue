<template>
  <!-- 自动留样查询 -->
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item>
          <el-date-picker
            style="width: 220px"
            v-model="date"
            unlink-panels
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <select-tree-lazy
            :label="region.regionLabel"
            placeholder="请选择行政区域"
            v-model="region.regionCodeId"
            @setLabel="setLabel"/>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryForm.portIds"
            placeholder="请选择点位"
            filterable
            multiple
            style="width:235px"
            class="z-pointer">
            <el-option v-for="(item, key) in portList" :key="key" :label="item.portName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-file-invoice" @click="$refs.dialog.openDialog()">站 点</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.factorCodes" placeholder="请选择因子" multiple style="width:235px" class="z-pointer">
            <el-option v-for="(item, key) in factorList"
              :key="key"
              :label="item.factorShowName"
              :value="item.factorShowCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-upload" @click="onExport">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column property="regionName" min-width="80" label="行政区域" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="psName" min-width="180" label="企业名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="portName" min-width="200" label="排口名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="tstamp" min-width="160" label="数据时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in gridFactorList" :key="index"
        :property="item.factorShowCode"
        min-width="135"
        :label="item.factorShowName"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="scope.row[item.factorShowCode].includes(':') ? 'color: red;' : ''">
            {{scope.row[item.factorShowCode].split(':')[scope.row[item.factorShowCode].split(':').length - 1]}}
          </span>
        </template>
      </el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" title="站点选择">
      <div class="mar-l-sm mar-y-xs">
        <el-form inline :model="queryForm">
          <el-form-item label="行政区域：">
            <select-tree-lazy
              :label="region.regionLabel"
              placeholder="行政区域"
              v-model="region.regionCodeId"
              @setLabel="setLabel"/>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="success" icon="fas fa-check" @click="onClickCheck">确 认</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-transfer
        v-model="queryForm.portIds"
        :titles="['待选', '已选']"
        style="height: 400px"
        :data="portList"
        :props="{
          key: 'id',
          label: 'portName'
        }">
      </el-transfer>
      <div class="pad-b-xs"></div>
    </dialog-modal>
  </el-card>
</template>

<script>
import SelectTreeLazy from '@/components/global/SelectTreeLazy';
import { queryList } from '@/plugins/mixins';

export default {
  name: 'AutoSampleQuery',
  components: { SelectTreeLazy },
  mixins: [queryList],
  data() {
    return {
      isAuto: false,
      region: { // 行政区域
        regionLabel: '',
        regionCodeId: '',
      },
      queryForm: {
        fromDate: this.$hp.formatDate(new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6)),
          'Y-m-d'),
        toDate: this.$hp.formatDate(new Date(), 'Y-m-d'),
        portIds: [],
        factorCodes: [],
        sort: 'Tstamp-',
        isAll: true,
      },
      itemList: [],
      portList: [], // 点位列表
      factorList: [], // 因子列表
      pager: {
        page: 1,
        rows: 15,
        total: 1,
      },
    };
  },
  computed: {
    date: {
      get() {
        let date;
        if (this.queryForm.fromDate !== '' && this.queryForm.toDate !== '') {
          date = [this.queryForm.fromDate, this.queryForm.toDate];
        } else {
          date = '';
        }
        return date;
      },
      set(val) {
        if (val) {
          [this.queryForm.fromDate, this.queryForm.toDate] = val;
        } else {
          [this.queryForm.fromDate, this.queryForm.toDate] = ['', ''];
        }
      },
    },
    gridFactorList() {
      return this.factorList.filter(n => this.queryForm.factorCodes.includes(n.factorShowCode));
    },
  },
  watch: {
    'region.regionCodeId': {
      handler(val) {
        if (!val) {
          this.region.regionLabel = '';
        }
        this.queryForm.portIds = [];
        this.getPortList();
      },
      deep: true,
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
  created() {
    this.getPortList();
    this.getFactorList();
  },
  methods: {
    setLabel(val) { // 行政区选择储存label值
      this.region.regionLabel = val;
      this.$nextTick(() => {
        // this.getPortList();
      });
    },
    onChangeCheck(val) { // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    onClickCheck() {
      this.$refs.dialog.closeDialog();
      this.onQueryList();
    },
    onClickEdit() {},
    // 获取记录列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post('autoSample/historyData', this.queryForm, {
        params: {
          page,
          rows,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.total = response.data.total || response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    getPortList() {
      // this.loading = true;
      this.$http.get('bas/portInfo/queryAuthority/?page=1&rows=100000&childPortType=4&portType=1&sort=portName', {
        params: {
          regionCodeId: this.region.regionCodeId,
        },
      }).then((response) => {
        if (response.data.success) {
          this.portList = response.data.rows || response.data.data || response.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
    getFactorList() {
      // this.loading = true;
      this.$http.get('cfg/pageShowItem?page=1&rows=100000', {
        params: {
          pageShowMainCode: 'historyForSample',
          isEnabled: true,
        },
      }).then((response) => {
        if (response.data.success) {
          this.factorList = response.data.rows || response.data.data || response.data;
          this.queryForm.factorCodes = this.factorList.filter(n => n.isShow).map(n => n.factorShowCode);
          this.getItemList();
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
    onExport() {
      let factorList = this.factorList.filter(n => this.queryForm.factorCodes.includes(n.factorShowCode));
      factorList = factorList.map(n => ({
        factorShowCode: n.factorShowCode,
        factorShowName: n.factorShowName,
        unit: n.unit,
      }));
      this.$http.post('autoSample/historyData/export', {
        ...this.queryForm,
        factorList,
        sort: 'Tstamp-',
      }, {
        responseType: 'arraybuffer',
      }).then((response) => {
        const fileName = `自动监测数据${new Date().getTime()}.xls`;
        const blob = new Blob([response.data], { type: 'application/x-xls' });
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
