<!-- 整个侧栏导航 -->
<template>
  <aside>
    <!-- 侧栏顶部 logo + ProductName -->
    <brand />
    <!-- 侧栏操作按钮 -->
    <div class="side-btns" v-show="isFold">
      <side-btn
        icon="icon icon-menu"
        title="一键折叠"
        :class="{'is-active': isCollapse}"
        @click="isCollapse = !isCollapse"
      />
      <side-btn
        icon="icon icon-menu-open"
        title="一键展开"
        :class="{'is-active': !isCollapse}"
        @click="isCollapse = !isCollapse"
      />
      <side-btn icon="icon icon-cog" title="配置" @click="openSideSet" />
      <side-btn icon="icon icon-refresh" title="刷新" @click="getUserMenu" />
    </div>
    <!-- 侧栏导航 -->
    <el-scrollbar class="hide-x" :native="false" :noresize="false">
      <el-menu
        v-loading="loading"
        unique-opened
        ref="menu"
        class="sidebar"
        element-loading-background="transparent"
        :collapse="!isFold"
        :default-active="$route.name"
        :default-openeds="rootIndexAll"
      >
        <menu-item v-for="item in sideMenu" :key="item.moduleUrl" :data="item" />
      </el-menu>
    </el-scrollbar>
    <!-- 侧栏按钮组设置按钮点击设置后展示的弹框-->
    <side-set ref="sideSet" />
  </aside>
</template>

<script>
import Brand from './components/Brand';
import SideBtn from './components/SideBtn';
import SideSet from './components/SideSet';
import MenuItem from './components/MenuItem';

export default {
  components: {
    Brand,           // 侧栏顶部 标识 + 企业名称
    SideBtn,         // 侧栏按钮组
    SideSet,         // 侧栏点击按钮组设置按钮后出现的弹框
    MenuItem,        // 侧栏导航
  },
  beforeCreate() {
    /* 确保刷新的时候有用户数据,before的时候 computed 尚不可用 */
    if (!this.$store.state.auth.user.userGuid) {
      // 1. 调 vuex 中的方法获取 sessionStorage 中的 user 赋值给 vuex 的 auth/user 变量
      this.$store.dispatch('auth/GetUser');
    }
    if (!this.$store.state.auth.userMenu.length) {
      // 2. 调获取侧栏导航树结构数据的接口
      // console.log('侧栏导航配置后解除注释');
      this.$store.dispatch('auth/GetMenu', this.$store.state.auth.user.loginID).then(() => {
        this.$store.dispatch('auth/CreateRoutes');
      });
    }
  },
  computed: {
    isFold() {
      return this.$store.state.isFold;
    },
    // 侧栏加载状态
    loading() {
      return this.$store.state.auth.loading;
    },
    // 侧栏菜单
    sideMenu() {
      return this.$store.getters['auth/sideMenu'];  // 配置树后解除注释
    },
    // 一件展开侧栏可展开层级
    level() {
      return this.$store.state.auth.level;
    },
    // 当前打开的 sub-menu 的 index 的数组
    rootIndexAll() {
      if (!this.isCollapse) {
        const menus = [...this.sideMenu];
        const tempMenu = [];
        menus.forEach((item) => {
          if (this.level >= 1 && item.children.length) {
            // 第一层数据
            tempMenu.push(item.moduleUrl);
            item.children.forEach((item1) => {
              if (this.level >= 2 && item1.children.length) {
                // 第二层数据
                tempMenu.push(item1.moduleUrl);
                item1.children.forEach((item2) => {
                  if (this.level >= 3 && item2.children.length) {
                    // 第三层数据
                    tempMenu.push(item2.moduleUrl);
                  }
                });
              }
            });
          }
        });
        return tempMenu;
      }
      return this.activeIndex ? [this.activeIndex] : [];
    },
  },
  watch: {
    // eslint-disable-next-line
    $route: function (route) {
      // 当点击第一级导航时收起已展开的节点
      if (this.sideMenu.map(v => v.moduleUrl).includes(route.name)) {
        this.closeAllMenu();
      }
    },
  },
  data() {
    return {
      isCollapse: true,
      activeIndex: '',
    };
  },
  created() {
    // console.log(this.$store.state.auth.amcsType, 'store');
    // console.log(window.sessionStorage.getItem('amcsType'), 'sessionStorage');
    this.activeIndex = this.$route.name;
  },
  methods: {
    // 关闭所有子菜单项
    closeAllMenu() {
      this.sideMenu.forEach((v) => {
        this.$refs.menu.close(v.moduleUrl);
      });
    },
    // 打开侧栏设置
    openSideSet() {
      this.$refs.sideSet.open();
    },
    // 获取用户导航
    getUserMenu() {
      this.$store.dispatch('auth/GetMenu', this.$store.state.auth.user.loginID).then(() => {
        this.$store.dispatch('auth/CreateRoutes');
      });
    },
  },
};
</script>
