<!-- 顶栏 -->
<template>
  <!-- 标识 -->
  <div class="brand">
    <span>{{ logo[0] }}</span>{{ logo[1] }}
    <button class="u-side-btn"
            @click="onToggleSide()">
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
    // logo标题
    logo() {
      if (typeof this.$config.logo === 'string') {
        return ['', this.$config.logo];
      }
      return this.$config.logo;
    },
  },
  methods: {
    onToggleSide() {
      this.$store.commit('SetIsFold', !this.isFold);
    },
  },
};
</script>
