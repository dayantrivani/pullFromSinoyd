<!-- 顶栏 -->
<template>
  <!-- 标识 -->
  <div :class="{ 'brand': 1, 'is-fold': isFold}">
    <i class="el-icon-document-copy"></i>
    <span></span>{{ logo[0] }}
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
};
</script>
