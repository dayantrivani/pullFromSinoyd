<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="onTabClick">
    <el-tab-pane label="报警处理" name="first">
      <exceed-alarm ref="first" />
    </el-tab-pane>
    <el-tab-pane label="报警通知" name="second">
      <other-alarm ref="second" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ExceedAlarm from './components/ExceedAlarm';
import OtherAlarm from './components/OtherAlarm';

export default {
  name: 'AlarmRecord',
  components: {
    ExceedAlarm,
    OtherAlarm,
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  created() {
    this.activeName = 'first';
  },
  mounted() {
    this.$refs.first.openDialog();
  },
  methods: {
    onTabClick(tab) {
      this.$refs[tab.name].openDialog();
    },
  },
};
</script>
