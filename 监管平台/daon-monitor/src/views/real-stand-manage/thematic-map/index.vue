<template>
<!-- 专题图 -->
<div class="ThematicMap">
  <img class="logo" src="@/assets/img/logo.png" />
  <img class="back" title="返回首页" src="@/assets/img/back.png" @click="$router.go(-1)"/>
  <div class="all_mask" v-show="currentIndex" @click="closeMask"></div>
  <img class="bottomTo" :class="{ 'bottomTo_trans': isShow }" src="@/assets/img/arrow.png" />
  <img class="topTo" :class="{ 'topTo_trans': isShow }" src="@/assets/img/arrow.png" />
  <a-row class="ThematicMap_row" :gutter="5">
    <div
      class="Statistics location"
      :class="{ 'transform': isShow, 'check_statistics': currentIndex === 1 }"
      :style="{ 'transition': currentIndex === 0 ? 'none!important' : '' }">
      <div>
        <monitor-statistics ref="Statistics" :isShow="currentIndex" />
      </div>
      <div class="mask" @click="showMask(1)" :style="{ 'display': currentIndex ? 'none' : '' }"></div>
    </div>
    <div
      class="Source location"
      :class="{ 'transform': isShow, 'check_statistics': currentIndex === 2 }"
      :style="{ 'transition': currentIndex === 0 ? 'none!important' : '' }">
      <div>
        <pollution-source ref="Source" :isShow="currentIndex"/>
      </div>
      <div class="mask" @click="showMask(2)" :style="{ 'display': currentIndex ? 'none' : '' }"></div>
    </div>
    <div
      class="Monitor location"
      :class="{ 'transform': isShow, 'check_map': currentIndex === 3 }"
      :style="{ 'transition': currentIndex === 0 ? 'none!important' : '' }">
      <div>
        <monitor-map ref="Monitor"/>
      </div>
      <div class="mask" @click="showMask(3)" :style="{ 'display': currentIndex ? 'none' : '' }"></div>
    </div>
    <div
      class="Profile location"
      :class="{ 'transform': isShow, 'check_statistics': currentIndex === 4 }"
      :style="{ 'transition': currentIndex === 0 ? 'none!important' : '' }">
      <div>
        <operationa-profile ref="Profile" :isShow="currentIndex"/>
      </div>
      <div class="mask" @click="showMask(4)" :style="{ 'display': currentIndex ? 'none' : '' }"></div>
    </div>
    <div
      class="Ranking location"
      :class="{ 'transform': isShow, 'check_statistics': currentIndex === 5 }"
      :style="{ 'transition': currentIndex === 0 ? 'none!important' : '' }">
      <div>
        <ops-ranking ref="Ranking" :isShow="currentIndex"/>
      </div>
      <div class="mask" @click="showMask(5)" :style="{ 'display': currentIndex ? 'none' : '' }"></div>
    </div>
  </a-row>
</div>
</template>

<script>
import MonitorMap from './components/MonitorMap';
import MonitorStatistics from './components/MonitorStatistics';
import OperationaProfile from './components/OperationaProfile';
import OpsRanking from './components/OpsRanking';
import PollutionSource from './components/PollutionSource';

export default {
  name: 'ThematicMap',
  components: {
    MonitorMap,
    MonitorStatistics,
    OperationaProfile,
    OpsRanking,
    PollutionSource,
  },
  data() {
    return {
      isShow: false,
      currentIndex: '',
    };
  },
  mounted() {
    this.isShow = true;
  },
  methods: {
    // 关闭遮罩
    closeMask() {
      this.currentIndex = 0;
      this.$refs.Monitor.show(false);
      this.$refs.Monitor.currentWindow.visible = false;
    },
    showMask(num) {
      if (num === 3) {
        this.$refs.Monitor.show(true);
      }
      this.currentIndex = num;
    },
  },
};
</script>

<style lang="scss">
.right_bg{
  right: -13px!important;
  left: 10px!important;
  z-index: -1;
}
.content_map{
  height: 100%;
  position: relative;
  >.after_map{
    width: 100%;
    height: 100%;
    position: absolute;
    top: -15px;
    background-image: url('../../assets/img/border.png');
    left: -19px;
    opacity: 0.3;
    z-index: -1;
  }
}
.model_bg{
  // &::after{
  //   width: 100%;
  //   content: "";
  //   height: 100%;
  //   position: absolute;
  //   top: -15px;
  //   background-image: url('../../assets/img/border.png');
  //   left: -19px;
  //   opacity: 0.3;
  //   z-index: -1;
  // }
  padding: 25px;
  background-image: url('../../assets/img/modelBorder.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  >.title{
    color: #06C6FC;
    position: absolute;
    top: -16px;
    left: 45px;
    font-size: 20px;
    height: 20px;
    text-shadow: #06C6FC 0px 3px 6px;
  }
  >.dersion{
    text-align: left;
    color: #fff;
    display: inline-block;
    width: 100%;
    margin-bottom: 10px;
    font-size: 18px;
    >img{
      margin-left: 10px;
    }
  }
  >.dersionEn{
    text-align: left;
    color: #969DA2;
    font-size: 12px;
    margin-bottom: 10px;
  }
}
</style>

