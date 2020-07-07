<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="超标报警" name="excessiveAlarm">
      <excessive-alarm></excessive-alarm>
    </el-tab-pane>
    <el-tab-pane label="超标规则" name="standardRules" lazy>
      <excessive-rules></excessive-rules>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import { analyzeResp } from '@/libs/util';
import ExcessiveAlarm from './components/ExcessiveAlarm';
import ExcessiveRules from './components/ExcessiveRules';

export default {
  name: 'Min',
  mixins: [],
  components: {
    ExcessiveAlarm,
    ExcessiveRules,
  },
  data() {
    return {
      activeName: 'excessiveAlarm',
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
