<template>
  <!-- 整体布局 -->
  <div class="g-wrap">
    <div class="g-box">
      <header class="box-header">
        <div class="logo"></div>
        <div class="line"></div>
        <div class="time-control">
          <p class="time">{{nowDate}}</p>
          <p class="icon-text"><span><i class="icon"></i>保税区</span><span>{{weather.tmp}}°C</span></p>
          <div class="line2"></div>
        </div>
      </header>
      <div class="box-content" :class="routerName">
        <div class="g-main">
          <router-view />
        </div>
      </div>
      <div class="box-bottom">
        <div class="page-control">
          <router-link
            tag="span"
            v-for="item in routers"
            :key="item.routerName"
            :class="{ active: routerName  === item.routerName }"
            :to="{ name: item.routerName }"
          ></router-link>
        </div>
      </div>
      <div class="nav">
        <div class="menu">
          <p
            v-for="(item,index) in routers"
            :key="index"
            class="thumbnail"
            :class="[{ 'is-active': routerName === item.routerName }, `thumbnail${index + 1}`]"
            @click="onClick(item.routerName)">{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsScroll from './Scroll.js';
import { formatDate } from '@/libs/util';

export default {
  name: 'Layout',
  data() {
    return {
      nowDate: formatDate(new Date(), 'h:i'),
      weather: {
        tmp: 27, // 温度
        condName: '晴', // 天气
      },
      routers: [       // 页面路由名称、页面名称的列表
        {
          routerName: 'Board',
          name: '数据看板',
        }, {
          routerName: 'WarningModule',
          name: '环境风险预警看板',
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
    this.setNowTime(); // 设置定时器获取当前时间
    this.setWeather();
  },
  mounted() {
    // 滚动条
    this.$nextTick(() => { jsScroll('app', 8, 'divScrollBar'); });
  },
  destroyed() {
    clearTimeout(this.timeoutId); // 注销组件时清空定时器避免内存泄露
    clearTimeout(this.weatherId);
  },
  methods: {
    setNowTime() {
      if (!(this && this._isDestroyed)) { // 判断当前组件是否被销毁 如果没有被销毁就新建定时器实时刷新时间
        this.nowDate = formatDate(new Date(), 'h:i');
        this.timeoutId = setTimeout(this.setNowTime, 1000);
      }
    },
    setWeather() {
      if (!(this && this._isDestroyed)) { // 判断当前组件是否被销毁 如果没有被销毁就新建定时器实时刷新时间
        this.$http.get('airquality/gis/weather').then((response) => {
          if (response.data.success && response.data.code === 200) {
            this.weather.condName =  {
              100: '晴', 101: '多云', 102: '少云', 103: '晴间多云', 104: '阴',
            }[response.data.data.condCode];
            this.weather.tmp = response.data.data.tmp;
            // this.nowDate = response.data.data.time.split(' ')[1].slice(0, 5);
          }
        });
        this.weatherId = setTimeout(this.setWeather, 1000 * 60 * 5);
      }
    },
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
  .box-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .logo {
      width: 4rem;
      height: 100%;
      background: {
        image: url('../assets/image/logo.png');
        repeat: no-repeat;
        size: contain;
        position: 0.1rem 50%;
      };
    }
    .line {
      flex: 1;
      height: 100%;
      background: {
        image: url('../assets/image/lin1.png');
        repeat: no-repeat;
        position: center;
      };
    }
    .time-control {
      padding: 0 0.1rem;
      .time {
        font-size: 0.38rem;
        font-weight: bold;
        color: #fff;
        text-align: center;
      }
      .icon-text {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        color: #fff;
        .icon {
          display: inline-block;
          width: 0.16rem;
          height: 0.16rem;
          vertical-align: middle;
          background: {
            image: url('../assets/image/daohang.png');
            repeat: no-repeat;
            position: center;
          };
        }
      }
      .line2 {
        position: relative;
        height: 0.1rem;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 8rem;
          height: 100%;
          background: {
            image: url('../assets/image/line2.png');
            repeat: no-repeat;
            position: center;
            size: contain;
          };
        }
      }
    }
  }
  .box-content {
    &::before {
      content: '';
      position: absolute;
      width: 0.25rem;
      top: 0;
      left: 0;
      height: 100%;
      background: {
        image: url('../assets/image/linel.png');
        repeat: no-repeat;
        size: contain;
        position: left;
      };
    }
    &::after {
      content: '';
      position: absolute;
      width: 0.25rem;
      top: 0;
      right: 0;
      height: 100%;
      background: {
        image: url('../assets/image/liner.png');
        repeat: no-repeat;
        size: contain;
        position: right;
      };
    }
  }
  .box-bottom {
    position: relative;
    .page-control {
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      >span {
        display: inline-block;
        width: 0.3rem;
        height: 0.05rem;
        margin: 0 0.1rem;
        background: #ccc;
        cursor: pointer;
        &.active {
          background-color: #dfc13b;
        }
      }
    }
    &::before {
      content: '';
      position: absolute;
      width: 10rem;
      top: 0;
      left: -8rem;
      height: 100%;
      background: {
        image: url('../assets/image/line.png');
        repeat: no-repeat;
        size: contain;
        position: left;
      };
    }
  }
  .g-main{
    position: relative;
    width: 100%;
    height: 100%;
    width: calc(100% - 0.5rem);
    margin: 0 auto;
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
        @for $i from 1 through 2 {
          &.thumbnail#{$i} {
            background: {
              size: 100% 100%;
              repeat: no-repeat;
              position: center center;
              image: url('../assets/img/thumbnail#{$i}.png');
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
