<template>
  <el-tabs v-model="activeName" @tab-click="onTabClick">
    <el-tab-pane label="满样报警记录" lazy name="alarmForFullSample">
      <alarm-for-full-sample ref="alarmForFullSample" />
    </el-tab-pane>
    <el-tab-pane label="超标留样报警" lazy name="alarmForOverSample">
      <alarm-for-over-sample ref="alarmForOverSample" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AlarmForFullSample from './components/AlarmForFullSample';
import AlarmForOverSample from './components/AlarmForOverSample';

export default {
  name: 'AlarmRecord',
  components: {
    AlarmForFullSample,
    AlarmForOverSample,
  },
  data() {
    return {
      activeName: '',
    };
  },
  created() {
    this.activeName = 'alarmForFullSample';
    this.$nextTick(() => {
      this.$refs.alarmForFullSample.onTabClick();
    });
  },
  methods: {
    onTabClick(tab) {
      this.$nextTick(() => {
        this.$refs[tab.name].onTabClick();
      });
    },
  },
};
</script>
