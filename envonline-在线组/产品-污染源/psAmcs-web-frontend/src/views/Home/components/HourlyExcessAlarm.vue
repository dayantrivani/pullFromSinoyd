<template>
  <!-- 小时超标报警统计 列表 + 折线图 -->
  <el-row :gutter="10" class="fill-h">
    <el-col :span="14">
      <el-table
        border
        highlight-current-row
        height="100%"
        :data="itemList"
        @row-click="tableRowClick"
        @mouseenter.native="onMouseenter"
        @mouseleave.native="onMouseLeave"
      >
        <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
        <el-table-column label="污染源名称" prop="psName" min-width="175" show-overflow-tooltip></el-table-column>
        <el-table-column label="站点名称" prop="portName" min-width="135" show-overflow-tooltip></el-table-column>
        <el-table-column label="报警时间" prop="alarmTstamp" min-width="151" show-overflow-tooltip></el-table-column>
        <el-table-column label="报警等级" prop="alarmLevel" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="超标因子" prop="factorName" min-width="108" show-overflow-tooltip></el-table-column>
        <el-table-column label="超标值" prop="factorValue" min-width="65" show-overflow-tooltip></el-table-column>
        <el-table-column label="标准值" prop="standardValue" min-width="65" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-col>
    <el-col :span="10">
      <div class="fill-h" :class="{ 'empty-data': !tstamp.length }" ref="alarm" v-loading="loading"></div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import Echarts from 'echarts';

export default {
  name: 'HourlyExcessAlarm',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chart: null,              // 存储echart图表对象
      loading: false,           // echarts图数据状态
      itemList: [],             // 列表数据
      required: false,          // ecahrts图表数据接口请求是否成功
      tstamp: [],               // x轴 -- 时间
      avgValue: [],             // y轴 -- 数值
      standard: null,           // 限值
    };
  },
  watch: {
    data: {                     // 父组件传递过来的数据
      handler(val) {
        if (val.length > 0) {
          this.itemList = [...val];
          if (val[0]) {
            this.getAlarmTime(val[0].alarmTstamp, val[0]);
          }
        }
      },
      deep: true,
      immediate: true,
    },
    required: {
      handler() {
        if (this.required) {
          this.echartsInit();
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
    option() {
      return ({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            snap: true,
          },
          extraCssText: 'opacity: 0',
        },
        grid: {
          top: 30,
          left: 40,
          right: 30,
          bottom: 30,
        },
        xAxis: {
          type: 'category',
          data: this.tstamp,
          axisLabel: {
            color: '#909399',
            formatter(value) {
              // return `${value.slice(5, 7)}月${value.slice(8, 10)}日${value.slice(-8, -6)}时`;
              return `${value.slice(-8, -6)}时`;
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            color: '#909399',
            margin: 15,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [{
          data: this.avgValue,
          type: 'line',
          smooth: true,
          showSymbol: false,
          label: {
            show: true,
            fontSize: 14,
            color: '#00a7f5',
          },
          markLine: this.standard ? {
            symbolSize: 0,
            data: [
              {
                name: '限值',
                yAxis: this.standard,
              },
            ],
            lineStyle: {
              color: '#F44B4B',
            },
          } : {
            show: false,
          },
        }],
      });
    },
  },
  created() {
    this.rollingTable();
  },
  destroyed() {
    clearInterval(this.intervalId);
  },
  methods: {
    tableRowClick(row) {             // 单击列表行
      this.getAlarmTime(row.alarmTstamp, row);
    },
    onMouseenter() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    },
    onMouseLeave() {
      if (!this.intervalId) {
        this.rollingTable();
      }
    },
    rollingTable() {
      if (this.itemList.length > 9) {
        this.intervalId = setInterval(() => {
          this.itemList.push(this.itemList[0]);
          this.itemList.shift();
        }, 1000);
      }
    },

    /** 接口层 */
    getHistoryData(s, e, o) {        // 获取历史数据
      this.loading = true;
      this.required = false;
      this.tstamp = [];
      this.avgValue = [];
      this.standard = null;
      const params = {
        factorCodes: [o.factorCode],
        portId: o.portId,
        fromTime: s,
        toTime: e,
        portType: this.amcsType,
        dataType: 'Hour',
        sort: 'Tstamp',
      };
      this.$http.post('amcs/historyData', params, {
        params: {
          page: 1,
          rows: 100,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const data = response.data.data || [];
          // const data = [
          //   {
          //     tstamp: '2019-07-13 00:00:00',
          //     'w21011-Avg': '41.9N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 23:00:00',
          //     'w21011-Avg': 'red:56.5N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 22:00:00',
          //     'w21011-Avg': '32.9N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 21:00:00',
          //     'w21011-Avg': '10.6N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 20:00:00',
          //     'w21011-Avg': '39.8N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 19:00:00',
          //     'w21011-Avg': '24.2N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 18:00:00',
          //     'w21011-Avg': '42.9N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 17:00:00',
          //     'w21011-Avg': '5.8N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 16:00:00',
          //     'w21011-Avg': '29.3N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 15:00:00',
          //     'w21011-Avg': '28.6N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 14:00:00',
          //     'w21011-Avg': 'red:58.8N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 13:00:00',
          //     'w21011-Avg': '30.9N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 12:00:00',
          //     'w21011-Avg': '39.1N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          //   {
          //     tstamp: '2019-07-12 11:00:00',
          //     'w21011-Avg': '27.1N',
          //     regionId: 'af94b8a4e9de460db559bca2f4436000',
          //     psName: 'jxp测试企业01',
          //     'w21011-Standard': '50',
          //     regionName: '北京市',
          //     psId: '18bc40df-f510-4943-9c7c-46ca524cd40e',
          //     portName: 'jxp重金属测试排口-a03',
          //     portId: 'de7f0c77-6558-4ad7-b051-0049355c0ff5',
          //   },
          // ];
          this.tstamp = data.map(item => item.tstamp);
          this.avgValue = data.map(item => +((/([1-9]\d*|0)(\.\d{1,10})?/.exec(item[o.factorCode]))[0]));
          this.standard = data[0] ? data[0][o.factorCode.replace(/Avg$/g, 'Standard')] : '';
          this.required = true;
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

    /** 特殊方法 */
    echartsInit() {                  // 绘制图表
      this.chart = Echarts.init(this.$refs.alarm);
      this.chart.clear();
      this.chart.setOption(this.option);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
    getAlarmTime(t, o) {             // 获取报警时间段的开始时间与结束时间 -- x轴
      const newTime = new Date().getTime();
      const startTime = new Date(t.replace(/-/g, '/')).getTime() - 12 * 60 * 60 * 1000;
      const endTime = new Date(t.replace(/-/g, '/')).getTime() + 12 * 60 * 60 * 1000;
      let startDate = '';
      let endDate = '';
      if (newTime > endTime) {
        endDate = this.$tools.formatDate(new Date(endTime), 'Y-m-d H:i:s');
      } else {
        endDate = this.$tools.formatDate(new Date(), 'Y-m-d H:i:s');
      }
      startDate = this.$tools.formatDate(new Date(startTime), 'Y-m-d H:i:s');
      this.getHistoryData(startDate, endDate, o);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
