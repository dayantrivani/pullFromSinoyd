<template>
  <!-- 首页 -->
  <div class="home-box">
    <el-row>
      <el-col :span="12" class="contain">
        <div class="title">信访数量统计</div>
        <div class="main">
          <quantity></quantity>
        </div>
      </el-col>
      <el-col :span="12" class="contain mar-l-sm">
        <div class="title">信访归口类型统计</div>
        <div class="main">
          <centralized-type></centralized-type>
        </div>
      </el-col>
    </el-row>
    <el-row class="mar-t-sm">
      <el-col :span="12" class="contain">
        <div class="title">信访按时回复率统计</div>
        <div class="main">
          <response-rate></response-rate>
        </div>
      </el-col>
      <el-col :span="12" class="contain mar-l-sm">
        <div class="title">信访处置满意度统计</div>
        <div class="main">
          <satisfaction></satisfaction>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Quantity from './components/Quantity';
import CentralizedType from './components/CentralizedType';
import ResponseRate from './components/ResponseRate';
import Satisfaction from './components/Satisfaction';

export default {
  name: 'Home',
  components: {
    Quantity,
    CentralizedType,
    ResponseRate,
    Satisfaction,
  },
};
</script>

<style lang="scss" scoped>
.home-box {
  height: calc(100% -39px);
  >div.el-row {
    height: calc(50% - 5px);
  }
  .contain {
    height: 100%;
    width: calc(50% - 5px);
    padding: 10px;
    background-color: #fff;
    border: 0 solid transparent;
    border-radius: 10px;
    .title {
      padding-left: 10px;
      font-size: 18px;
      font-weight: 700;
      user-select: none;
    }
    .main {
      height: calc(100% - 25px);
    }
  }
}
</style>
