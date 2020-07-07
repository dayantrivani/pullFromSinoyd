<template>
  <!-- 首页 -->
  <el-row :gutter="10" class="h-fill">
    <el-col :h="6" :span="12">
      <el-card type="title">
        <div class="fn-flex" slot="header">
          <span class="flex-1">实时在线信息</span>
          <!-- <span class="text-right more-link">更多&nbsp;<i class="fas fa-angle-double-right"></i>&nbsp;</span> -->
        </div>
        <real-online-info ref="realonlineinfo" :echartData="echartData"/>
      </el-card>
    </el-col>
    <el-col :h="6" :span="12">
      <el-card type="title">
        <div class="fn-flex" slot="header">
          <span class="flex-1">实时空气质量状况</span>
          <!-- <span class="text-right more-link">更多&nbsp;<i class="fas fa-angle-double-right"></i>&nbsp;</span> -->
        </div>
        <real-air-condition ref="realaircondition" :airQualityData="airQualityData"/>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import RealAirCondition from './components/RealAirCondition';
import RealOnlineInfo from './components/RealOnlineInfo';

export default {
  name: 'Home',
  components: {
    RealAirCondition,
    RealOnlineInfo,
  },
  data() {
    return {
      // 实时在线信息数据
      echartData: {},
      // 实时空气质量状况
      airQualityData: {},
    };
  },
  mounted() {
    this.createQuery();
  },
  methods: {
    // 虚拟DOM挂载后,如果需要处理多件事情,建议写一个createQuery方法
    createQuery() {
      this.$refs.realonlineinfo.createQuery();
      this.$refs.realaircondition.createQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.more-link{
  font-size: 14px;
  font-weight: 500;
  font-family: "微软雅黑";
  color: #e6a23c;
  cursor: pointer;
}
</style>
