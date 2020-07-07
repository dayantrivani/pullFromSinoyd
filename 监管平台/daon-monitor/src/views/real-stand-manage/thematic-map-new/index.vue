<template>
  <div style="width: 100vw; height: 100vh; overflow: hidden;">
    <kinesis-container style="position: absolute;top: 0;">
      <kinesis-element :strength="20">
        <div class="uni-bg-layout1"></div>
      </kinesis-element>
      <kinesis-element :strength="20">
        <div class="uni-bg-layout2"></div>
      </kinesis-element>
      <div class="universe-bg"></div>
    </kinesis-container>
    <div class="back-btn" title="返回首页" @click="$router.go(-1)"></div>
    <div class="uni-meteor"></div>
    <div class="title-banner" :class="{'title-rotate-in': isFirstShow}"></div>
    <div class="title-underline"></div>
    <div class="moving-arrow1"></div>
    <div class="moving-arrow2"></div>
    <div class="showcase-container" @click="showContainer($event)">
      <transition name="map-coming">
        <div id="map" class="map-ctr" v-show="isShowMinMap" key="map">
          <MonitorMapChart></MonitorMapChart>
          <div class="ctr-mask"></div>
        </div>
      </transition>
      <transition-group name="report-coming">
        <div id="report1" class="report-ctr-1" v-show="isShowMinReport1" key="report1">
          <PolutionInfo ref="PolutionInfo"></PolutionInfo>
          <div class="ctr-mask"></div>
        </div>
        <div id="report2" class="report-ctr-2" v-show="isShowMinReport2" key="report2">
          <SupervisorInfo ref="SupervisorInfo"></SupervisorInfo>
          <div class="ctr-mask"></div>
        </div>
        <div id="report3" class="report-ctr-3" v-show="isShowMinReport3" key="report3">
          <OpsInfo ref="OpsInfo"></OpsInfo>
          <div class="ctr-mask"></div>
        </div>
        <div id="report4" class="report-ctr-4" v-show="isShowMinReport4" key="report4">
          <OpsRank></OpsRank>
          <div class="ctr-mask"></div>
        </div>
      </transition-group>
    </div>
    <transition name="fade">
      <div class="mask" v-if="isShowCase" @click="hideMask"></div>
    </transition>
  </div>
</template>

<script>
// import { Loading } from 'element-ui';
import MonitorMapChart from './components/MonitorMapChart';
import OpsRank from './components/OperationRank';
import OpsInfo from './components/OperationInfo';
import SupervisorInfo from './components/SupervisorInfo';
import PolutionInfo from './components/PolutionInfo';

