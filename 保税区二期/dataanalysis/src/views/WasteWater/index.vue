<template>
  <!-- 污水排放 -->
  <div class="mod-wastewater pad-t-lg">
    <decor-button type="left">废水排口名称1#</decor-button>
    <decor-button type="rignt" style="right: 0px">视频信息&gt;&gt;</decor-button>
    <el-row style="height: calc(100% - 0.1rem);">
      <el-col style="width: 30.75%">
        <div style="height: calc(50% - 0.1rem)">
          <decor-border>
            <discharge-duration></discharge-duration>
          </decor-border>
        </div>
        <div style="height: calc(50% - 0.1rem);margin-top: 0.2rem">
          <decor-border>
            <main-case title="排口排污工况图">
              <discharge-condition></discharge-condition>
            </main-case>
          </decor-border>
        </div>
      </el-col>
      <el-col style="width: 30.75%;margin-left: 3.875%;height: 2rem">
        <emission-statistics class="mar-b-xl"></emission-statistics>
        <overproof-info></overproof-info>
      </el-col>
      <el-col style="width: 30.75%;margin-left: 3.875%">
        <decor-border>
          <main-case title="排口留样信息">
            <sample-info></sample-info>
          </main-case>
        </decor-border>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EmissionStatistics from './components/EmissionStatistics';
import DischargeDuration from './components/DischargeDuration';
import DischargeCondition from './components/DischargeCondition';
import OverproofInfo from './components/OverproofInfo';
import SampleInfo from './components/SampleInfo';

export default {
  name: 'WasteWater',
  components: {
    DischargeDuration,
    DischargeCondition,
    EmissionStatistics,
    OverproofInfo,
    SampleInfo,
  },
  data() {
    return {
      value: '',
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.mod-wastewater {
  color: #ccd;
}
</style>
