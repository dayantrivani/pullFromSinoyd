<template>
    <button v-show="$config.app.useRefresh" class="btn" title="刷新" @click="RELOAD_VIEW()">
      <icon name="refresh" size="1.4em" />
    </button>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'ToggleRefresh',
  inject: ['app'],
  methods: mapMutations('tagsView', ['RELOAD_VIEW']),
};
</script>