export default {
  name: 'ThematicMapNew',
  components: {
    MonitorMapChart,
    OpsInfo,
    OpsRank,
    SupervisorInfo,
    PolutionInfo,
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.firstAnimation();
      }, 1000);
    });
  },
  data() {
    return {
      isFirstShow: false,
      isShowMinReport1: false,
      isShowMinReport2: false,
      isShowMinReport3: false,
      isShowMinReport4: false,
      isShowMinMap: false,
      isShowReport: false,
      isShowMap: false,
      isShowCase: false,
      index: {
        name: null,
        mask: null,
        target: null,
      },
    };
  },
  methods: {
    firstAnimation() {
      setTimeout(() => {
        this.isShowMinMap = true;
        this.isFirstShow = true;
        setTimeout(() => {
          this.isShowMinReport1 = true;
          this.isShowMinReport3 = true;
          this.$refs.PolutionInfo.resizeChart();
          this.$refs.OpsInfo.resizeChart();
          setTimeout(() => {
            this.isShowMinReport2 = true;
            this.isShowMinReport4 = true;
            this.$refs.SupervisorInfo.resizeChart();
          }, 1000);
        }, 1000);
      }, 500);
    },
    showMap() {
      this.index.target.className = 'map-ctr1 map-forward';
      this.index.target.addEventListener(
        'animationend',
        () => {
          this.index.target.className = 'map-ctr-forwarded';
          console.log();
          document.getElementsByClassName('title-banner')[0].style.zIndex = 1001;
          this.index.mask.style.visibility = 'hidden';
        },
        { once: true }
      );
    },
    hideMap() {
      this.index.mask.style.visibility = 'visible';
      this.index.target.className = 'map-ctr1 map-backup';
      this.index.target.addEventListener(
        'animationend',
        () => {
          this.index.target.className = 'map-ctr';
          document.getElementsByClassName('title-banner')[0].style.zIndex = 100;
        },
        { once: true }
      );
    },
    showReport(val, which) {
      this.$nextTick(() => {
        this.index.target.className = `report-ctr-a${val} report-forward-${val}`;
      });
      this.index.target.addEventListener(
        'animationend',
        () => {
          this.index.target.className = `report-ctr-forwarded-${val}`;
          if (which) this.$refs[which].resizeChart();
          this.index.mask.style.visibility = 'hidden';
        },
        { once: true }
      );
    },
    hideReport(val, which) {
      this.index.mask.style.visibility = 'visible';
      this.index.target.className = `report-ctr-a${val} report-backup-${val}`;
      this.index.target.addEventListener(
        'animationend',
        () => {
          this.index.target.className = `report-ctr-${val}`;
          console.log(this.$refs, which);
          if (which) this.$refs[which].resizeChart();
        },
        { once: true }
      );
    },
    /* eslint-disable */
    showContainer(e) {
      // console.log(e);
      if (
        !['map', 'report1', 'report2', 'report3', 'report4'].includes(
          e.target.parentElement.id
        )
      ) {
        return 0;
      }
      this.isShowCase = true;
      this.index.name = e.target.parentElement.id;
      this.index.mask = e.target;
      this.index.target = e.target.parentElement;
      switch (this.index.name) {
        case 'map':
          this.showMap();
          break;
        case 'report1':
          this.showReport('1', 'PolutionInfo');
          break;
        case 'report2':
          this.showReport('2', 'SupervisorInfo');
          break;
        case 'report3':
          this.showReport('3', 'OpsInfo');
          break;
        case 'report4':
          this.showReport('4');
          break;
        default:
          this.showMap();
          break;
      }
    },
    hideMask() {
      this.isShowCase = false;
      switch (this.index.name) {
        case 'map':
          this.hideMap();
          break;
        case 'report1':
          this.hideReport('1', 'PolutionInfo');
          break;
        case 'report2':
          this.hideReport('2', 'SupervisorInfo');
          break;
        case 'report3':
          this.hideReport('3', 'OpsInfo');
          break;
        case 'report4':
          this.hideReport('4');
          break;
        default:
          this.hideMap();
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.universe-bg {
  background-image: url("~@/assets/img1/uni-bg.jpg");
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  z-index: -100;
}

.uni-bg-layout1 {
  background-image: url("~@/assets/img1/uni-bg-lay1.png");
  background-size: 100% 100%;
  width: 80rem;
  height: 29rem;
  position: absolute;
  right: -1rem;
  top: -1.5rem;
  z-index: -10;
}

.uni-bg-layout2 {
  background-image: url("~@/assets/img1/uni-bg-lay2.png");
  background-size: 100% 100%;
  width: 70rem;
  height: 40rem;
  position: absolute;
  left: -1rem;
  top: -1.5rem;
  z-index: -10;
}

.title-banner {
  background-image: url("~@/assets/img1/title.png");
  background-size: 100% 100%;
  width: 22rem;
  height: 3.8rem;
  position: absolute;
  margin-left: 50vw;
  left: -11rem;
  top: 1rem;
  z-index: 1000;
}

.title-rotate-in {
  animation: rotateXIn 1s ease-in-out;
}

@keyframes rotateXIn {
  0% {
    opacity: 0;
    transform: perspective(599px) rotateX(80deg) translateY(1rem);
  }
  35% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
    transform: perspective(599px) rotateX(0deg);
  }
}

.title-underline {
  background-image: url("~@/assets/img1/title-underline.png");
  background-size: 100% 100%;
  width: 60rem;
  height: 4rem;
  position: absolute;
  margin-left: 50vw;
  left: -30rem;
  top: 2.5rem;
}

.back-btn {
  background-image: url("~@/assets/img1/return-btn.png");
  background-size: 100% 100%;
  width: 2rem;
  height: 2rem;
  position: absolute;
  right: 4rem;
  top: 2rem;
  z-index: 200;
}

.back-btn:hover {
  transform: scale(1.2);
  transition: transform .5s ease-in-out;
}

@keyframes moving {
  0% {
    opacity: 0.2;
    transform: translateY(0);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(100vh);
  }
}

.moving-arrow1 {
  background-image: url("~@/assets/img1/moving-arrow2.png");
  background-size: 100% 100%;
  width: 2.5rem;
  height: 3rem;
  position: absolute;
  right: 5rem;
  top: 5rem;
  animation: moving 8s infinite 2s;
  animation-timing-function: linear;
}

.moving-arrow2 {
  background-image: url("~@/assets/img1/moving-arrow1.png");
  background-size: 100% 100%;
  width: 2.5rem;
  height: 3rem;
  position: absolute;
  left: 5rem;
  bottom: 10rem;
  animation: moving 6s infinite;
  animation-timing-function: linear;
}

.showcase-container {
  position: absolute;
  margin-left: 50vw;
  margin-top: 50vh;
  left: -15rem;
  top: -10rem;
}

.ctr-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.map-ctr {
  background-image: url("~@/assets/img1/map-frame.png");
  background-size: 100% 100%;
  width: 30rem;
  height: 20rem;
  position: absolute;
  left: 0;
  top: 0;
  padding: 1.5rem 0.8rem 1.2rem;
}

.map-ctr1 {
  background-image: url("~@/assets/img1/map-frame.png");
  background-size: 100% 100%;
  width: 30rem;
  height: 20rem;
  position: absolute;
  left: 0;
  top: 0;
  padding: 1.5rem 0.8rem 1.2rem;
}

.map-ctr-forwarded {
  background-image: url("~@/assets/img1/map-frame.png");
  background-size: 100% 100%;
  width: 56rem;
  height: 30rem;
  transform: translateY(-5rem) translateX(-13rem);
  position: absolute;
  left: 0;
  top: 0;
  padding: 1.5rem 0.75rem 1.2rem;
  z-index: 1001;
}

@keyframes tin {
  40% {
    opacity: 0.5;
    -webkit-transform: scale(1.5, 1.5) translateY(0);
    transform: scale(1.5, 1.5) translateY(0);
  }
  40% {
    opacity: 0.8;
    -webkit-transform: scale(1.2, 1.2) translateY(0);
    transform: scale(1.2, 1.2) translateY(0);
  }
  60% {
    opacity: 1;
    -webkit-transform: scale(1.4, 1.4) translateY(0);
    transform: scale(1.4, 1.4) translateY(0);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1.2, 1.2) translateY(0);
    transform: scale(1.2, 1.2) translateY(0);
  }
}

.map-ctr:hover,
.report-ctr-1:hover,
.report-ctr-2:hover,
.report-ctr-3:hover,
.report-ctr-4:hover {
  animation: tin 1s;
  animation-fill-mode: forwards;
  z-index: 1000;
}

.report-ctr-1 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 13rem;
  height: 20rem;
  position: absolute;
  left: -12rem;
  transform: perspective(999px) rotateY(20deg);
}

