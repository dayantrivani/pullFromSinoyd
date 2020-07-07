<template>
  <i v-if="name.includes('icon-')" :class="`icon-svg ${customClass}`" :style="offset" aria-hidden="true">
    <svg :style="{ 'font-size': size, 'top': topOffset }">
      <use :xlink:href="`#${name}`"></use>
    </svg>
  </i>
  <a-icon v-else :type="name" :class="`icon-svg ${customClass}`" :style="{ 'font-size': size, ...offset }" />
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '',
    },
    customClass: {
      type: String,
      default: '',
    },
    offset: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    topOffset() {
      if (this.size.includes('px')) {
        return 0;
      }
      const size = parseFloat(this.size);
      return size <= 1 ? 0 : `${(size - 1) / 2}em`;
    },
  },
};
</script>
