<template>
  <div v-if="$config.app.moduleUse" class="item-system">
    <div class="sys-group">
      <div
        v-for="item in userMenu"
        :key="item.id"
        :class="{ 'sys-item': 1, 'is-active': navKey === item.id }"
        @click="onClickToggle(item)">
        <icon :name="item.icon" />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ItemSystem',
  inject: ['app'],
  computed: mapState('auth', ['navKey', 'userMenu']),
  data() {
    return {
      visibleSystem: false,
    };
  },
  methods: {
    ...mapMutations('auth', ['ToggleMenu']),
    open() {
      this.visibleSystem = true;
    },
    close() {
      this.visibleSystem = false;
    },
    onClickToggle(item) {
      this.ToggleMenu(item.id);
    },
  },
};
</script>
