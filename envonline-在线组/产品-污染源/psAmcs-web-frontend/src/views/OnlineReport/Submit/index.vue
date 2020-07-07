<template>
  <!-- 企业端 网上报备 -->
  <online-report :isEnt="isEnt"></online-report>
</template>

<script>
import OnlineReport from '../components/index';

export default {
  name: 'onlineReportForEnt',
  components: {
    OnlineReport,
  },
  data() {
    return {
      isEnt: true,
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
