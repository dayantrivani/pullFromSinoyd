<template>
  <el-row :gutter="10">
    <el-col :span="12" :h="5">
      <online-info></online-info>
    </el-col>
    <el-col :span="12" :h="5">
      <water-classification></water-classification>
    </el-col>
    <el-col :span="24" :h="7">
      <trend-analysis></trend-analysis>
    </el-col>
  </el-row>
</template>
<script>
import OnlineInfo from './components/OnlineInfo';
import WaterClassification from './components/WaterClassification';
import TrendAnalysis from './components/TrendAnalysis';


export default {
  name: 'Home',
  components: { OnlineInfo, WaterClassification, TrendAnalysis },
};
</script>

<style scoped>

</style>
