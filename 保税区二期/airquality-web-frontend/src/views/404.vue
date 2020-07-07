<template>
  <!-- <div class="not-found">
    <div class="title text-center">
      <div class="img-responsive"></div>
      <h2 class="lime">您访问的页面不见了...</h2>
      <p>即将离开本页，
        <span class="lime">{{ countDown }}</span> 秒后自动返回上一页
      </p>
      <button @click="$router.back()">立即返回</button>
    </div>
  </div> -->
  <div class="container">
    <header class="header">
      <div class="header-logo">
        <a class="btn-set" href="#">
          <img src="/img/btn-set_262x140.png" alt="">
        </a>
        <div class="logo"></div>
        <a class="btn-exit" href="#">
          <a><img src="/img/btn-exit_262x141.png" alt=""></a>
        </a>
      </div>
      <ul class="header-nav">
        <li class="nav-1">
          <a style="display:block" href="#"><img src="/img/nav1_200x57.png" alt=""></a>
        </li>
        <li class="nav-2">
          <a style="display:block" href="#"><img src="/img/nav2_200x57.png" alt=""></a>
        </li>
        <!-- <li class="nav-3"><img src="/img/nav3_200x57.png" alt=""></li> -->
      </ul>
    </header>
    <main class="main">
      <div class="main-left">
        <a class="btn-left" href="#">
          <!-- <img width="100%" height="100%" src="/img/left_btn_500x408.png" alt=""> -->
        </a>
      </div>
      <div class="main-right">
        <a class="btn-water" href="#">
          <!-- <img width="100%" height="100%" src="/img/right_btn_500x408.png" alt=""> -->
        </a>
        <a class="btn-gas" href="#">
          <!-- <img width="100%" height="100%" src="/img/right_btn_500x408.png" alt=""> -->
        </a>
        <a class="btn-fill" href="#">
          <!-- <img width="100%" height="100%" src="/img/right_btn_500x408.png" alt=""> -->
        </a>
      </div>
    </main>
    <footer class="footer">
      <span class="copyright">Copyright@2019 江苏远大信息股份有限公司</span>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  data() {
    return {
      countDown: 3,
    };
  },
  watch: {
    // countDown() {
    //   return this.countDown === 0 && this.$router.back();
    // },
  },
  created() {
    const vm = this;
    setInterval(() => vm.countDown > 0 && vm.countDown--, 1000);
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100vh;
  width: 100%;
  height: 100%;
  background: url(/img/bg_1920x989.png) no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  .header {
    .header-logo {
      overflow: hidden;
      position: relative;
    }
    .btn-set, .btn-exit {
      height: 100px;
      // cursor: pointer;
      img {
        height: 100%;
      }
    }
    .logo {
      width: calc(100% - 524px);
      height: 100px;
      position: absolute;
      left: 262px;
      background: url(/img/head_1316x114.png) no-repeat;
      background-size: contain;
    }
    .btn-set {
      float: left;
    }
    .btn-exit {
      float: right;
    }
    .header-nav {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      >li.nav-2 {
        margin: 0 30px;
      }
    }
  }
  .main {
    position: relative;
    height: calc(100% - 210px);
    background: url(/img/bg_line-right_1918x669.png);
    background-size: 100% 100%;
    .main-left {
      position: absolute;
      left: 350px;
      top: 70px;
      width: 400px;
      height: 350px;
      background: url(/img/main_left_677x623.png);
      background-size: cover;
      a.btn-left {
        background: url(/img/left_btn_480x394.png) no-repeat;
        background-size: 100% 100%;
        width: 300px;
        height: 250px;
        position: absolute;
        left: 60px;
        top: 80px;
      }
      a.btn-left:hover {
        background: url(/img/left_btn_active_480x394.png) no-repeat;
        background-size: 100% 100%;
      }
    }
    .main-right {
      position: absolute;
      right: 340px;
      top: 20px;
      width: 500px;
      height: 470px;
      background: url(/img/main_right_672x620.png);
      background-size: 100% 100%;
      a.btn-water {
        background: url(/img/btn_water_217x172.png) no-repeat;
        background-size: 100% 100%;
        width: 180px;
        height: 140px;
        position: absolute;
        left: 50px;
        top: 115px;
      }
      a.btn-water:hover {
        background: url(/img/btn_gas_active_229x173.png) no-repeat;
        background-size: 100% 100%;
      }
      a.btn-gas {
        background: url(/img/btn_gas_229x173.png) no-repeat;
        background-size: 100% 100%;
        width: 180px;
        height: 140px;
        position: absolute;
        left: 250px;
        top: 110px;
      }
      a.btn-gas:hover {
        background: url(/img/btn_gas_active_229x173.png) no-repeat;
        background-size: 100% 100%;
      }
      a.btn-fill {
        background: url(/img/btn_fill_492x188.png) no-repeat;
        background-size: 100% 100%;
        width: 380px;
        height: 145px;
        position: absolute;
        left: 50px;
        top: 270px;
      }
      a.btn-fill:hover {
        background: url(/img/btn_fill_active_491x188.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .footer {
    height: 60px;
    color: #4d669c;
    text-align: center;
    line-height: 60px;
  }
}
</style>
