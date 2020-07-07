<template>
  <div class="user-info">
    <!-- 即时消息 -->
    <message />
    <!-- 用户信息 -->
    <span class="intro">
      <img class="avater am-spin-hover" src="@/assets/img/user_avater_man_100x100.jpg" alt="user" />
      <span>欢迎，{{ name }}</span>
    </span>
    <!-- 用户菜单 -->
    <setting-menu />
  </div>
</template>

<script>
import Message from './components/Message';
import SettingMenu from './components/SettingMenu';

export default {
  components: {
    Message,
    SettingMenu,
  },
  computed: {
    name() {
      return this.$store.state.auth.user.userName || '';
    },
  },
};
</script>