<style lang="scss" scoped>
.transform{
  transform: translateY(-300px);
  opacity: 1!important;
}
.ThematicMap{
  height: 100%;
  overflow: hidden;
  background-image: url('../../assets/img/beijign .png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  .back{
    cursor: pointer;
    position: absolute;
    left: 30px;
    top: 30px;
    z-index: 100;
    width: 50px;
  }
  .logo{
    position: absolute;
    left: 0;
    right: 0;
    top: 20px;
    margin: auto;
    width: 70%;
    z-index: 1000;
  }
  .bottomTo{
    position: absolute;
    left: 30px;
    bottom: 100px;
    opacity: 1;
    transition: all 1.5s linear;
  }
  .bottomTo_trans{
    transform: translateY(200px);
    opacity: 0;
  }
  .topTo{
    position: absolute;
    right: 30px;
    top: 100px;
    opacity: 1;
    transition: all 10s linear 2s;
  }
  .topTo_trans{
    transform: translateY(800px);
    opacity: 0;
  }
  .all_mask{
    height: 90%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    background: #010816;
    opacity: 0.7;
  }
  .ThematicMap_row{
    overflow: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    padding: 0 10px;
    height: 100%;
    width: 100%;
    .location{
      perspective: 1500px;
      position: absolute;
      height: 65%;
      top: 0;
      // bottom: 0;
      margin: auto;
    }
    .Statistics{
      width: 20%;
      left: -10px;
      bottom: -600px;
      transition: all 1s linear 0.75s;
      opacity: 0;
      >div{
        height: 100%;
        transform: rotateY(40deg);
        z-index: 1;
      }
      >.mask{
        cursor: pointer;
        z-index: 10;
        position: absolute;
        width: 100%;
        bottom: 0;
      }
    }
    .Source{
      width: 20%;
      left: 15.25%;
      bottom: -600px;
      transition: all 1s linear 0.75s;
      opacity: 0;
      >div{
        height: 100%;
        transform: rotateY(40deg);
        position: absolute;
        height: 90%;
        width: 100%;
        bottom: 0;
        z-index: 1;
      }
      >.mask{
        cursor: pointer;
        z-index: 10;
        position: absolute;
        bottom: 0;
      }
    }
    .Monitor{
      width: 35%;
      left: 32.5%;
      bottom: -600px;
      transition: all 0.75s linear;
      opacity: 0;
      >div{
        position: absolute;
        height: 100%;
        width: 100%;
        bottom: 0;
        z-index: 1;
      }
      >.mask{
        cursor: pointer;
        z-index: 10;
        bottom: 0;
      }
    }
    .Profile{
      width: 20%;
      right: 15.25%;
      bottom: -600px;
      transition: all 1s linear 0.75s;
      opacity: 0;
      >div{
        height: 100%;
        transform: rotateY(-40deg);
        position: absolute;
        height: 90%;
        width: 100%;
        bottom: 0;
        z-index: 1;
      }
      >.mask{
        cursor: pointer;
        z-index: 10;
        bottom: 0;
      }
    }
    .Ranking{
      width: 20%;
      right: -10px;
      bottom: -600px;
      transition: all 1s linear 0.75s;
      opacity: 0;
      >div{
        height: 100%;
        transform: rotateY(-40deg);
        z-index: 1;
      }
      >.mask{
        cursor: pointer;
        position: absolute;
        width: 100%;
        z-index: 10;
        bottom: 0;
      }
    }
    // 选择的模块样式
    .check_statistics{
      width: 23%!important;
      height: 75%!important;
      position: absolute;
      top: 0;
      left: 50%;
      right: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 1000;
      transition: all 0.5s ease;
      >div{
        transform: none!important;
      }
    }
    .check_map{
      width: 73%!important;
      height: 80%!important;
      position: absolute;
      // top: 25%;
      // left: 50%;
      // right: 50%;
      // transform: translate(-50%, -50%);
      // text-align: center;
      top: 600px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 1000;
      transition: all 0s ease;
      >div{
        transform: none!important;
      }
    }
  }
}
</style>
