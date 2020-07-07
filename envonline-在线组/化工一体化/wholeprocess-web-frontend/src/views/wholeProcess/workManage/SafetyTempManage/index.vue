<!-- 安全模板管理  -->
<template>
  <div>
    <el-tabs type="border-card" class="fill-h" v-model="activeName">
      <el-tab-pane label="安全措施标准模板" class="pad-y-xs" name="measure">
        <index-measure />
      </el-tab-pane>
      <el-tab-pane label="安全分析标准模板" class="pad-y-xs" lazy name="analysis">
        <index-analysis />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import indexMeasure from './components/IndexMeasure';
import indexAnalysis from './components/IndexAnalysis';

export default {
  name: 'SafetyTemplate',
  components: {
    indexMeasure,
    indexAnalysis,
  },
  data() {
    return {
      activeName: 'measure',
    };
  },
  computed: {
  },
  created() {
  },
  methods: {
  },
};
</script>
