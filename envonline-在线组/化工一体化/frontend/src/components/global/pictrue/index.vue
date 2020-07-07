<template>
  <div class="pictrue">
    <img :src="url" alt="">
  </div>
</template>

<script>
export default {
  name: 'pictrue',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
};
</script>
