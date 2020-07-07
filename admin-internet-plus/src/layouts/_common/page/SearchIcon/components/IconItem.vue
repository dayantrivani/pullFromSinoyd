<template>
  <div class="icon-item" :title="copyText">
    <div v-copy="copyText" class="icon-block">
      <icon :name="icon" size="50px" />
    </div>
    <div v-copy="icon" class="icon-label i-overflow">{{ icon }}</div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  computed: {
    copyText() {
      return `<icon name="${this.icon}" />`;
    },
  },
};
</script>
