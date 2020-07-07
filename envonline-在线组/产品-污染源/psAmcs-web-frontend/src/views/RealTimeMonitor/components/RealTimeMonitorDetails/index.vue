<!-- 废水/废气实时监测站点详情 -->
<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="历史数据" name="history" lazy>
      <pane-history-data ref="history"  :portType="amcsType"/>
    </el-tab-pane>
    <el-tab-pane label="数据曲线" name="dataCurve" lazy>
      <pane-data-curve  :portType="amcsType" />
    </el-tab-pane>
    <el-tab-pane label="报警记录" name="alarmRecord" lazy>
      <pane-alarm-record  :portType="amcsType" />
    </el-tab-pane>
    <el-tab-pane label="站点信息" name="station" lazy>
      <pane-outlet-info  :portType="amcsType" />
    </el-tab-pane>
    <el-tab-pane label="远程控制" name="remoteControl" lazy>
      <pane-remote-control  :portType="amcsType" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapState } from 'vuex';
// 历史数据
import PaneHistoryData from './components/PaneHistoryData';
// 数据曲线
import PaneDataCurve from './components/PaneDataCurve';
// 报警记录
import PaneAlarmRecord from './components/PaneAlarmRecord';
// 站点信息
import PaneOutletInfo from './components/PaneOutletInfo';
// 远程控制
import PaneRemoteControl from './components/PaneRemoteControl';

export default {
  name: 'RealTimeMonitorDetails',
  components: {
    PaneHistoryData,
    PaneDataCurve,
    PaneOutletInfo,
    PaneAlarmRecord,
    PaneRemoteControl,
  },
  data() {
    return {
      activeName: 'history',
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  watch: {},
};
</script>
