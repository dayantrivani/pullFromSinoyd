<template>
  <div v-if="$config.app.useHelper" class="btn item-helper">
    <button
      title="助手"
      :class="{ 'btn': 1, 'is-opened': visibleDrawer }"
      @click="open()">
      <icon name="more" size="1.2em" />
    </button>
  </div>
</template>

<script>

export default {
  name: 'ItemDrawer',
  inject: ['app'],
  data() {
    return {
      visibleDrawer: false,
    };
  },
  methods: {
    open() {
      this.visibleDrawer = true;
    },
    close() {
      this.visibleDrawer = false;
    },
  },
};
</script>
