<template>
  <div style="display: inline-block;">
     <a-avatar :src="`/api/monitor/static/files/${userInfo.pic || userImg }`" />
    <a-dropdown v-model="visible">
      <button title="注销" :class="{
        'btn': 1,
        'item-user': 1,
        'pad-x-md': 1,
        'is-opened': visible,
        }">
        <cite class="mar-r-md">{{ userInfo.name || '未登录' }}</cite>
        <span :class="{ 'btn-more': 1, 'mar-r-sm': 1, 'mored': visible }"></span>
      </button>
      <template v-slot:overlay>
        <a-menu>
          <a-menu-item @click="onClickChangeSys">
            <icon name="setting" class="mar-r-sm" />
            <span>系统切换</span>
          </a-menu-item>
          <a-menu-item>
            <a-icon type="dot-chart" />
            <span @click="$router.push('/ThematicMapNew')">专题图</span>
          </a-menu-item>
          <a-menu-item>
            <a-icon type="cloud-download" />
            <span @click="$refs.app.openDialog()">下载app</span>
          </a-menu-item>
          <a-menu-item>
            <a-icon type="user" />
            <span @click="onClickSet">个人设置</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item @click="onClickLogout()">
            <icon name="icon-logout" class="mar-r-sm" :offset="{ top: '2px' }" />
            <span>注 销</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <DialogSys ref="dialog"></DialogSys>
    <dialog-settings ref="settings"></dialog-settings>
    <down-app ref="app"></down-app>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DialogSys from './components/DialogSystem';
import DialogSettings from './components/DialogSettings';
import DownApp from './components/DownApp';
import userImg from '@/assets/img/user_avater_man_100x100.jpg';

export default {
  name: 'ItemUser',
  inject: ['app'],
  components: {
    DialogSys,
    DialogSettings,
    DownApp,
  },
  computed: mapState('auth', ['userInfo']),
  data() {
    return {
      visible: false,
      userImg,
    };
  },
  methods: {
    ...mapMutations('auth', ['Logout']),
    ...mapMutations('tagsView', ['RESET_TAGS']),
    // 切换系统
    onClickChangeSys() {
      this.$refs.dialog.openDialog();
    },
    onClickLogout() {
      this.Logout();
      this.$router.replace({ name: 'login' });
      this.RESET_TAGS();
    },
    onClickSet() {
      this.$refs.settings.openDialog();
    },
  },
};
</script>
