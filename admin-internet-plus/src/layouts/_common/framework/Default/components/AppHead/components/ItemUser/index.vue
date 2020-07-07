<template>
  <el-dropdown
    size="medium"
    @visible-change="v => visible = v"
    @command="onCommand"
  >
    <button :class="{
      'btn': 1,
      'item-user': 1,
      'pad-x-md': 1,
      'is-opened': visible,
      }">
      <span class="avatar pad-r-md">
        <icon name="avatar" scale="2" />
      </span>
      <cite class="mar-r-md">{{ userInfo.userName || '未登录' }}</cite>
      <span :class="{ 'btn-more': 1, 'mar-r-sm': 1, 'mored': visible }"></span>
    </button>
    <el-dropdown-menu slot="dropdown" class="mar-t-0">
      <el-dropdown-item v-if="userInfo.orgs" disabled>
        <div class="flex-y-center">
          <el-avatar shape="square" size="medium" :src="userInfo.orgs[0].logo"></el-avatar>
          <span class="pad-l-sm">{{ userInfo.orgs[0].orgName }}</span>
        </div>
      </el-dropdown-item>
      <el-dropdown-item v-if="userInfo.orgs" divided command="enter">
        <icon name="toggle" class="mar-r-sm" />
        <span>切换企业</span>
      </el-dropdown-item>
      <el-dropdown-item v-if="$config.app.useCustom" command="theme">
        <icon name="theme" class="mar-r-sm" />
        <span>主题设置</span>
      </el-dropdown-item>
      <el-dropdown-item divided command="logout">
        <icon name="logout" class="mar-r-sm" />
        <span>退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ItemUser',
  inject: ['app'],
  computed: mapState('auth', ['userInfo']),
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    ...mapActions('auth', ['Logout']),
    ...mapActions('tagsView', ['SetView']),
    onClickLogout() {
      this.SetView({ type: 'REMOVE_ALL_VIEWS', view: this.$route });
      this.$router.replace({ name: 'login' });
      this.Logout();
    },
    onCommand(command) {
      if (command === 'logout') {
        this.onClickLogout();
      } else if (command === 'theme') {
        this.$router.replace({ name: 'theme-config' });
      }
    },
  },
};
</script>
