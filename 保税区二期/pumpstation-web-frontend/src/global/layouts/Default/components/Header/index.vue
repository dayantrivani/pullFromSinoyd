<template>
  <header>
    <!-- 顶部控制侧栏折叠的按钮 -->
    <button class="btn-toggle" @click="onToggleSide()">
      <i :class="`fas fa-${isFold ? 'out' : 'in'}dent`"></i>
    </button>
    <!-- center: 标签栏 -->
    <tags-view />
    <!-- right: 用户信息 -->
    <user-info />
  </header>
</template>

<script>
import TagsView from './components/TagsView';
import UserInfo from './components/UserInfo';

export default {
  components: {
    TagsView,
    UserInfo,
  },
  computed: {
    // 是否折叠侧栏,用于改变折叠按钮的样式
    isFold() {
      return this.$store.state.isFold;
    },
  },
  methods: {
    // 点击决定侧栏是否折叠
    onToggleSide() {
      this.$store.commit('SetIsFold', !this.isFold);
    },
  },
};
</script>
