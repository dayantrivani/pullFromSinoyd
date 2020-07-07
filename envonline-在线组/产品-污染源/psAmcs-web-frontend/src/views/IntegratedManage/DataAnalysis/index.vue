<template>
  <!-- 数据分析 -->
  <el-card class="pad-a-xs" :body-style="{ height: '100% !important' }">
    <el-row class="fill-h">
      <el-col :span="24" :h="6">
        <div class="title-info">单排口多因子数据比对</div>
        <one-port></one-port>
      </el-col>
      <el-col :span="24" :h="6" class="mar-t-sm">
        <div class="title-info">多排口单因子数据比对</div>
        <one-factor></one-factor>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import OnePort from './components/OnePort';
import OneFactor from './components/OneFactor';

export default {
  name: 'DataAnalysis',
  components: { OnePort, OneFactor },
};
</script>

<style lang="scss" scoped>
</style>
