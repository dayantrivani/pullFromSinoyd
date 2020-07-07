<template>
  <!-- 审核日志集成页面 -->
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="人工审核日志" lazy name="1">
      <manual-audit-log></manual-audit-log>
    </el-tab-pane>
    <el-tab-pane label="自动审核日志" lazy name="2">
      <automatic-audit-log></automatic-audit-log>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// 人工审核日志
import ManualAuditLog from './components/Manual';
// 自动审核日志
import AutomaticAuditLog from './components/Automatic';

export default {
  name: 'AuditLog',
  components: {
    ManualAuditLog,
    AutomaticAuditLog,
  },
  data() {
    return {
      activeName: '1',
    };
  },
  created() { },
  computed: {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
