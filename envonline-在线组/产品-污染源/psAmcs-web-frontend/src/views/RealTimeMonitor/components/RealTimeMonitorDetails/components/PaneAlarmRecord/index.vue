<template>
  <el-tabs v-model="activeName" class="YD-nest" @tab-click="onTabClick">
    <el-tab-pane label="超标报警" name="exceedAlarm">
      <exceed-alarm ref="exceedAlarm"/>
    </el-tab-pane>
    <el-tab-pane label="其他报警" name="otherAlarm">
      <other-alarm ref="otherAlarm" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ExceedAlarm from './components/ExceedAlarm';
import OtherAlarm from './components/OtherAlarm';

export default {
  components: {
    ExceedAlarm,
    OtherAlarm,
  },
  created() {
    this.activeName = 'exceedAlarm';
    this.$nextTick(() => {
      this.$refs.exceedAlarm.onTabClick();
    });
  },
  data() {
    return {
    };
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
