<template>
  <!-- 报警管理 - 超标报警 -->
  <div class="fill-h">
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="时间：">
        <!-- <el-date-picker
          v-model="dateRange"
          :clearable="false"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickStart">
        </el-date-picker>
        <el-form-item label="数据时间："> -->
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

      <el-form-item label="类型：">
        <el-select
          placeholder="请选择报警类型"
          v-model="queryForm.alarmTypeIds"
          multiple
          collapse-tags
          style="width: 180px;">
          <el-option
            v-for="(item,index) in alarmTypeList"
            :key="index"
            :value="item.id"
            :label="item.alarmTypeName">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="报警等级：">
        <el-select v-model="queryForm.alarmLevel">
          <el-option :value="-1" label="全部"></el-option>
          <el-option
            v-for="(item,index) in $enum.get('ALARM_LEVEL')"
            :key="index"
            :value="item.value"
            :label="item.label">
          </el-option>
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
        <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="openTransfer">站 点</el-button>
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
      @row-dblclick="rowDblclick"
    >
      <el-table-column align="center" label="No." min-width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="区域" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警时间" prop="alarmTstamp" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警类型" prop="alarmTypeName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警等级" prop="alarmLevelName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="超标因子" prop="factorName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="超标值" prop="factorValue" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="标准值" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.lowValue}}~{{scope.row.upperValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警内容" prop="alarmContent" min-width="180" show-overflow-tooltip></el-table-column>
    </el-table>

    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <!-- 双击行 -->
    <form-echarts-dialog ref="dialog"/>
    <Transfer-port ref="port" @getQueryData="getPortIdsList" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';
import { queryList } from '@/global/libs/mixins';
import FormEchartsDialog from './FormEchartDialog.vue';
import SelectPort from '@/components/widget/select-port';
import TransferPort from '@/components/widget/transfer-port';

export default {
  name: 'ExceedAlarm',
  mixins: [queryList],
  components: {
    FormEchartsDialog,
    SelectPort,
    TransferPort,
  },
  data() {
    return {
      isAuto: false,
      url: 'alarm/alarmRecord',               // 报警列表接口地址
      alarmTypeIds: [],                       // 必传报警类型,接口获取到的报警类型id集合
      queryForm: {
        fromDate: formatDate(new Date(new Date().getTime() - 2 * 24 * 3600000), 'Y-m-d'),
        toDate: formatDate(new Date(), 'Y-m-d'),
        alarmLevel: -1,
        portIds: [],
        alarmTypeIds: [],
        isAll: true,
        portType: 1,                           // 1 废水 2 废气
        // childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES', this.amcsType),
      },
      // pickerOneDate: '',
      // pickStart: {
      //   onPick: ({ maxDate, minDate }) => {
      //     this.pickerOneDate = minDate.getTime();
      //     if (maxDate) {
      //       this.pickerOneDate = '';
      //     }
      //   },
      //   disabledDate: (time) => {
      //     if (this.pickerOneDate !== '') {
      //       const date = 30 * 24 * 3600000;
      //       const max = this.pickerOneDate + date - 24 * 3600 * 1000;
      //       const min = this.pickerOneDate - date;
      //       return time.getTime() > max || time.getTime() < min || time.getTime() > new Date();
      //     }
      //     return time.getTime() > new Date();
      //   },
      // },
      itemList: [],
      portList: [],
      alarmTypeList: [],
      downloading: false,
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
    // dateRange: {
    //   get() {
    //     // 为何为'', 当dateRange值不为 '' 时,时间选项会从 1970年1月1日开始
    //     return (!this.queryForm.fromDate && !this.queryForm.toDate)
    //       ? ''
    //       : [this.queryForm.fromDate, this.queryForm.toDate];
    //   },
    //   set(val) {
    //     [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
    //   },
    // },
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
  created() {
    this.queryForm.childPortTypes = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
  },
  methods: {
    onTabClick(num) {           // num: 1 表示废水 2 表示废气
      this.queryForm.portType = num;
      this.getPortList();
      this.getAlarmTypeList();
    },
    onChangeCheck(val) {        // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    rowDblclick(row) {          // 双击列表行出现 echarts 图
      this.$refs.dialog.openDialog({
        ...row,
        portType: this.amcsType,
      });
    },
    openTransfer() {            // 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortIdsList(portIds) {   // 获取站点id的合集
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },

    /** 请求层 */
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
    getAlarmTypeList() {        // 获取报警类型列表
      /**
       *  只需要查找AlarmOverProofHour和AlarmOverProofDay类型的的报警类型
       *  因为需要对应的 Id 因此并没有用前端自己枚举,而是调用接口
      */
      this.$http.post('alarm/alarmType/code?page=1&rows=1000000', {
        alarmTypeCodes: ['AlarmOverProofHour', 'AlarmOverProofDay'],
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.alarmTypeList = response.data.data;
          this.alarmTypeIds = this.alarmTypeList.map(item => item.id);
          this.getItemList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList() {             // 获取记录列表
      /**
       * 1. selectedIndexs 清空列表选中 -- 在混合中定义
       * 2. queryForm      查询参数对象
       * 3. if             为避免用户传空数组的报警类型字段,当判断为空时
       *    将接口获取到的所有类型id放入该数组中
       */
      if (!this.isInTimerange()) return;
      this.loading = true;
      this.selectedIndexs = [];
      const { page, rows } = this.pager;
      const params = { ...this.queryForm };
      if (params.alarmTypeIds.length === 0) {
        params.alarmTypeIds = this.alarmTypeIds;
      }
      this.$http.post(this.url, params, {
        params: {
          page,
          rows,
          sort: 'psId+,portId+,alarmTstamp-,alarmLevel+,factorCode+',
        },
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
    onDownload() {              // 下载数据
      if (!this.isInTimerange()) return;
      this.downloading = true;
      const params = { ...this.queryForm };
      if (params.alarmTypeIds.length === 0) {
        params.alarmTypeIds = this.alarmTypeIds;
      }
      this.$http.post('alarm/alarmRecord/export', {
        ...params,
        isExportAlarmOverProof: true,
      }, {
        responseType: 'blob',
      }).then((response) => {
        const filename = `报警记录${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },

    // 特殊方法
    isInTimerange() { // 判断当前日期跨度是否超过30天
      let stamp = 0;
      let res;
      stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      if (stamp > 30 * 3600 * 1000 * 24) {
        res = false;
        this.$message.warning('请选择30天内的时间');
      } else {
        res = true;
      }
      return res;
    },
  },
};
</script>
