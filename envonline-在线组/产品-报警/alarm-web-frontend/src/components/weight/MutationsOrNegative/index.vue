<template>
  <!-- 负值报警或突变报警公共组件 -->
  <el-tabs v-model="active" type="border-card" @tab-click="onTabClick">
    <el-tab-pane :label="`${title}报警`" name="alarmInfo">
      <pane-alarm-info ref="alarmInfo" :alarmType="alarmType"/>
    </el-tab-pane>
    <el-tab-pane :label="`${title}规则`" name="rulesInfo" lazy>
      <pane-rules-info ref="rulesInfo" :alarmType="alarmType"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import { mapState } from 'vuex';
import PaneAlarmInfo from './PaneAlarmInfo';
import PaneRulesInfo from './PaneRulesInfo';

export default {
  props: {
    title: {
      type: String,
      require: true,
    },
  },
  components: {
    PaneAlarmInfo,
    PaneRulesInfo,
  },
  data() {
    return {
      active: 'alarmInfo',
    };
  },
  computed: {
    alarmType() {
      const [alarmType] = this.$store.state.sample.alarmType.filter(n => n.alarmTypeCode === this.$route.name);
      return alarmType;
    },
  },
  mounted() {
    this.onPaneQuery();
  },
  methods: {
    onPaneQuery() {
      this.$refs.alarmInfo.onPaneQuery();
    },
    onTabClick(val) {
      this.$nextTick(() => {
        this.$refs[val.name].onPaneQuery();
      });
    },
  },
};
</script>
