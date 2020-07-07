<template>
  <!-- 管理端 报备审核 -->
  <online-report :isEnt="isEnt"></online-report>
</template>

<script>
import OnlineReport from '../components/index';

export default {
  name: 'onlineReportForOrg',
  components: {
    OnlineReport,
  },
  data() {
    return {
      isEnt: false,
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
