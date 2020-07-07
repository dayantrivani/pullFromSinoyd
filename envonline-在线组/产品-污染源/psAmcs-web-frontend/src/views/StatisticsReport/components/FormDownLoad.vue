<template>
  <dialog-modal ref="dialog" size="mini" title="自定义导出" @close="closeDialog">
    <el-form :model="queryForm" class="mar-t-xs" label-width="80px">
      <el-row :gutter="10">

        <el-col :span="24">
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
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <date-num v-model="queryForm.ye" :isDialog="true" :keyPollutant="queryForm.keyPollutant"/>
        </el-col>

        <el-col :span="24">
          <el-form-item label="报表类型：">
            <el-select v-model="queryForm.reportType">
              <el-option
                v-for="item in select.reportTypeList"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="queryForm.reportType === 'quarterReport' ? 24 : 12">
          <el-form-item label="开始时间：">
            <el-date-picker
              v-model="queryForm.fromDate"
              v-if="type === 'date'"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerstartday"
              :clearable="false">
            </el-date-picker>
            <el-date-picker
              v-model="time.vmodelmonth[0]"
              v-if="type === 'month'"
              type="month"
              value-format="yyyy-MM"
              format="yyyy-MM"
              :picker-options="pickerstartmonth"
              :clearable="false">
            </el-date-picker>
            <el-date-picker
              v-model="time.vmodelyear[0]"
              v-if="type === 'year'"
              type="year"
              :picker-options="pickerstartyear"
              :style="{ width: queryForm.reportType === 'quarterReport' ? '94px!important' : '100%' }"
              :clearable="false">
            </el-date-picker>
            <el-select v-model="time.quarterLevel[0]" v-show="isShowQuarter"
              style="width: calc(100% - 100px)!important;margin-left: 6px;">
              <el-option
                v-for="(item, index) in select.quarterLevelList"
                :key="index"
                :value="item.value"
                :label="item.label"
                :disabled="isDisabledStart(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="queryForm.reportType === 'quarterReport' ? 24 : 12">
          <el-form-item label="结束时间：">
            <el-date-picker
              v-model="queryForm.toDate"
              v-if="type === 'date'"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerendday"
              :clearable="false">
            </el-date-picker>
            <el-date-picker
              v-model="time.vmodelmonth[1]"
              v-if="type === 'month'"
              type="month"
              value-format="yyyy-MM"
              format="yyyy-MM"
              :picker-options="pickerendmonth"
              :clearable="false">
            </el-date-picker>
            <el-date-picker
              v-model="time.vmodelyear[1]"
              v-if="type === 'year'"
              type="year"
              :picker-options="pickerendyear"
              :style="{ width: queryForm.reportType === 'quarterReport' ? '94px!important' : '100%' }"
              :clearable="false">
            </el-date-picker>
            <el-select v-model="time.quarterLevel[1]" v-show="isShowQuarter"
              style="width: calc(100% - 100px)!important;margin-left: 6px;">
              <el-option
                v-for="(item, index) in select.quarterLevelList"
                :key="index"
                :value="item.value"
                :label="item.label"
                :disabled="isDisabledEnd(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" @click="onClickSave()">保 存</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import selectPort from '@/components/widget/select-port';
import { analyzeResp } from '@/global/libs/util';
import { getDay } from '@/libs/tools';
import DateNum from '@/components/widget/date-num';

