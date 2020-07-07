<template>
  <div class="user-info">
    <!-- 即时消息 -->
    <message />
    <!-- 用户信息 -->
    <span class="intro">
      <img class="avater bounceInDown" src="img/avater-man_200x200.png" alt="user" />
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
