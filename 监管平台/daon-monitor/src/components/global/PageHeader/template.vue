<template>
  <div class="mod-page-header">
    <breadcrumb v-if="breadcrumb" />
    <slot></slot>
  </div>
</template>

<script>
import Breadcrumb from './components/Breadcrumb';

export default {
  name: 'PageHeader',
  props: {
    breadcrumb: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Breadcrumb,
  },
};
</script>