.report-ctr-a1 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 13rem;
  height: 20rem;
  position: absolute;
  left: -12rem;
  transform: perspective(999px) rotateY(20deg);
}

.report-ctr-forwarded-1 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 20rem;
  height: 30rem;
  top: -5rem;
  left: 5rem;
  position: absolute;
  z-index: 1001;
}
/* 看板1点击动画 */
.report-forward-1 {
  z-index: 1001;
  animation: 1s forwarding-1 ease-in-out forwards;
}

.report-backup-1 {
  animation: 0.4s forwarding-1 linear reverse none;
}

@keyframes forwarding-1 {
  45% {
    opacity: 0.4;
  }
  60% {
    transform: translateX(17rem) rotateY(0deg);
  }
  70% {
    opacity: 0.8;
  }
  90% {
    opacity: 1;
  }
  100% {
    width: 20rem;
    height: 30rem;
    transform: translateX(17rem) translateY(-5rem);
  }
}

.report-ctr-2 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 14rem;
  height: 22rem;
  position: absolute;
  left: -25rem;
  top: -1rem;
  transform: perspective(999px) rotateY(25deg);
}

.report-ctr-a2 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 14rem;
  height: 22rem;
  position: absolute;
  left: -25rem;
  top: -1rem;
  transform: perspective(999px) rotateY(25deg);
}

.report-ctr-forwarded-2 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 20rem;
  height: 30rem;
  top: -5rem;
  left: 5rem;
  position: absolute;
  z-index: 1001;
}
/* 看板1点击动画 */
.report-forward-2 {
  z-index: 1001;
  animation: 1s forwarding-2 ease-in-out forwards;
}

.report-backup-2 {
  animation: 0.4s forwarding-2 linear reverse none;
}

