<template>
  <header>
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
    // 是否折叠侧栏
    isFold() {
      return this.$store.state.isFold;
    },
  },
  methods: {
    onToggleSide() {
      this.$store.commit('SetIsFold', !this.isFold);
    },
  },
};
</script>
