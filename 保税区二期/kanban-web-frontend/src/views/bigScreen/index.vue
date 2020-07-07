<template>
  <div class="bs-wrap">
    <div class="bs-box">
      <el-row class="bs-top">
        <el-col>
          <top-info></top-info>
        </el-col>
      </el-row>
      <el-row class="bs-center" style="width: calc(100% - 0.4rem);margin-left: 0.4rem;">
        <el-col :span="8">
          <el-row>
            <el-col :span="8" class="fill-h">
              <calender></calender>
            </el-col>
            <el-col :span="16" class="fill-h">
              <reaching-standard></reaching-standard>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" style="min-height: 1px">
        </el-col>
        <el-col :span="4" class="fill-h">
          <emission-statistics style="width: calc(100% - 0.5rem);margin-right: 0.5rem"></emission-statistics>
        </el-col>
      </el-row>
      <el-row class="bs-bottom" style="width: calc(100% - 0.4rem);margin-left: 0.4rem;margin-top: 0.4rem;">
        <el-col :span="8">
          <el-row>
            <el-col>
              <alarm></alarm>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>
                <embed :src="iconLeft" style="width:3.5rem;height:0.6rem;margin-left:0.6rem;margin-top:0.3rem;"
                  alt="" />
              </div>
            </el-col>
            <el-col :span="5"><span style="font-size:0.4rem;margin-left:0.7rem;">污染源</span></el-col>
            <el-col :span="11">
              <div>
                <embed :src="iconRight" style="width:3.5rem;height:0.6rem;margin-left:0.2rem;margin-top:0.3rem;"
                  alt="" />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <amcs-alarm></amcs-alarm>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <factor-emissions style="width: calc(100% - 0.5rem);margin-right: 0.5rem"></factor-emissions>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" style="min-height: 1px">
        </el-col>
        <el-col :span="4" class="fill-h">
          <real-time-alarm style="width: calc(100% - 0.4rem);margin-right: 0.4rem;">
          </real-time-alarm>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import calender from './module/Calender';
import reachingStandard from './module/ReachingStandard';
import emissionStatistics from './module/EmissionStatistics';
import alarm from './module/Alarm';
import amcsAlarm from './module/AmcsAlarm';
import realTimeAlarm from './module/RealTimeAlarm';
import factorEmissions from './module/factorEmissions';
import topInfo from './module/topInfo';
import titleLeft from '@/assets/image/titleLeft.svg';
import titleRight from '@/assets/image/titlrRight.svg';

export default {
  name: 'Layout',
  data() {
    return {
      iconLeft: titleLeft,
      iconRight: titleRight,
      device: {        // 浏览器窗口宽度
        width: 0,
        height: 0,
      },
    };
  },
  components: {
    calender,
    reachingStandard,
    emissionStatistics,
    alarm,
    amcsAlarm,
    realTimeAlarm,
    factorEmissions,
    topInfo,
  },
  watch: {
    $route: {
      handler() {
        this.$set(this, 'routerName', this.$route.name);
      },
      immediate: true,
    },
    device: {
      handler(size) {
        const fz = size.width / 4000 * 100;
        document.documentElement.style.fontSize = `${fz}px`;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    window.document.documentElement.style.fontSize = '100px';
    // 获取窗口宽度,并设置事件屏幕分辨率大小变动时重新设置窗口
    this.onResize();
    window.addEventListener('resize', () => { this.onResize(); });
  },
  methods: {
    onClick(router) {
      this.$router.replace({ name: router });
    },
    onResize() {
      this.device.width = 7680;
      this.device.height = 3072;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
