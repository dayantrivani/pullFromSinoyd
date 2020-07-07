<!-- 侧栏导航 -->
<template>
  <aside>
    <brand />
    <!-- 侧栏操作按钮 -->
    <div class="side-btns" v-show="isFold">
      <side-btn
        icon="icon icon-menu"
        title="一键折叠"
        :class="{'is-active': isCollapse}"
        @click="isCollapse = !isCollapse" />
      <side-btn
        icon="icon icon-menu-open"
        title="一键展开"
        :class="{'is-active': !isCollapse}"
        @click="isCollapse = !isCollapse" />
      <!-- <side-btn icon="icon icon-cog" title="配置" @click="openSideSet"/> -->
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
        :default-openeds="rootIndexAll">
        <menu-item v-for="item in sideMenu" :key="item.moduleUrl" :data="item" />
      </el-menu>
    </el-scrollbar>
    <!-- 导航设置对话框 -->
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
    Brand,
    SideBtn,
    SideSet,
    MenuItem,
  },
  beforeCreate() {
    // 确保刷新的时候有用户数据
    // before的时候 computed 尚不可用
    if (!this.$store.state.auth.user.userGuid) {
      this.$store.dispatch('auth/GetUser');
      if (this.$store.getters['auth/userType'] === 'ent') {
        this.$store.dispatch('GetPsInfo', this.$store.getters['auth/orgGuid']);
      }
    }
    if (!this.$store.state.auth.userMenu.length) {
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
      return this.$store.getters['auth/sideMenu'];
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
