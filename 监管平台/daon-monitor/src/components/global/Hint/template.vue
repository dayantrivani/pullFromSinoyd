<template>
  <a-tooltip
    overlayClassName="mod-hint-popper"
    v-bind="$attrs">
    <span class="mod-hint">
      <icon class="mar-l-xs" :name="icon" />
    </span>
  </a-tooltip>
</template>

<script>
export default {
  name: 'Hint',
  props: {
    icon: {
      type: String,
      default: 'question-circle',
    },
  },
};
</script>
