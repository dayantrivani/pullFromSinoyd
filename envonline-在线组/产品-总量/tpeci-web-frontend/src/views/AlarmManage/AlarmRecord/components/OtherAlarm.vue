<template>
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="时间：">
        <el-date-picker
          style="width:135px"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:135px"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryForm.alarmTypeIds"
          multiple
          collapse-tags
          clearable
          placeholder="请选择报警类型"
          style="width: 160px;">
          <el-option
            v-for="(item,index) in select.alarmTypeList"
            :key="index"
            :value="item.id"
            :label="item.alarmTypeName">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="状态：">
        <el-select v-model="queryForm.dealStatus" style="width: 90px;">
          <el-option :value="''" label="全部"></el-option>
          <el-option
            v-for="(item,index) in $enum.get('ALARM_DEALTYPE')"
            :key="index"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="站点：">
        <select-port
          width="180px"
          v-model="queryForm.portIds"
          filterable
          :options="select.portList"
          :field="[
            { name: 'psName', key: 'psId' },
            { name: 'portName', key: 'id' }
          ]">
        </select-port>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
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
      <el-table-column align="center" label="No." min-width="50" type="index" :index="index"></el-table-column>
      <!-- <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-plus" @click="onClickDeal(scope.row)">管理</el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="行政区域" prop="regionName" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警时间" prop="alarmTstamp" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警类型" prop="alarmTypeName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警内容" prop="alarmContent" min-width="300" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="状态" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.dealStatus">已处理</el-tag>
          <el-tag type="danger" v-else-if="!scope.row.dealStatus">未处理</el-tag>
        </template>
      </el-table-column> -->
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <!-- <dialog-form ref="dialogForm" title="报警通知基本信息" @getItemList="getItemList"/>
    <dialog-item ref="dialogItem"/> -->
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';
import { queryList } from '@/global/libs/mixins';
import SelectPort from '@/components/widgets/select-port';
// import DialogForm from './components/DialogForm.vue';
// import DialogItem from './components/DialogItem.vue';

export default {
  name: 'OtherAlarm',
  mixins: [queryList],
  components: {
    SelectPort,
    // DialogForm,
    // DialogItem,
  },
  data() {
    return {
      isAuto: false,
      url: 'alarm/alarmRecord',
      loading: false,
      downloading: false,
      alarmTypeIdsList: [], // 必传报警类型
      queryForm: {
        fromDate: formatDate(new Date(new Date().getTime() - 2 * 24 * 3600000), 'Y-m-d'),
        toDate: formatDate(new Date(), 'Y-m-d'),
        portIds: [],
        alarmTypeIds: [],
        isAll: true,
        systemTypeCode: 'TpeciSystem', //  TpeciSystem 总量 WaterSystem水 AirSystem 气
        dealStatus: '',
      },
      select: {
        portList: [],
        alarmTypeList: [],
      },
      itemList: [],
    };
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
    openDialog() {                 // 选中该tab页时
      this.queryForm.fromDate = formatDate(new Date(new Date().getTime() - 2 * 24 * 3600000), 'Y-m-d');
      this.queryForm.toDate = formatDate(new Date(), 'Y-m-d');
      this.getPortList();
      this.getAlarmTypeList();
    },
    onChangeCheck(val) {           // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    // onClickDeal(row) {             // 点击管理
    //   // row.dealStatus 0 未处理 打开表单对话框，1 已处理 打开列表对话框
    //   if (row.dealStatus) {
    //     this.$refs.dialogItem.openDialog(row, 'id');
    //   } else {
    //     this.$refs.dialogForm.openDialog(row, 'id');
    //   }
    // },

    /** 接口层 */
    getPortList() {                // 获取排口点位列表
      this.alarmTypeIdsList = [];
      this.select.portList = [];
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          childPortType: 5,
          portType: 1,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data || [];
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getAlarmTypeList() {           // 获取报警类型列表
      this.select.alarmTypeList = [];
      this.$http.post('alarm/alarmType/code?page=1&rows=1000000', {
        alarmTypeCodes: ['AlarmCouWarn', 'AlarmCou', 'AlarmValveClose'],
        // alarmTypeCodes: ['AlarmEmissionsWarn', 'AlarmEmissions', 'AlarmValveClose'],
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.alarmTypeList = response.data.data;
          this.alarmTypeIdsList = this.select.alarmTypeList.map(item => item.id);
          this.getItemList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList() {                // 获取记录列表
      this.loading = true;
      this.selectedIds = [];
      this.itemList = [];
      const { page, rows } = this.pager;
      let body = this.queryForm;
      if (this.queryForm.alarmTypeIds.length === 0) body = {  ...this.queryForm, alarmTypeIds: this.alarmTypeIdsList };
      this.$http.post(this.url, { ...body }, {
        params: {
          page,
          rows,
          sort: 'alarmTstamp-,psId+,portId+,alarmLevel+,factorCode+',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data || [];
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
    onDownload() {                 // 下载数据
      this.downloading = true;
      const { page, rows } = this.pager;
      let body = this.queryForm;
      if (this.queryForm.alarmTypeIds.length === 0) {
        body = {  ...this.queryForm, alarmTypeIds: this.alarmTypeIdsList };
      }
      this.$http.post('alarm/alarmRecord/export', {
        ...body,
        isExportAlarmOverProof: false,
      }, {
        params: {
          page,
          rows,
          sort: 'alarmTstamp-,psId+,portId+,alarmLevel+,factorCode+',
        },
        responseType: 'blob',
      }).then((response) => {
        const fileName = `报警通知${new Date().toLocaleDateString()}.xls`;
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
