<!-- 侧栏导航 -->
<template>
  <aside>
    <!-- 侧栏操作按钮 -->
    <div class="side-btns" v-show="isFold">
      <button
        :class="{ 'btn-fold': 1, 'is-active': isCollapse }"
        @click="isCollapse = true"
        title="一键折叠">
        <i class="icon icon-menu"></i>
      </button>
      <button
        :class="{ 'btn-fold': 1, 'is-active': !isCollapse }"
        @click="isCollapse = false"
        title="一键展开">
        <i class="icon icon-menu-open"></i>
      </button>
      <button class="btn-fold" @click="getUserMenu">
        <i class="icon icon-refresh"></i>
      </button>
    </div>
    <!-- 侧栏导航 -->
    <el-scrollbar :native="false" :noresize="false">
      <el-menu
        unique-opened
        popper-append-to-body
        ref="menu"
        class="sidebar"
        :collapse="!isFold"
        :default-active="$route.name"
        :default-openeds="rootIndexAll">
        <menu-item
          v-for="item in sideMenu"
          :item="item"
          :key="item.id"
          :class="{ 'is-active': hasActive(item.moduleUrl) }" />
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script>
import MenuItem from './components/MenuItem';

export default {
  components: {
    MenuItem,
  },
  beforeCreate() {
    // 确保刷新的时候有用户数据
    // before的时候 computed 尚不可用
    if (!this.$store.state.auth.user.userGuid) {
      this.$store.dispatch('auth/GetUser');
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
    // 侧栏菜单
    sideMenu() {
      return this.$store.getters['auth/sideMenu'];
    },
    // 当前打开的 sub-menu 的 index 的数组
    rootIndexAll() {
      if (!this.isCollapse) {
        return this.sideMenu.map(v => v.moduleUrl);
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
    // this.$nextTick(() => {
    //   console.log(this.$refs.menu);
    // });
  },
  methods: {
    hasActive(item) {
      const itemStr = JSON.stringify(this.sideMenu.find(v => v.moduleUrl === item));
      return itemStr.includes(this.$route.name);
    },
    // 关闭所有子菜单项
    closeAllMenu() {
      this.sideMenu.forEach((v) => {
        this.$refs.menu.close(v.moduleUrl);
      });
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
