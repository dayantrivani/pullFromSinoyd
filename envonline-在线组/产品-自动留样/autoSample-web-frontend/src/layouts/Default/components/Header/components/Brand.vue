<!-- 顶栏 -->
<template>
  <!-- 标识 -->
  <div class="brand">
    <span></span>自动留样
    <button class="u-side-btn" @click="onToggleSide()">
      <i :class="`fas fa-chevron-${isFold ? 'left' : 'right'}`"></i>
    </button>
  </div>
</template>

<script>

export default {
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
