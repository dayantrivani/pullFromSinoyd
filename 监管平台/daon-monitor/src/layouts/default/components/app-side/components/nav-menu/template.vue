<!-- 侧栏导航 -->
<template>
  <div class="nav-menu">
    <scrollbar class="menu-scroll" :native="false" :noresize="false">
      <a-menu
        mode="inline"
        class="nav-side"
        element-loading-background="transparent"
        :openKeys="openKeys"
        :theme="app.custom.themeSide"
        :selectedKeys="[$route.name]"
        :inlineIndent="0"
        :inlineCollapsed="!app.custom.sideCollapse"
        @click="onClickToPage"
        @openChange="onOpenChange">
        <template v-for="item in navMenu">
          <a-menu-item v-if="!item[$config.navbar.children]" :key="item[$config.navbar.path]">
            <icon :name="item[$config.navbar.icon]" custom-class="anticon anticon-ant-design" />
            <span>{{item[$config.navbar.label]}}</span>
          </a-menu-item>
          <sub-menu v-else :menu-info="item" :key="item[$config.navbar.path]"/>
        </template>
      </a-menu>
    </scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import SubMenu from './components/sub-menu';

export default {
  inject: ['app', 'side'],
  components: {
    SubMenu,
  },
  computed: {
    ...mapState('auth', { openOtherKeys: 'openKeys' }),
    ...mapGetters('auth', ['userGuid', 'addRoutes', 'navMenu']),
    // ...mapGetters('auth', ['userGuid', 'newAddRoutes', 'newNavMenu']),
    // 当前打开的 sub-menu 的 index 的数组
    rootIndexAll() {
      if (!this.isCollapse) {
        // const menus = [...this.navMenu];
        const menus = [...this.navMenu];
        const tempMenu = [];
        const fn = (data) => {
          data.forEach((item) => {
            tempMenu.push(item[this.config.navbar.path]);
            if (item[this.config.navbar.children] && item[this.config.navbar.children].length) {
              fn(item[this.config.navbar.children]);
            }
          });
        };
        fn(menus);
        return tempMenu;
      }
      return this.activeIndex ? [this.activeIndex] : [];
    },
    // 所有的一级菜单
    rootSubmenuKeys() {
      // const menus = [...this.navMenu];
      const menus = [...this.navMenu];
      return menus.filter(item => (item.children && item.children.length !== 0)).map(key => key.moduleCode);
    },
  },
  watch: {
    // 确保刷新的时候有用户数据
    // navMenu: {
    //   handler(val) {
    //     if (!val.length) {
    //       this.getUserInfo();
    //     }
    //   },
    //   immediate: true,
    // },
    navMenu: {
      handler(val) {
        if (!val.length) {
          this.getUserInfo();
        }
      },
      immediate: true,
    },
    openOtherKeys: {
      handler(val) {
        this.openKeys = val;
      },
      immediate: true,
    },
  },
  data() {
    return {
      isFold: true,
      activeIndex: '',
      openKeys: [],
    };
  },
  created() {
    this.getUserInfo();
    this.activeIndex = this.$route.name;
  },
  methods: {
    // TODO: 逻辑有待优化。。。
    onOpenChange(openKeys) {
      // 最后展开的一级菜单key值
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      if (!this.rootSubmenuKeys.includes(latestOpenKey) || !this.app.custom.sideAccordion) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    onClickToPage({ key }) {
      // 手风琴模式下，选中根菜单项时导航菜单应全部收起
      if (this.app.custom.sideAccordion) {
        const activeRouter = this.addRoutes.find(router => router.name === key);
        // const activeRouter = this.newAddRoutes.find(router => router.name === key);
        if (activeRouter && !activeRouter.parentCode) {
          this.openKeys = [];
        }
      }
      this.$router.replace({ name: key });
    },
    // 获取用户信息
    getUserInfo() {
      if (this.userGuid) {
        this.side.getUserMenu();
      }
    },
  },
};
</script>
