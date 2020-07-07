<template>
  <!-- 默认布局 -->
  <div style="height: 100%;">
    <router-view/>
    <!-- <img src="Bg_img/BG.png" alt="图片加载失败，请重试" style="height: 100%;"> -->
    <div class="nav">
      <div class="menu">
        <p
          v-for="(item,index) in routers"
          :key="index"
          class="thumbnail"
          :class="[{ 'is-active': routerName === item.routerName }, `thumbnail-${index}`]"
          @click="onClick(item.routerName)">{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      title: true,     // 待删除
      autoPlay: false,
      routers: [
        {
          routerName: 'Command',
          name: '指挥调度',
        }, {
          routerName: 'Monitoring',
          name: '监测中心',
        },
      ],
      routerName: '',
    };
  },
  watch: {
    $route() {
      this.$set(this, 'routerName', this.$route.name);
    },
  },
  computed: {
    surfaceWater() {
      return this.$route.name === 'SurfaceWater';
    },
  },
  created() {
    this.$set(this, 'routerName', this.$route.name);
  },
  methods: {
    SetAutoPlay() {
    },
    onClick(router) {
      this.$router.replace({ name: router });
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  &::before {
    content: "";
    display: block;
    position: absolute;
    right: -25px;
    top: 0;
    width: 25px;
    height: 100%;
  }
  &:hover {
    left: 0;
  }
  position: fixed;
  left: -170px;
  top: 0;
  bottom: 0;
  width: 170px;
  z-index: 9999;
  text-align: center;
  transition: left 0.4s linear;
  background-color: rgba(0, 0, 0, .4);
  div.menu {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    p.thumbnail {
      &::before {
        content: "";
        position: absolute;
        display: block;
        width: 150px;
        height: 85px;
        z-index: 10000;
      }
      &.is-active {
        margin-left: 18px;
        // color: transparent;
        border-right: none;
        opacity: 1;
      }
      &.is-active, :hover {
        border-color: #0ff;
        // color: transparent;
      }
      &:hover {
        // color: transparent;
        border-color: #0ff;
        opacity: 1;
      }
      cursor: pointer;
      position: relative;
      margin-top: 15px;
      margin-left: 10px;
      width: 150px;
      height: 85px;
      line-height: 85px;
      font-size: .8em;
      color: #0ff;
      background-position: 100% 100%;
      background-repeat: no-repeat;
      user-select: none;
      border: 1px solid rgba(0,255,255,.2);
      transition: margin .2s ease-in;
      opacity: .8;
      background-size: cover;
      &.thumbnail-0 { // 指挥调度
        background-image: url('../../assets/Bg_img/BG.png');
      }
      &.thumbnail-1 { // 监测中心
        background-image: url('../../assets/Bg_img/BG_1.png');
      }
    }
  }
}
</style>