export default {
  mixins: [],
  provide() {                       // 仅用于监管级别date-num组件
    return { app: this };
  },
  props: {
    // 废水(1),烟气(2)
    portType: {
      type: Number,
      default: 1,
    },
  },
  components: {
    selectPort,
    DateNum,
  },
  data() {
    return {
      loading: false,
      type: 'date',              // 日期控件类型
      isShowQuarter: false,      // 是否显示季度下拉框
      select: {                  // 选择框查询条件
        quarterLevelList: this.$enum.get('QUARTER_LEVEL'), // 季度列表
        reportTypeList: this.$enum.get('REPORT_TYPE'),     // 数据类型（报表）
      },
      portList: [],             // 站点列表
      time: {                   // 开始 | 结束时间
        vmodelmonth: ['', ''],    // 月
        vmodelyear: [null, null], // 年
        quarterLevel: [1, 1],     // 季度下拉框
        quartertList: {           // 季度日期后缀
          1: { from: '-01-01', to: '-03-31' },
          2: { from: '-04-01', to: '-06-30' },
          3: { from: '-07-01', to: '-09-30' },
          4: { from: '-10-01', to: '-12-31' },
        },
      },
      queryForm: {               // 列表查询条件
        portIds: [],             // 下拉框站点
        reportType: 'dayReport', // 数据类型
        fromDate: '',            // 开始时间
        toDate: '',              // 结束时间
        ye: -1,                  // 监管级别年份 -- 监管级别为 -1、0 时固定为-1
        keyPollutant: -1,        // 监管级别
      },

      /** 日期方法 -- 不变动 */
      pickerstartday: {
        disabledDate: (val) => {
          const end = new Date(this.queryForm.toDate.replace(/-/g, '/'));
          return val.getTime() > new Date().getTime() || val.getTime() > end.getTime();
        },
      },
      pickerendday: {
        disabledDate: (val) => {
          const start = new Date(this.queryForm.fromDate.replace(/-/g, '/'));
          return val.getTime() > new Date().getTime() || val.getTime() < start.getTime();
        },
      },
      pickerstartmonth: {
        disabledDate: (val) => {
          const month = this.time.vmodelmonth;
          const end = this.getCurrentMonthLastDayUTC(new Date(`${month[1].replace(/-/g, '/')}`));
          return val.getTime() > new Date().getTime() || val.getTime() > end.getTime();
        },
      },
      pickerendmonth: {
        disabledDate: (val) => {
          const month = this.time.vmodelmonth;
          const start = this.getCurrentMonthFirstDayUTC(new Date(`${month[0].replace(/-/g, '/')}`));
          return val.getTime() > new Date().getTime() || val.getTime() < start.getTime();
        },
      },
      pickerstartyear: {
        disabledDate: (val) => {
          const year = this.time.vmodelyear;
          if (!year[0] || !year[1]) return false;
          const start = new Date(`${year[1].getFullYear()}/12/31`);
          return val.getTime() > new Date().getTime() || val.getTime() > start.getTime();
        },
      },
      pickerendyear: {
        disabledDate: (val) => {
          const year = this.time.vmodelyear;
          if (!year[0] || !year[1]) return false;
          const start = new Date(`${year[0].getFullYear()}/01/01`);
          return val.getTime() > new Date().getTime() || val.getTime() < start.getTime();
        },
      },
    };
  },
  computed: {
  },
  watch: {
    'queryForm.reportType': {
      handler(val) {
        // 1. 清除数据
        const level = Math.ceil((new Date().getMonth() + 1) / 3);
        this.$set(this, 'isShowQuarter', false);
        this.$set(this.time, 'vmodelmonth', ['', '']);
        this.$set(this.time, 'vmodelyear', ['', '']);
        this.$set(this.time, 'quarterLevel', [level, level]);
        this.$set(this.queryForm, 'fromDate', '');
        this.$set(this.queryForm, 'toDate', '');
        const date = new Date();
        let type = 'date';
        if (val === 'dayReport') {
          type = 'date';
          this.$set(this.queryForm, 'fromDate', getDay(-1, false));
          this.$set(this.queryForm, 'toDate', getDay(-1, false));
        } else if (val === 'monthReport') {
          type = 'month';
          const time = this.getCurrentYearMonth(date);
          this.$set(this.time, 'vmodelmonth', [time, time]);
        } else if (val === 'quarterReport') {
          type = 'year';
          this.$set(this, 'isShowQuarter', true);
          const time = new Date(`${date.getFullYear()}/01/01`);
          this.$set(this.time, 'vmodelyear', [time, time]);
        } else if (val === 'yearReport') {
          type = 'year';
          const time = new Date(`${date.getFullYear()}/01/01`);
          this.$set(this.time, 'vmodelyear', [time, time]);
        }
        this.$set(this, 'type', type);
      },
      deep: true,
    },
    'time.vmodelmonth': {
      handler(val) {
        if (!val[0] || !val[1]) return;
        const fromDate = this.getCurrentMonthFirstDay(new Date(val[0].replace(/-/g, '/')));
        const toDate = this.getCurrentMonthLastDay(new Date(val[1].replace(/-/g, '/')));
        this.$set(this.queryForm, 'fromDate', fromDate);
        this.$set(this.queryForm, 'toDate', toDate);
      },
      deep: true,
    },
    'time.vmodelyear': {
      handler(val) {
        if (!val[0] || !val[1]) return;
        if (this.queryForm.reportType === 'quarterReport') {
          const from = val[0].getFullYear();
          const to = val[1].getFullYear();
          const level = this.time.quarterLevel;
          const list = this.time.quartertList;
          this.$set(this.queryForm, 'fromDate', `${from}${list[level[0]].from}`);
          this.$set(this.queryForm, 'toDate', `${to}${list[level[1]].to}`);
        } else if (this.queryForm.reportType === 'yearReport') {
          this.$set(this.queryForm, 'fromDate', `${val[0].getFullYear()}-01-01`);
          this.$set(this.queryForm, 'toDate', `${val[1].getFullYear()}-12-31`);
        }
      },
      deep: true,
    },
    'time.quarterLevel': {
      handler(val) {
        if (!val[0] || !val[1]) return;
        if (!this.time.vmodelyear[0] || !this.time.vmodelyear[1]) return;
        const list = this.time.quartertList;
        const fromYear = this.time.vmodelyear[0].getFullYear();
        const toYear = this.time.vmodelyear[1].getFullYear();
        this.$set(this.queryForm, 'fromDate', `${fromYear}${list[val[0]].from}`);
        this.$set(this.queryForm, 'toDate', `${toYear}${list[val[1]].to}`);
      },
      deep: true,
    },
  },
  created() {
  },
  methods: {
    openDialog() {
      this.getPortList();
      this.$set(this.queryForm, 'fromDate', getDay(-1, false));
      this.$set(this.queryForm, 'toDate', getDay(-1, false));
      this.$refs.dialog.openDialog();
    },

    /** 接口请求 */
    getPortList() {             // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES', this.portType),
          portType: this.portType,
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
    onClickSave() {             // 点击保存
      this.downloading = true;
      this.$http.post(`amcs/report/${this.$enum.getLabel('LABEL_CODE', this.portType).toLowerCase()}/zip`, this.queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `${this.$enum.getLabel('LABEL_NAME', this.portType)}报表管理${new Date().toLocaleDateString()}.zip`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    closeDialog() {             // 关闭弹框
      this.type = 'date';
      this.queryForm = {
        portIds: [],             // 下拉框站点
        reportType: 'dayReport', // 数据类型
        fromDate: '',            // 开始时间
        toDate: '',              // 结束时间
        ye: -1,                  // 监管级别年份 -- 监管级别为 -1、0 时固定为-1
        keyPollutant: -1,        // 监管级别
      };
      this.$refs.dialog.closeDialog();
    },

    /** 特殊方法 */
    isDisabledStart(val) {             // 开始时间季度选项禁用规则
      const yearStart = this.time.vmodelyear[0];
      const yearEnd = this.time.vmodelyear[1];
      if (!yearStart || !yearEnd) {
        return false;
      }
      if (yearStart.getFullYear() === yearEnd.getFullYear()) {
        return val > this.time.quarterLevel[1];
      }
      return false;
    },
    isDisabledEnd(val) {               // 结束时间季度选项禁用规则
      const yearStart = this.time.vmodelyear[0];
      const yearEnd = this.time.vmodelyear[1];
      if (!yearStart || !yearEnd) {
        return false;
      }
      if (yearStart.getFullYear() === yearEnd.getFullYear()) {
        return val < this.time.quarterLevel[0];
      }
      return false;
    },
    getCurrentYearMonth(date) {        // 获取当前年月
      let month = parseInt(date.getMonth() + 1, 10);
      if (month < 10) month = `0${month}`;
      return `${date.getFullYear()}-${month}`;
    },
    getCurrentMonthFirstDay(date) {    // 获取当前月份的第一天
      let month = parseInt(date.getMonth() + 1, 10);
      if (month < 10) month = `0${month}`;
      return `${date.getFullYear()}-${month}-01`;
    },
    getCurrentMonthLastDay(date) {     // 获取当前月份的最后一天
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? `0${month}` : month;
      const day = new Date(year, month, 0);
      return `${year}-${month}-${day.getDate()}`;
    },
    getCurrentMonthFirstDayUTC(date) { // 获取当前月份的第一天 UTC 格式
      let month = parseInt(date.getMonth() + 1, 10);
      if (month < 10) month = `0${month}`;
      return new Date((`${date.getFullYear()}-${month}-01`).replace(/-/g, '/'));
    },
    getCurrentMonthLastDayUTC(date) {  // 获取当前月份的最后一天 UTC 格式
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? `0${month}` : month;
      const day = new Date(year, month, 0);
      return new Date((`${year}-${month}-${day.getDate()}`).replace(/-/g, '/'));
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
