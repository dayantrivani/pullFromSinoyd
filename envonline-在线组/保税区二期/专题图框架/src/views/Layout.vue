<template>
  <!-- 整体布局 -->
  <div class="g-wrap">
    <div class="g-box" :class="routerName">
      <div class="g-main">
        <router-view />
      </div>
      <div class="nav">
        <div class="menu">
          <p
            v-for="(item,index) in routers"
            :key="index"
            class="thumbnail"
            :class="[{ 'is-active': routerName === item.routerName }, `thumbnail${index}`]"
            @click="onClick(item.routerName)">{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsScroll from './Scroll.js';

export default {
  name: 'Layout',
  data() {
    return {
      routers: [       // 页面路由名称、页面名称的列表
        {
          routerName: 'WasteWater',
          name: '污水排放专题',
        }, {
          routerName: 'TotalStatistics',
          name: '总量统计专题',
        }, {
          routerName: 'RainWater',
          name: '雨水排放专题',
        }, {
          routerName: 'WaterBalance',
          name: '水平衡专题',
        }, {
          routerName: 'WaterControl',
          name: '水控制专题',
        },
      ],
      routerName: '',  // 被选中页面的路由名
      device: {        // 浏览器窗口宽度
        width: 0,
        height: 0,
      },
    };
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
        const fz = size.width / 1600 * 100;
        document.documentElement.style.fontSize = `${fz}px`;
        // document.documentElement.style.fontSize = '100px';
        // if (size.width <= 1600) {
        //   document.documentElement.style.fontSize = '100px';
        // } else {
        //   document.documentElement.style.fontSize = '120px';
        // }
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
  mounted() {
    // 滚动条
    this.$nextTick(() => { jsScroll('app', 8, 'divScrollBar'); });
  },
  methods: {
    onClick(router) {
      this.$router.replace({ name: router });
    },
    onResize() {
      this.device.width = window.document.documentElement.clientWidth;
      this.device.height = window.document.documentElement.clientheight;
    },
  },
};
</script>

<style lang="scss" scoped>
.g-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  .g-main{
    position: relative;
  }
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
        &:hover {
          border-color: #0ff;
          opacity: 1;
        }
        &.is-active {
          margin-left: 15px;
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
        border: 1px solid rgba(0,255,255,.2);
        transition: margin .2s ease-in;
        opacity: .8;
        @for $i from 0 through 4 {
          &.thumbnail#{$i} {
            background: {
              size: 100% 100%;
              repeat: no-repeat;
              position: center center;
              image: url('../assets/img/routers/thumbnail#{$i}.png');
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import 'global.scss';
</style>