@keyframes forwarding-2 {
  45% {
    opacity: 0.4;
  }
  60% {
    transform: translateX(32rem) rotateY(0deg);
  }
  70% {
    opacity: 0.8;
  }
  90% {
    opacity: 1;
  }
  100% {
    width: 20rem;
    height: 30rem;
    transform: translateX(32rem) translateY(-5rem);
  }
}

.report-ctr-3 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 13rem;
  height: 20rem;
  position: absolute;
  left: 29rem;
  transform: perspective(999px) rotateY(-20deg);
}

.report-ctr-a3 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 14rem;
  height: 20rem;
  position: absolute;
  left: 29rem;
  transform: perspective(999px) rotateY(-20deg);
}

.report-ctr-forwarded-3 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 20rem;
  height: 30rem;
  position: absolute;
  left: 5rem;
  top: -5rem;
  z-index: 1001;
}
/* 看板1点击动画 */
.report-forward-3 {
  z-index: 1001;
  animation: 1s forwarding-3 ease-in-out forwards;
}

.report-backup-3 {
  animation: 0.4s forwarding-3 linear reverse none;
}

@keyframes forwarding-3 {
  45% {
    opacity: 0.4;
  }
  60% {
    transform: translateX(-24rem) rotateY(0deg);
  }
  70% {
    opacity: 0.8;
  }
  90% {
    opacity: 1;
  }
  100% {
    width: 20rem;
    height: 30rem;
    transform: translateX(-24rem) translateY(-5rem);
  }
}

.report-ctr-4 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 14rem;
  height: 22rem;
  position: absolute;
  left: 41rem;
  top: -1rem;
  transform: perspective(999px) rotateY(-25deg);
}

.report-ctr-a4 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 14rem;
  height: 22rem;
  position: absolute;
  left: 41rem;
  top: -1rem;
  transform: perspective(999px) rotateY(-25deg);
}

.report-ctr-forwarded-4 {
  background-image: url("~@/assets/img1/report-frame.png");
  background-size: 100% 100%;
  width: 20rem;
  height: 30rem;
  left: 5rem;
  top: -5rem;
  position: absolute;
  z-index: 1001;
}
/* 看板1点击动画 */
.report-forward-4 {
  z-index: 1001;
  animation: 1s forwarding-4 ease-in-out forwards;
}

.report-backup-4 {
  animation: 0.4s forwarding-4 linear reverse none;
}

@keyframes forwarding-4 {
  45% {
    opacity: 0.4;
  }
  60% {
    transform: translateX(-36rem) rotateY(0deg);
  }
  70% {
    opacity: 0.8;
  }
  90% {
    opacity: 1;
  }
  100% {
    width: 20rem;
    height: 30rem;
    transform: translateX(-36rem) translateY(-5rem);
  }
}

/* 动画过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.map-coming-enter {
  transform: translateY(10rem);
  opacity: 0;
}

.map-coming-enter-active {
  transition: 1s cubic-bezier(0.81, 2, 0.3, 0.8) all;
}

.report-coming-enter {
  transform: translateY(10rem);
  opacity: 0;
}

.report-coming-enter-active {
  transition: 1s linear all;
}

.map-forward {
  z-index: 1001;
  animation: 0.7s forwarding linear forwards;
}
/* origin width: 30rem, height: 20rem */
@keyframes forwarding {
  45% {
    opacity: 0.2;
  }
  80% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    width: 56rem;
    height: 30rem;
    transform: translateY(-5rem) translateX(-13rem);
  }
}

.map-backup {
  animation: forwarding 0.4s linear reverse none;
}

@keyframes tin {
  60% {
    opacity: 1;
    -webkit-transform: scale(1.05, 1.05) translateY(0);
    transform: scale(1.05, 1.05) translateY(0);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1, 1) translateY(0);
    transform: scale(1, 1) translateY(0);
  }
}

@keyframes vanishIn {
  0% {
    opacity: 0;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-transform: scale(2, 2);
    transform: scale(2, 2);
    -webkit-filter: blur(90px);
    filter: blur(90px);
  }
  100% {
    opacity: 1;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    -webkit-filter: blur(0px);
    filter: blur(0px);
  }
}

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1000;
  background-color: black;
  opacity: 0.7;
}

.container-enter-active,
.container-leave-active {
  transition: all 1s;
}
.container-enter, .container-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

html {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-size: 24px;
}

body {
    line-height: 1;
}

/* .uni-meteor {
        background-image: url('~@/assets/img1/');

    } */
</style>
