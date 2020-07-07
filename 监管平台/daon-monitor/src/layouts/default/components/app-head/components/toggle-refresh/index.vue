<template>
    <button v-show="$config.layout.refreshBtnShow" class="btn" title="刷新" @click="reset()">
      <icon name="icon-refresh" size="1.1em" :offset="{ top: '2px' }" />
    </button>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ToggleRefresh',
  inject: ['app'],
  methods: {
    ...mapMutations('tagsView', ['RELOAD_VIEW']),
    reset() {
      // console.log(this.$route);
      // this.$router.push(this.$route.path);
      // this.$router.go(0);
      // this.RELOAD_VIEW();
      this.$router.push({
        name: 'transit',
        params: {
          name: this.$route.name,
        },
      });
    },
  },
};
</script>
