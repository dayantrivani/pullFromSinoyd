<!-- 废水/废气实时监测站点详情 -->
<template>
  <el-tabs type="border-card" v-model="activeName" @tab-click="onTabClick">
    <el-tab-pane label="历史数据" name="history" lazy>
      <pane-history-data ref="history"/>
    </el-tab-pane>
    <el-tab-pane label="数据曲线" name="dataCurve" lazy>
      <pane-data-curve ref="dataCurve"/>
    </el-tab-pane>
    <el-tab-pane label="报警记录" name="alarmRecord" lazy>
      <pane-alarm-record ref="alarmRecord"/>
    </el-tab-pane>
    <el-tab-pane label="远程控制" name="remoteControl" lazy v-if="userType === 'gov'">
      <pane-remote-control ref="remoteControl"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapGetters } from 'vuex';
// 历史数据
import PaneHistoryData from './components/PaneHistoryData';
// 数据曲线
import PaneDataCurve from './components/PaneDataCurve';
// 报警记录
import PaneAlarmRecord from './components/PaneAlarmRecord';
// 远程控制
import PaneRemoteControl from './components/PaneRemoteControl';

export default {
  name: 'BlowdownProgressInfo',
  components: {
    PaneHistoryData,
    PaneDataCurve,
    PaneAlarmRecord,
    PaneRemoteControl,
  },
  data() {
    return {
      activeName: 'history',
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    /** 1. 默认选中超标报警
     *  2. 在内容渲染完毕后调取子组件方法
     *     该方法用于完成在 子组件渲染时 需要进行的操作: 请求接口...
     */
    this.$nextTick(() => {
      this.$refs[this.activeName].onTabClick();
    });
  },
  methods: {
    onTabClick(tab) {          // 标签页切换时触发
      this.$nextTick(() => {
        this.$refs[tab.name].onTabClick();
      });
    },
  },
};
</script>
