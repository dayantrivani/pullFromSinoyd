<template>
<!-- 监控中心 -->
  <a-row :gutter="10" style="height: 100%">
    <a-col :span="16" style="padding: 10px">
      <types-monitor ref="types"/>
      <recent-superv-task ref="recent" :data="taskData"/>
      <a-row :gutter="10" class="btn_module">
        <num-super-tasks ref="num" :data="type"/>
        <busin-super-ranking ref="busin" :data="data"/>
      </a-row>
    </a-col>
    <a-col :span="8" style="padding: 10px 10px 10px 0;">
      <a-card style="height: 100%">
        <Calendar ref="Calendar"/>
        <latest-develop ref="latest"/>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { getTasks } from '@/api/modules/monitoring-center.js';
import { getDistribution } from '@/api/modules/monitoring-center.js';
import TypesMonitor from './components/TypesMonitor';
import RecentSupervTask from './components/RecentSupervTask';
import NumSuperTasks from './components/NumSuperTasks';
import BusinSuperRanking from './components/BusinSuperRanking';
import Calendar from './components/Calendar';
import LatestDevelop from './components/LatestDevelop';

export default {
  name: 'MonitoringCenter',
  components: {
    TypesMonitor,
    RecentSupervTask,
    NumSuperTasks,
    BusinSuperRanking,
    Calendar,
    LatestDevelop,
  },
  data() {
    return {
      taskData: {},
      // 企业督办排名数据
      data: [],
      // 监理任务数
      type: {},
    };
  },
  mounted() {
    getTasks().then((res) => {
      if (res.data.code === 200 && res.data.success) {
        this.taskData = res.data.data;
      } else {
        this.$message.error(res.data.msg);
      }
    });
    getDistribution().then((res) => {
      if (res.data.code === 200 && res.data.success) {
        this.data = res.data.data.ranking;
        this.type = res.data.data.type;
      } else {
        this.$message.error(res.data.msg);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.btn_module{
  height: calc(50% - 70px);
  margin-top: 10px;
}
</style>
