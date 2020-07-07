<template>
  <!-- 留样数据 -->
  <el-tabs type="border-card" fill>
    <el-tab-pane label="超标留样" lazy>
      <over-sample></over-sample>
    </el-tab-pane>
    <el-tab-pane label="远程留样" lazy>
      <remote-sample></remote-sample>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import OverSample from './components/OverSample';
import RemoteSample from './components/RemoteSample';

export default {
  name: 'SampleQuery',
  components: { OverSample, RemoteSample },
};
</script>

<style lang="scss" scoped>

</style>
