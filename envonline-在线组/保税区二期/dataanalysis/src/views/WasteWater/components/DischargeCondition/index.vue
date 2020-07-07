<template>
<!-- 排口排污工况图 -->
  <el-row  class="DischargeCondition">
    <el-col>
      <div class="img-box">
        <div class="circle-status">
          <label for="circle1">泵 </label>
          <span id="circle1" :class="{ active: true }"></span>
          <label for="circle2" class="mar-l-xs">阀门 </label>
          <span id="circle2" :class="{ active: false }"></span>
        </div>
        <img src="./img/tepci-instrument.png" alt="图片加载失败">
      </div>
      <div class="label-title">
        总量仪
      </div>
      <div>
        <div>
          <label for="switch1">
            阀门开关：
          </label>
          <el-switch
            id="switch1"
            v-model="value1"
            active-color="#13ce66">
          </el-switch>
        </div>
        <div class="mar-t-xs">
          <label for="switch2">
            控制开关：
          </label>
          <el-switch
            id="switch2"
            v-model="value2"
            active-color="#13ce66">
          </el-switch>
        </div>
      </div>
    </el-col>
    <el-col class="margin-left">
      <div class="img-box">
        <img src="./img/DGI.png" alt="图片加载失败">
      </div>
      <div class="label-title">
        数采仪
      </div>
      <div class="icon-box">
        <img src="./img/icon-online.png" alt="图片加载失败">
        <div class="mar-l-sm">
          <div>联网情况</div>
          <div class="active">在线</div>
        </div>
      </div>
    </el-col>
    <el-col class="margin-left">
      <div class="img-box">
        <img src="./img/sample-instrument.png" alt="图片加载失败">
      </div>
      <div class="label-title">
        留样仪
      </div>
      <div class="icon-box">
        <img src="./img/icon-working.png" alt="图片加载失败">
        <div class="mar-l-sm">
          <div>状态情况</div>
          <div class="active">工作中</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'DischargeCondition',
  data() {
    return {
      value1: true,
      value2: false,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
