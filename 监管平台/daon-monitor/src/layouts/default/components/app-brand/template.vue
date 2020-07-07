<template>
  <div class="app-brand">
    <div class="brand">
      <icon :name="$config.app.icon" />
    </div>
    <span class="text-bright">{{ title[0] }} </span>{{ title[1] }}
  </div>
</template>

<script>
export default {
  computed: {
    title() {
      const { title } = this.$config.app;
      return title.split(' ');
    },
  },
};
</script>
